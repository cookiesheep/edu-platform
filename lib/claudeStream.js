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

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model,
        ...(system ? { system } : {}),
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true
      }),
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
          const delta =
            payload?.delta?.text ||
            payload?.content_block?.text ||
            payload?.content_block_delta?.text ||
            payload?.message?.content?.[0]?.text ||
            payload?.delta?.content?.[0]?.text ||
            '';

          if (delta) {
            fullText += delta;
            onChunk?.(delta);
          }
        } catch (err) {
          console.warn('解析 Claude 流数据失败:', err?.message || err);
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

