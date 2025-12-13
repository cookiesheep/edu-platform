const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const DEFAULT_TIMEOUT = 30000;

/**
 * 以流式方式调用 Claude，并将文本增量聚合成字符串返回。
 * 这样在 Vercel 上不会因长时间等待而被裁剪。
 */
export async function streamClaude({
  apiUrl = DEFAULT_URL,
  apiKey = process.env.CLAUDE_API_KEY,
  messages,
  system,
  model = DEFAULT_MODEL,
  maxTokens = 4000,
  temperature = 0.7,
  onChunk,
  timeoutMs = DEFAULT_TIMEOUT
}) {
  if (!apiKey) {
    throw new Error('缺少 CLAUDE_API_KEY');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // 判断是 Anthropic 官方 API 还是 OpenAI 兼容的代理
  const isAnthropicAPI = apiUrl.includes('anthropic.com');
  const isOpenAIFormat = apiUrl.includes('chat/completions');

  try {
    // 根据 API 类型构建请求头
    const headers = {
      'Content-Type': 'application/json',
    };

    if (isAnthropicAPI) {
      // Anthropic 官方 API 使用 x-api-key
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      headers['accept'] = 'text/event-stream';
    } else {
      // OpenAI 兼容格式使用 Authorization Bearer
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // 根据 API 类型构建请求体
    let requestBody;
    if (isOpenAIFormat) {
      // OpenAI 格式：system 放在 messages 中，使用 max_tokens
      requestBody = {
        model,
        messages: system 
          ? [{ role: 'system', content: system }, ...messages]
          : messages,
        max_tokens: maxTokens,
        temperature,
        stream: true
      };
    } else {
      // Anthropic 格式：system 是独立参数
      requestBody = {
        model,
        ...(system ? { system } : {}),
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Claude API错误 (${response.status}): ${text}`);
    }

    if (!response.body) {
      throw new Error('Claude API 响应无主体');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (!dataStr || dataStr === '[DONE]') continue;

        try {
          const payload = JSON.parse(dataStr);
          
          // 根据 API 类型提取文本内容
          let delta = '';
          
          if (isOpenAIFormat) {
            // OpenAI 格式：choices[0].delta.content
            delta = payload?.choices?.[0]?.delta?.content || '';
          } else {
            // Anthropic 格式：多种可能的路径
            delta =
              payload?.delta?.text ||
              payload?.content_block?.text ||
              payload?.content_block_delta?.text ||
              payload?.message?.content?.[0]?.text ||
              payload?.delta?.content?.[0]?.text ||
              '';
          }

          if (delta) {
            fullText += delta;
            onChunk?.(delta);
          }
        } catch (err) {
          console.warn('解析流数据失败:', err?.message || err);
        }
      }
    }

    return fullText;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Claude API 响应超时');
    }
    throw err;
  }
}

/**
 * Generator version of streamClaude for Edge Runtime
 * 支持流式返回文本块，适用于 Edge Runtime
 */
export async function* streamClaudeGenerator({
  apiUrl = DEFAULT_URL,
  apiKey = process.env.CLAUDE_API_KEY,
  messages,
  system,
  model = DEFAULT_MODEL,
  maxTokens = 4000,
  temperature = 0.7,
  timeoutMs = DEFAULT_TIMEOUT
}) {
  if (!apiKey) throw new Error('缺少 CLAUDE_API_KEY');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const isAnthropicAPI = apiUrl.includes('anthropic.com');
  const isOpenAIFormat = apiUrl.includes('chat/completions');

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (isAnthropicAPI) {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      headers['accept'] = 'text/event-stream';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    let requestBody;
    if (isOpenAIFormat) {
      requestBody = {
        model,
        messages: system ? [{ role: 'system', content: system }, ...messages] : messages,
        max_tokens: maxTokens,
        temperature,
        stream: true
      };
    } else {
      requestBody = {
        model,
        ...(system ? { system } : {}),
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Claude API错误 (${response.status}): ${text}`);
    }
    if (!response.body) throw new Error('Claude API 响应无主体');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (!dataStr || dataStr === '[DONE]') continue;

        try {
          const payload = JSON.parse(dataStr);
          let delta = '';
          
          if (isOpenAIFormat) {
            delta = payload?.choices?.[0]?.delta?.content || '';
          } else {
            delta =
              payload?.delta?.text ||
              payload?.content_block?.text ||
              payload?.content_block_delta?.text ||
              payload?.message?.content?.[0]?.text ||
              payload?.delta?.content?.[0]?.text ||
              '';
          }

          if (delta) yield delta;
        } catch (e) { /* ignore */ }
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

