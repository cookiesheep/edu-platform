import { NextResponse } from 'next/server';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.FASTGPT_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || process.env.FASTGPT_API_URL || 'https://api.fastgpt.io/api/v1/chat/completions';
const BACKUP_API_URL = 'https://globalai.vip/v1/messages'; // 尝试标准Claude API格式
const API_TIMEOUT = 120000; // 增加到120秒超时，适应Vercel部署环境

// 强制使用真实API，禁用模拟数据
const USE_MOCK_API = false;

/**
 * 学习内容生成API
 */
export async function POST(request) {
  try {
    // 详细的API配置检查和日志
    console.log('=== 内容生成API配置检查 ===');
    console.log('CLAUDE_API_KEY存在:', !!CLAUDE_API_KEY);
    console.log('CLAUDE_API_KEY长度:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);
    console.log('CLAUDE_API_KEY前缀:', CLAUDE_API_KEY ? CLAUDE_API_KEY.substring(0, 20) + '...' : 'undefined');
    console.log('CLAUDE_API_URL:', CLAUDE_API_URL);
    console.log('API_TIMEOUT:', API_TIMEOUT);
    
    // 检查API配置
    if (!CLAUDE_API_KEY) {
      console.error('❌ API密钥未配置');
      return NextResponse.json(
        { error: 'API服务未配置，请联系管理员' },
        { status: 500 }
      );
    }

    if (CLAUDE_API_KEY.includes('your-') || CLAUDE_API_KEY.length < 20) {
      console.error('❌ API密钥无效，仍为模板值');
      return NextResponse.json(
        { error: 'API密钥未正确配置，请检查环境变量中的API密钥' },
        { status: 500 }
      );
    }

    // 解析请求体
    const requestData = await request.json();
    
    console.log('✅ 接收到内容生成请求:', {
      knowledge_point: requestData.knowledge_point,
      subject_domain: requestData.subject_domain,
      cognitive_level: requestData.cognitive_level
    });
    
    // 构建精简的系统提示词
    const systemPrompt = buildOptimizedSystemPrompt(requestData);
    
    // 使用简化的用户提示词
    const userPrompt = `请为${requestData.cognitive_level}水平学习者生成关于"${requestData.knowledge_point}"的学习指南。采用${requestData.learning_style}学习方式，目标是${requestData.learning_objective}。要求简洁实用。`;
    
    // 使用重试机制调用API
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🚀 开始第${attempt}次内容生成API调用...`);
        const apiResponse = await callClaudeAPIWithRetry(CLAUDE_API_URL, systemPrompt, userPrompt, attempt);
        
        console.log(`✅ 内容生成成功（第${attempt}次尝试）`);
        
        return NextResponse.json({ 
          success: true,
          content: apiResponse.trim(),
          metadata: {
            attempt: attempt,
            timestamp: new Date().toISOString()
          }
        });
      } catch (apiError) {
        console.error(`❌ 第${attempt}次API调用失败:`, apiError.message);
        lastError = apiError;
        
        if (apiError.name === 'AbortError' && attempt < maxRetries) {
          console.log(`⏳ 超时重试，等待2秒...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        } else if (apiError.message.includes('fetch') && attempt < maxRetries) {
          console.log(`⏳ 网络错误重试，等待3秒...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        } else if (apiError.message.includes('429') && attempt < maxRetries) {
          console.log(`⏳ API限流重试，等待2秒...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        } else {
          // 其他错误或最后一次重试，退出循环
          break;
        }
      }
    }

    // 所有重试都失败了，返回备用内容
    console.error('❌ 所有内容生成重试都失败了，返回备用内容');
    const fallbackContent = generateFallbackContent(requestData);
    
    return NextResponse.json(
      { 
        success: true,
        content: fallbackContent,
        metadata: {
          is_fallback: true,
          error_info: lastError?.message,
          timestamp: new Date().toISOString()
        }
      }
    );
  } catch (error) {
    console.error('❌ 内容生成API错误:', error);
    return NextResponse.json(
      { 
        error: `请求处理失败: ${error.message}`,
        debug_info: {
          timestamp: new Date().toISOString(),
          api_configured: !!CLAUDE_API_KEY
        }
      },
      { status: 400 }
    );
  }
}

/**
 * 构建优化的系统提示词 - 大幅简化以减少请求体大小
 */
function buildOptimizedSystemPrompt(data) {
  return `您是EduSage学习内容生成系统。

学习者：${data.cognitive_level}水平，${data.learning_style}学习方式
目标：${data.learning_objective}

请生成关于"${data.knowledge_point}"的学习指南，包含：

1. 📚 概念解析（简洁易懂）
2. 🎯 学习目标（3-5个要点）
3. 💡 核心内容（重点突出）
4. 🔍 实例应用（2-3个案例）
5. ✅ 自我检测（简单问题）
6. 📖 资源推荐

要求：
- 适合${data.cognitive_level}水平
- 采用${data.learning_style}表达方式
- 简洁实用，重点突出
- 避免冗长理论${data.learning_style === '视觉型' ? '\n- 可添加简单图表说明' : ''}`;
}

/**
 * 调用Claude API（带重试机制）
 */
