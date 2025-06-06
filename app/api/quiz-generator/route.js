// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.FASTGPT_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || process.env.FASTGPT_API_URL || 'https://api.fastgpt.io/api/v1/chat/completions';
const API_TIMEOUT = 30000; // 30秒超时

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

    // 构建EduAssess系统指令
    const systemPrompt = `您是"EduAssess"，一个专业的自适应教育评估系统。您的任务是根据学习者的年级、学科选择和自评水平，生成精确校准的摸底测试题目，用于评估学习者的实际水平和知识缺口。

## 学习者信息分析
- 年级：${grade_level}
  - 小学（1-6年级）
  - 初中（7-9年级）
  - 高中（10-12年级）
  - 大学（本科/研究生）
- 学科：${subject}
  - 数学、语文、英语、物理、化学、生物、历史、地理、政治等
- 自评水平：${self_assessed_level}
  - 入门级：刚接触该学科或有明显知识缺口
  - 基础级：掌握基本概念，但需要加强理解和应用
  - 中等级：理解大部分概念，但在复杂问题上有困难
  - 进阶级：较好地掌握该学科，寻求深入理解和挑战
- 学习目标：${learning_goal}
  - 查漏补缺：找出并弥补知识盲点
  - 能力提升：提高解题和应用能力
  - 考试准备：为特定考试做准备
  - 兴趣探索：出于兴趣深入学习

## 试题设计参数
- 测试时长：${formData.quiz_time || 15}分钟内可完成
- 题型组合：选择题（单选/多选）和填空题
- 难度分布：根据自评水平动态调整，确保覆盖必要的先验知识和目标知识点
- 知识点覆盖：包含目标学科核心知识点和必要的先验知识点
- 认知层次：包含记忆、理解、应用和分析等不同认知层次的题目

## 试题生成指令
基于上述学习者信息和试题设计参数，生成一套高质量的摸底测试题目。试题必须：

1. 精确匹配学习者的年级水平和自评能力
2. 包含对该学科学习必要的先验知识检测
3. 覆盖该学科的核心知识点和关键能力
4. 难度梯度合理，从基础到挑战
5. 题目表述清晰、准确、无歧义
6. 确保在${formData.quiz_time || 15}分钟内可以完成
7. 为每道题目提供标准答案和简要解析，但答案需要与试题分离存储

## 重要说明
请务必将试题内容和答案解析分别输出，不要在试题部分显示答案。答案将在学生提交后由系统单独调用批改接口获取。

您必须严格按照下文的"输出结构规范"生成试题，确保题目数量适中且质量高。`;

    // 构建用户请求内容
    const userContent = `请为我生成一套${grade_level}${subject}摸底测试，我的自评水平是${self_assessed_level}，学习目标是${learning_goal}。

请按照以下格式输出，将试题和答案明确分离：

===QUIZ_CONTENT_START===
# ${subject}摸底测试（${grade_level}）
## 📝 测试说明
- 测试时间：约${formData.quiz_time || 15}分钟
- 题目数量：{总题数}道（选择题{选择题数量}道，填空题{填空题数量}道）
- 测试目的：评估您在${subject}的基础知识和关键能力，帮助制定个性化学习计划
- 答题建议：请独立完成，不确定的题目可以标记，稍后再做

## 第一部分：选择题（共{选择题数量}题，每题{分值}分）
### 先验知识检测（{先验知识题数}题）
{先验知识选择题，包含题干、选项，不包含答案}

### 核心知识点评估（{核心知识题数}题）
{核心知识选择题，包含题干、选项，不包含答案}

## 第二部分：填空题（共{填空题数量}题，每题{分值}分）
### 基础概念应用（{基础填空题数}题）
{基础填空题，包含题干，不包含答案}

### 综合能力测试（{综合填空题数}题）
{综合填空题，包含题干，不包含答案}

## 答题完成提示
请完成所有题目后点击"提交答案"按钮，系统将为您自动批改并显示成绩和详细解析。
===QUIZ_CONTENT_END===

===ANSWERS_START===
## 标准答案与解析
### 选择题答案
1. {答案}：{详细解析，包含知识点说明和解题思路}
2. {答案}：{详细解析，包含知识点说明和解题思路}
   ...
### 填空题答案
1. {答案}：{详细解析，包含知识点说明和解题思路}
2. {答案}：{详细解析，包含知识点说明和解题思路}
   ...
===ANSWERS_END===

请确保答案和解析部分详细准确，包含充分的知识点说明，帮助学习者理解解题思路。`;

    // 调用API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    console.log('🚀 开始调用API...');
    console.log('📡 API URL:', CLAUDE_API_URL);
    console.log('⏱️ 超时设置:', API_TIMEOUT, 'ms');

    try {
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
        max_tokens: 4000,
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
      console.log('📥 响应头:', Object.fromEntries(response.headers.entries()));

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
        return Response.json(
          { error: 'AI响应格式无效，请稍后再试' },
          { status: 502 }
        );
      }

      console.log('✅ 内容提取成功，长度:', generatedContent.length);

      // 分离试题内容和答案
      const quizContentMatch = generatedContent.match(/===QUIZ_CONTENT_START===([\s\S]*?)===QUIZ_CONTENT_END===/);
      const answersMatch = generatedContent.match(/===ANSWERS_START===([\s\S]*?)===ANSWERS_END===/);

      const quizContent = quizContentMatch ? quizContentMatch[1].trim() : generatedContent;
      const answersContent = answersMatch ? answersMatch[1].trim() : '';

      console.log('✅ 试题生成完成');

      // 返回成功响应，包含分离的内容
      return Response.json({
        success: true,
        quiz_data: {
          quiz_content: quizContent,
          answers_content: answersContent,
          full_content: generatedContent,
          metadata: {
            model: 'EduAssess',
            parameters: {
              grade_level,
              subject,
              self_assessed_level,
              learning_goal,
              quiz_time: formData.quiz_time || 15,
              question_count: formData.question_count || 'auto'
            },
            timestamp: new Date().toISOString()
          }
        },
        // 保持向后兼容性
        quiz_content: quizContent,
        answers_content: answersContent,
        full_content: generatedContent,
        metadata: {
          model: 'EduAssess',
          parameters: {
            grade_level,
            subject,
            self_assessed_level,
            learning_goal,
            quiz_time: formData.quiz_time || 15,
            question_count: formData.question_count || 'auto'
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('❌ API调用异常:', error);
      
      if (error.name === 'AbortError') {
        console.error('❌ API调用超时');
        return Response.json(
          { 
            error: 'AI服务响应超时，请稍后重试。可能原因：1.网络连接问题 2.API服务繁忙 3.API密钥配额不足',
            debug_info: {
              api_url: CLAUDE_API_URL,
              timeout: API_TIMEOUT,
              has_key: !!CLAUDE_API_KEY
            }
          },
          { status: 408 }
        );
      }
      
      if (error.message.includes('fetch')) {
        return Response.json(
          { 
            error: '网络连接失败，请检查网络连接或尝试其他API服务',
            debug_info: {
              api_url: CLAUDE_API_URL,
              error_type: 'network_error'
            }
          },
          { status: 503 }
        );
      }
      
      throw error;
    }

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