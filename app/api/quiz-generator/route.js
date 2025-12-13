export const runtime = 'nodejs';
import { streamClaude } from '@/lib/claudeStream';

// 从环境变量获取API配置 - 支持多种API服务
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 30000; // 30秒超时

// 检测API服务类型
const isOpenAIFormat = CLAUDE_API_URL.includes('chat/completions') || CLAUDE_API_URL.includes('openai') || CLAUDE_API_URL.includes('globalai');
const isClaudeFormat = CLAUDE_API_URL.includes('anthropic') || CLAUDE_API_URL.includes('/messages');

// 备用API服务列表
const FALLBACK_APIS = [
  {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'claude-sonnet-4-20250514',
    format: 'openai'
  },
  {
    name: 'Moonshot',
    url: 'https://api.moonshot.cn/v1/chat/completions', 
    model: 'claude-sonnet-4-20250514',
    format: 'openai'
  },
  {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'claude-sonnet-4-20250514',
    format: 'openai'
  }
];

export async function POST(req) {
  try {
    // 添加详细的API配置日志
    console.log('=== API配置检查 ===');
    console.log('CLAUDE_API_KEY存在:', !!CLAUDE_API_KEY);
    console.log('CLAUDE_API_KEY长度:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);
    console.log('CLAUDE_API_KEY前缀:', CLAUDE_API_KEY ? CLAUDE_API_KEY.substring(0, 20) + '...' : 'none');
    console.log('CLAUDE_API_URL:', CLAUDE_API_URL);
    console.log('API_TIMEOUT:', API_TIMEOUT);

    // 解析请求数据
    const formData = await req.json();
    console.log('✅ 收到试题生成请求:', {
      grade_level: formData.grade_level,
      subject: formData.subject,
      self_assessed_level: formData.self_assessed_level
    });

    // 验证必要字段
    const { grade_level, subject, self_assessed_level, learning_goal } = formData;
    if (!grade_level || !subject || !self_assessed_level || !learning_goal) {
      return Response.json(
        { error: '请填写所有必要字段' },
        { status: 400 }
      );
    }

    // 构建系统指令和用户内容
    const { systemPrompt, userContent } = buildPrompts(formData);

    // 检查是否配置了API密钥
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your-claude-api-key-here') {
      console.error('❌ API密钥未配置，无法使用真实API服务');
      return Response.json(
        { 
          error: 'API服务未配置', 
          details: '请在.env.local文件中配置真实的CLAUDE_API_KEY',
          config_required: true
        },
        { status: 500 }
      );
    }

    // 用户配置了API密钥，强制使用真实API，不使用模拟数据
    console.log('🚀 使用真实API服务 (用户要求不使用模拟数据)');

    // 尝试主API服务
    try {
      const result = await callAPI(CLAUDE_API_URL, CLAUDE_API_KEY, systemPrompt, userContent, isOpenAIFormat ? 'claude-sonnet-4-20250514' : 'claude-sonnet-4-20250514', formData);
      if (result.success) {
        console.log('✅ 主API服务调用成功');
        return Response.json(result);
      }
    } catch (error) {
      console.log('❌ 主API服务失败:', error.message);
    }

    // 如果主API失败，尝试备用服务（仍然使用真实API）
    console.log('🔄 主API失败，尝试备用API服务...');
    for (const fallbackAPI of FALLBACK_APIS) {
      try {
        console.log(`📡 尝试 ${fallbackAPI.name} API...`);
        const result = await callAPI(fallbackAPI.url, CLAUDE_API_KEY, systemPrompt, userContent, fallbackAPI.model, formData);
        if (result.success) {
          console.log(`✅ ${fallbackAPI.name} API 调用成功`);
          return Response.json(result);
        }
      } catch (error) {
        console.log(`❌ ${fallbackAPI.name} API 失败:`, error.message);
        continue;
      }
    }

    // 所有API都失败，返回错误（不使用模拟数据）
    console.error('❌ 所有API服务都不可用');
    return Response.json(
      { 
        error: 'AI服务暂时不可用，所有API服务都调用失败',
        details: '请检查API密钥是否有效，或稍后重试',
        all_apis_failed: true
      },
      { status: 503 }
    );

  } catch (error) {
    console.error('💥 试题生成失败:', error);
    return Response.json(
      { 
        error: `试题生成失败：${error.message}`,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// 构建提示词
function buildPrompts(formData) {
  const { grade_level, subject, self_assessed_level, learning_goal } = formData;
  
  const systemPrompt = `您是"EduAssess"，一个专业的自适应教育评估系统。您的任务是根据学习者的年级、学科选择和自评水平，生成精确校准的摸底测试题目，用于评估学习者的实际水平和知识缺口。

## 学习者信息分析
- 年级：${grade_level}
- 学科：${subject}
- 自评水平：${self_assessed_level}
- 学习目标：${learning_goal}

## 试题设计参数
- 测试时长：${formData.quiz_time || 15}分钟内可完成
- 题型组合：选择题（单选/多选）和填空题
- 难度分布：根据自评水平动态调整，确保覆盖必要的先验知识和目标知识点
- 知识点覆盖：包含目标学科核心知识点和必要的先验知识点

**重要：请严格按照以下格式输出，题目和答案必须分离：**

===QUIZ_CONTENT_START===
# ${subject}摸底测试（${grade_level}）
## 📝 测试说明
- 测试时间：约${formData.quiz_time || 15}分钟
- 测试目的：评估您在${subject}的基础知识和关键能力

## 选择题部分
1. [题目内容]
   A. [选项A]
   B. [选项B] 
   C. [选项C]
   D. [选项D]

## 填空题部分
1. [题目内容，用____表示填空位置]
===QUIZ_CONTENT_END===

===ANSWERS_START===
## 答案和解析
### 选择题答案
1. 答案：[正确选项] | 解析：[详细解释]

### 填空题答案  
1. 答案：[正确答案] | 解析：[详细解释]
===ANSWERS_END===

请生成高质量的试题内容，确保题目难度适合${self_assessed_level}水平的${grade_level}学生。`;

  const userContent = `请为我生成一套${grade_level}${subject}摸底测试，我的自评水平是${self_assessed_level}，学习目标是${learning_goal}。

**必须严格按照指定格式输出，使用===QUIZ_CONTENT_START===和===QUIZ_CONTENT_END===包围题目内容，使用===ANSWERS_START===和===ANSWERS_END===包围答案内容。**

题目要求：
- 选择题5道，填空题5道
- 难度适合${self_assessed_level}水平
- 符合${grade_level}年龄特点
- 覆盖${subject}核心知识点

请确保格式完全正确，题目和答案严格分离。`;

  return { systemPrompt, userContent };
}

// 调用API的通用函数
async function callAPI(apiUrl, apiKey, systemPrompt, userContent, model, formData) {
  const isOpenAIFormat = apiUrl.includes('chat/completions');
  const isAnthropic = apiUrl.includes('anthropic.com');

  console.log('🚀 开始调用API...');
  console.log('📡 API URL:', apiUrl);
  console.log('🔑 API Key前缀:', apiKey.substring(0, 20) + '...');
  console.log('📤 请求模型:', model);

  try {
    let generatedContent;

    if (isAnthropic) {
      generatedContent = await streamClaude({
        apiUrl,
        apiKey,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userContent }
        ],
        maxTokens: 4000,
        temperature: 0.7,
        timeoutMs: API_TIMEOUT
      });
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      let requestBody;
      let headers = {
        'Content-Type': 'application/json'
      };
      
      // Claude API 使用 x-api-key，OpenAI 格式使用 Authorization
      if (isOpenAIFormat) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      } else {
        headers['x-api-key'] = apiKey;
      }

      if (isOpenAIFormat) {
        requestBody = {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          max_tokens: 4000,
          temperature: 0.7
        };
      } else {
        headers['anthropic-version'] = '2023-06-01';
        requestBody = {
          model: model,
          messages: [
            { role: 'user', content: `${systemPrompt}\n\n${userContent}` }
          ],
          max_tokens: 4000,
          temperature: 0.7
        };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📥 API响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API错误详情:', errorText);
        throw new Error(`API调用失败 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API响应成功');

      if (data.choices && data.choices[0]) {
        generatedContent = data.choices[0].message?.content;
      } else if (data.content && data.content[0]) {
        generatedContent = data.content[0].text;
      } else {
        console.error('❌ 无法解析API响应:', data);
        throw new Error('AI响应格式无效');
      }
    }

    if (!generatedContent) {
      throw new Error('AI响应内容为空');
    }

    console.log('✅ 内容提取成功，长度:', generatedContent.length);

    // 分离试题内容和答案 - 多种方法确保正确分离
    let quizContent = '';
    let answersContent = '';

    // 方法1：使用标准分隔符
    const quizContentMatch = generatedContent.match(/===QUIZ_CONTENT_START===([\s\S]*?)===QUIZ_CONTENT_END===/);
    const answersMatch = generatedContent.match(/===ANSWERS_START===([\s\S]*?)===ANSWERS_END===/);

    if (quizContentMatch && answersMatch) {
      // 标准格式分离成功
      quizContent = quizContentMatch[1].trim();
      answersContent = answersMatch[1].trim();
      console.log('✅ 使用标准格式成功分离内容');
    } else {
      // 方法2：使用备用分离逻辑
      console.log('⚠️ 标准格式分离失败，使用备用方法');
      
      // 查找答案部分的开始位置
      const answerSectionMarkers = [
        '## 答案和解析',
        '答案：',
        '### 选择题答案',
        '### 填空题答案',
        '解析：'
      ];
      
      let answerStartIndex = -1;
      let usedMarker = '';
      
      for (const marker of answerSectionMarkers) {
        const index = generatedContent.indexOf(marker);
        if (index !== -1) {
          answerStartIndex = index;
          usedMarker = marker;
          break;
        }
      }
      
      if (answerStartIndex !== -1) {
        // 找到答案部分，进行分离
        quizContent = generatedContent.substring(0, answerStartIndex).trim();
        answersContent = generatedContent.substring(answerStartIndex).trim();
        console.log(`✅ 使用备用方法成功分离内容，标记: "${usedMarker}"`);
      } else {
        // 方法3：如果找不到答案标记，只使用前面部分作为题目
        console.log('⚠️ 无法找到答案标记，使用整体内容作为题目');
        quizContent = generatedContent;
        answersContent = '';
      }
    }

    // 验证分离结果
    console.log('📊 分离结果统计:');
    console.log('  - 题目内容长度:', quizContent.length);
    console.log('  - 答案内容长度:', answersContent.length);
    console.log('  - 题目内容预览:', quizContent.substring(0, 200) + '...');

    return {
      success: true,
      quiz_data: {
        quiz_content: quizContent,
        answers_content: answersContent,
        full_content: generatedContent,
        separation_method: quizContentMatch && answersMatch ? 'standard' : 'fallback',
        metadata: {
          model: 'EduAssess',
          api_used: apiUrl,
          parameters: {
            grade_level: formData.grade_level,
            subject: formData.subject,
            self_assessed_level: formData.self_assessed_level,
            learning_goal: formData.learning_goal,
            quiz_time: formData.quiz_time || 15,
            question_count: formData.question_count || 'auto'
          },
          timestamp: new Date().toISOString()
        }
      }
    };

  } catch (apiError) {
    clearTimeout(timeoutId);
    
    if (apiError.name === 'AbortError') {
      throw new Error('API请求超时');
    }
    
    throw apiError;
  }
} 