async function callClaudeAPIWithRetry(apiUrl, systemPrompt, userPrompt, attempt) {
  try {
    console.log(`调用Claude API (${apiUrl}) - 第${attempt}次尝试...`);
    
    // 使用AbortController设置超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    // 使用简单稳定的模型
    const selectedModel = 'claude-3-5-sonnet-20241022';
    
    console.log('系统提示词长度:', systemPrompt.length);
    console.log('用户提示词:', userPrompt);
    
    // 准备请求体 - 使用标准的Claude API格式
    const requestBody = {
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500 // 减少token数量，提高响应速度
    };
    
    console.log(`使用模型: ${selectedModel}`);
    console.log('请求体大小:', JSON.stringify(requestBody).length, 'bytes');
    
    // 添加必要的请求头
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${CLAUDE_API_KEY}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);  // 清除超时设置
    
    console.log('API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API错误状态码:', response.status);
      console.error('Claude API错误响应:', errorText);
      
      // 根据错误状态码提供具体处理
      if (response.status === 401) {
        throw new Error('API密钥无效，请检查配置');
      } else if (response.status === 429) {
        throw new Error('API调用频率超限，请稍后再试');
      } else if (response.status === 503 || response.status === 504) {
        throw new Error('API服务暂时不可用，请稍后再试');
      } else {
        throw new Error(`API请求失败(${response.status}): ${errorText}`);
      }
    }
    
    const responseText = await response.text();
    console.log('原始响应文本长度:', responseText.length);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('收到的文本:', responseText.substring(0, 200) + '...');
      
      // 如果不是JSON格式，但是看起来像是文本内容，就直接返回
      if (responseText && responseText.length > 50 && !responseText.startsWith('<')) {
        console.log('响应不是JSON，但可能是文本内容，直接返回');
        return responseText;
      }
      
      throw new Error(`无法解析API响应: ${parseError.message}`);
    }
    
    console.log('Claude API响应结构:', Object.keys(data));
    
    // 尝试从各种可能的响应格式中提取内容
    const textContent = extractContentFromResponse(data);
    
    if (!textContent) {
      console.error('无法从响应中提取文本内容:', JSON.stringify(data).substring(0, 300));
      throw new Error('无法从响应中提取文本内容');
    }
    
    console.log('成功提取文本内容长度:', textContent.length);
    return textContent;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('API请求超时，请稍后再试');
    }
    console.error('调用Claude API出错:', error);
    throw error;
  }
}

// 从API响应中提取文本内容，尝试多种可能的响应格式
function extractContentFromResponse(data) {
  console.log('尝试从响应中提取内容，响应格式:', typeof data);
  
  // 如果是字符串，直接返回
  if (typeof data === 'string') {
    return data;
  }
  
  try {
    // 尝试方法1: Claude标准格式 {content: [{type: "text", text: "..."}]}
    if (data.content && Array.isArray(data.content)) {
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n\n');
        
      if (textContent) {
        console.log('使用content[].text格式提取成功');
        return textContent;
      }
    }
    
    // 尝试方法2: OpenAI格式 {choices: [{message: {content: "..."}}]}
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      if (data.choices[0].message && data.choices[0].message.content) {
        console.log('使用choices[0].message.content格式提取成功');
        return data.choices[0].message.content;
      }
      
      if (data.choices[0].text) {
        console.log('使用choices[0].text格式提取成功');
        return data.choices[0].text;
      }
    }
    
    // 尝试方法3: 直接text字段
    if (data.text) {
      console.log('使用data.text格式提取成功');
      return data.text;
    }
    
    // 尝试方法4: 直接answer字段
    if (data.answer) {
      console.log('使用data.answer格式提取成功');
      return data.answer;
    }
    
    // 尝试方法5: 找到任何可能包含文本的字段
    for (const key in data) {
      if (typeof data[key] === 'string' && data[key].length > 100) {
        console.log(`使用data.${key}格式提取成功`);
        return data[key];
      }
    }
    
    // 如果未找到任何文本内容，则将整个响应转换为字符串
    console.log('未找到结构化文本内容，返回整个响应');
    return JSON.stringify(data);
  } catch (error) {
    console.error('提取内容时出错:', error);
    return JSON.stringify(data);
  }
}

/**
 * 生成备用内容（当API调用失败时使用）
 */
function generateFallbackContent(data) {
  const { knowledge_point, subject_domain, cognitive_level, learning_style, motivation_type } = data;
  
  return `# ${knowledge_point} 学习指南

## 📚 概念解析
${knowledge_point}是${subject_domain}中的重要概念。由于AI服务暂时不可用，这里为您提供基础的学习框架。

## 🎯 学习目标
- 理解${knowledge_point}的基本概念
- 掌握相关应用方法
- 能够解决实际问题

## 💡 核心内容
针对${cognitive_level}水平的学习者，建议从基础概念开始，逐步深入理解。

## 🔍 实例应用
请结合教材和课堂内容，寻找${knowledge_point}的具体应用实例。

## ✅ 自我检测
1. 能否用自己的话解释${knowledge_point}？
2. 能否举出相关的实际应用例子？
3. 能否识别相关的问题类型？

## 📖 资源推荐
- 查阅相关教材
- 咨询老师或同学
- 搜索在线学习资源

---

*注：由于AI服务暂时不可用，本内容为简化版本。建议稍后重试获取完整的个性化学习内容。*`;
} 