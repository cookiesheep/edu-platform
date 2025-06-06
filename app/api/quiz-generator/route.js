// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.FASTGPT_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || process.env.FASTGPT_API_URL || 'https://api.fastgpt.io/api/v1/chat/completions';
const API_TIMEOUT = 60000; // 增加到60秒超时，避免API响应慢导致的超时

export async function POST(req) {
  try {
    // 详细的API配置检查和日志
    console.log('=== API配置检查 ===');
    console.log('CLAUDE_API_KEY存在:', !!CLAUDE_API_KEY);
    console.log('CLAUDE_API_KEY长度:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);
    console.log('CLAUDE_API_KEY前缀:', CLAUDE_API_KEY ? CLAUDE_API_KEY.substring(0, 20) + '...' : 'undefined');
    console.log('CLAUDE_API_URL:', CLAUDE_API_URL);
    console.log('API_TIMEOUT:', API_TIMEOUT);
    
    // 检查API配置
    if (!CLAUDE_API_KEY) {
      console.error('❌ API密钥未配置');
      return Response.json(
        { error: 'API服务未配置，请联系管理员' },
        { status: 500 }
      );
    }

    if (CLAUDE_API_KEY.includes('your-') || CLAUDE_API_KEY.length < 20) {
      console.error('❌ API密钥无效，仍为模板值');
      return Response.json(
        { error: 'API密钥未正确配置，请检查.env.local文件并填入真实的API密钥' },
        { status: 500 }
      );
    }

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

    // 构建精简的系统指令 - 减少请求体大小，提高响应速度
    const systemPrompt = `您是EduAssess教育评估系统。根据学习者信息生成摸底测试：

学习者：${grade_level} ${subject} ${self_assessed_level}水平
目标：${learning_goal}

要求：
1. 生成5-8道题目（选择题+填空题）
2. 难度适合${self_assessed_level}水平
3. 15分钟内完成
4. 题目简洁清晰
5. 分离题目和答案

格式：
===QUIZ_START===
# ${subject}摸底测试
## 选择题（3-4题）
1. [题目内容]
A. 选项A  B. 选项B  C. 选项C  D. 选项D

## 填空题（2-4题）  
1. [题目内容，用____表示空白]

===QUIZ_END===

===ANSWERS_START===
选择题答案：1.A 2.B...
填空题答案：1.答案1 2.答案2...
===ANSWERS_END===`;

    // 构建简化的用户请求
    const userContent = `请为${grade_level}${subject}学生生成${self_assessed_level}水平的摸底测试，学习目标是${learning_goal}。要求简洁高效，15分钟完成。`;

    // 使用重试机制调用API
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🚀 开始第${attempt}次API调用...`);
        console.log('📡 API URL:', CLAUDE_API_URL);
        console.log('⏱️ 超时设置:', API_TIMEOUT, 'ms');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const requestBody = {
          model: 'claude-3-sonnet-20240229',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userContent
            }
          ],
          max_tokens: 2000, // 减少token数量，提高响应速度
          temperature: 0.7
        };

        console.log('📤 请求体大小:', JSON.stringify(requestBody).length, 'bytes');

        const response = await fetch(CLAUDE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CLAUDE_API_KEY}`,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        console.log('📥 API响应状态:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API错误响应:', errorText);
          
          // 根据不同错误状态码提供更具体的错误信息
          if (response.status === 401) {
            return Response.json(
              { error: 'API密钥无效，请检查您的API密钥是否正确配置' },
              { status: 401 }
            );
          } else if (response.status === 429) {
            if (attempt < maxRetries) {
              console.log(`⏳ API限流，等待2秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            return Response.json(
              { error: 'API调用频率超限，请稍后再试' },
              { status: 429 }
            );
          } else if (response.status === 403) {
            return Response.json(
              { error: 'API访问被拒绝，请检查API密钥权限或余额' },
              { status: 403 }
            );
          } else {
            if (attempt < maxRetries) {
              console.log(`⏳ API错误(${response.status})，等待1秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            return Response.json(
              { error: `AI服务暂时不可用 (${response.status}): ${errorText}` },
              { status: response.status }
            );
          }
        }

        const data = await response.json();
        console.log('✅ API响应成功，数据大小:', JSON.stringify(data).length, 'bytes');

        // 提取生成的内容
        const generatedContent = data.choices?.[0]?.message?.content || data.content?.[0]?.text;
        
        if (!generatedContent) {
          console.error('❌ API响应格式无效:', Object.keys(data));
          if (attempt < maxRetries) {
            console.log(`⏳ 响应格式无效，等待1秒后重试...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return Response.json(
            { error: 'AI响应格式无效，请稍后再试' },
            { status: 502 }
          );
        }

        console.log('✅ 内容提取成功，长度:', generatedContent.length);

        // 分离试题内容和答案
        const quizContentMatch = generatedContent.match(/===QUIZ_START===([\s\S]*?)===QUIZ_END===/);
        const answersMatch = generatedContent.match(/===ANSWERS_START===([\s\S]*?)===ANSWERS_END===/);

        const quizContent = quizContentMatch ? quizContentMatch[1].trim() : generatedContent;
        const answersContent = answersMatch ? answersMatch[1].trim() : '';

        console.log('✅ 试题生成完成（第', attempt, '次尝试成功）');

        // 返回成功响应，包含分离的内容
        return Response.json({
          success: true,
          quiz_data: {
            quiz_content: quizContent,
            answers_content: answersContent,
            full_content: generatedContent,
            metadata: {
              model: 'EduAssess-Optimized',
              parameters: {
                grade_level,
                subject,
                self_assessed_level,
                learning_goal,
                quiz_time: formData.quiz_time || 15,
                question_count: formData.question_count || 'auto'
              },
              attempt: attempt,
              timestamp: new Date().toISOString()
            }
          },
          // 保持向后兼容性
          quiz_content: quizContent,
          answers_content: answersContent,
          full_content: generatedContent,
          metadata: {
            model: 'EduAssess-Optimized',
            parameters: {
              grade_level,
              subject,
              self_assessed_level,
              learning_goal,
              quiz_time: formData.quiz_time || 15,
              question_count: formData.question_count || 'auto'
            },
            attempt: attempt,
            timestamp: new Date().toISOString()
          }
        });

      } catch (error) {
        console.error(`❌ 第${attempt}次API调用异常:`, error.message);
        lastError = error;
        
        if (error.name === 'AbortError') {
          console.error(`❌ 第${attempt}次API调用超时`);
          if (attempt < maxRetries) {
            console.log(`⏳ 超时重试，等待2秒...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        } else if (error.message.includes('fetch')) {
          console.error(`❌ 第${attempt}次网络连接失败`);
          if (attempt < maxRetries) {
            console.log(`⏳ 网络错误重试，等待3秒...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue;
          }
        } else {
          // 其他错误不重试
          break;
        }
      }
    }

    // 所有重试都失败了
    console.error('❌ 所有重试都失败了');
    
    if (lastError?.name === 'AbortError') {
      return Response.json(
        { 
          error: `AI服务响应超时（已重试${maxRetries}次）。建议：1.检查网络连接 2.稍后再试 3.联系管理员`,
          debug_info: {
            api_url: CLAUDE_API_URL,
            timeout: API_TIMEOUT,
            has_key: !!CLAUDE_API_KEY,
            max_retries: maxRetries
          }
        },
        { status: 408 }
      );
    }
    
    if (lastError?.message.includes('fetch')) {
      return Response.json(
        { 
          error: `网络连接失败（已重试${maxRetries}次）。请检查网络连接或尝试其他API服务`,
          debug_info: {
            api_url: CLAUDE_API_URL,
            error_type: 'network_error',
            max_retries: maxRetries
          }
        },
        { status: 503 }
      );
    }
    
    throw lastError;

  } catch (error) {
    console.error('❌ 试题生成错误:', error);
    return Response.json(
      { 
        error: `AI服务暂时不可用：${error.message}。请稍后再试。`,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        debug_info: {
          timestamp: new Date().toISOString(),
          api_configured: !!CLAUDE_API_KEY
        }
      },
      { status: 503 }
    );
  }
} 