export const runtime = 'nodejs'; // 确保使用 Node 运行时，避免 Edge 下 fetch 失败

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 用于写入数据库
import { createServerClient } from '@supabase/ssr';   // 用于获取用户身份
import { cookies } from 'next/headers';
import { streamClaude } from '@/lib/claudeStream';

export async function POST(req) {
  const startTime = Date.now();
  
  try {
    // ==========================================
    // 1. 初始化 Supabase 客户端
    // ==========================================
    
    // A. 初始化 SSR 客户端 (用于安全地获取当前登录用户)
    const cookieStore = await cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {} // 只读
        }
      }
    );
    const { data: { user } } = await authClient.auth.getUser();
    const sessionUserId = user?.id || null;

    // B. 初始化 ADMIN 客户端 (用于写入数据库，绕过 RLS 权限问题)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
      console.error('[quiz-grading] SUPABASE_URL 缺失或格式异常:', supabaseUrl);
      return NextResponse.json(
        { error: '服务端未配置有效的 SUPABASE_URL' },
        { status: 500 }
      );
    }
    if (!serviceRoleKey) {
      console.error('[quiz-grading] Service Role Key 缺失');
      return NextResponse.json(
        { error: '服务端未配置 Supabase Service Role Key' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // ==========================================
    // 2. 解析与验证请求
    // ==========================================
    const { answers, quiz_metadata, answers_content, detailed_data } = await req.json();
    console.log('收到试题批改请求:', { 
        answersCount: answers ? Object.keys(answers).length : 0, 
        hasMetadata: !!quiz_metadata, 
        sessionUserId 
    });

    if (!answers || !quiz_metadata || !answers_content) {
      return NextResponse.json(
        { error: '缺少必要的批改数据' },
        { status: 400 }
      );
    }

    // ==========================================
    // 3. 构建 Prompt 与调用 AI (完全保留你原本的逻辑)
    // ==========================================
    const gradingSystemPrompt = `您是"EduGrader"，一个专业的智能试题批改系统。您的任务是：

1. 根据提供的标准答案批改学生的答案
2. 计算准确的得分
3. 为每道题提供详细的批改反馈
4. 根据总体表现给出鼓励性的评价和建议

## 批改标准：
- 选择题：答案完全正确得满分，错误得0分
- 填空题：允许合理的同义词或等价表达，酌情给分
- 计算题：过程正确但结果有小错误可以给部分分数
- 主观题：根据关键点给分，鼓励创新思维

## 输出要求：
请严格按照JSON格式输出批改结果，包含详细的逐题分析和总体评价。

**重要：**
1. 必须返回有效的JSON格式，不要包含任何额外的文字说明
2. percentage字段必须是整数，计算公式：Math.round((total_score / max_score) * 100)
3. 每道题的is_correct字段必须准确反映答案是否正确
4. 确保total_score是所有题目得分的总和
5. 确保max_score是所有题目满分的总和`;

    const gradingContent = `请批改以下试题作答情况：

## 试题信息
- 学科：${quiz_metadata.parameters.subject}
- 年级：${quiz_metadata.parameters.grade_level}
- 学习目标：${quiz_metadata.parameters.learning_goal}

## 学生答案
${Object.entries(answers).map(([questionId, answer]) => 
  `题目${questionId}：${answer || '未作答'}`
).join('\n')}

## 标准答案与解析
${answers_content}

请按以下JSON格式返回批改结果：

{
  "grading_results": {
    "total_score": 总分,
    "max_score": 满分,
    "percentage": 得分百分比(整数),
    "grade_level": "优秀/良好/及格/需要加强",
    "question_details": [
      {
        "question_id": "题目ID",
        "student_answer": "学生答案",
        "correct_answer": "正确答案",
        "is_correct": true/false,
        "score": 得分,
        "max_score": 满分,
        "explanation": "详细解析",
        "knowledge_points": ["知识点1"]
      }
    ],
    "overall_feedback": {
      "strengths": [],
      "weaknesses": [],
      "suggestions": [],
      "encouragement": "评价"
    }
  }
}`;

    const gradingResultText = await streamClaude({
      apiUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages',
      apiKey: process.env.CLAUDE_API_KEY,
      system: gradingSystemPrompt,
      messages: [
        { role: 'user', content: gradingContent }
      ],
      maxTokens: 2000,
      temperature: 0.3,
      timeoutMs: 30000
    });
    
    if (!gradingResultText) {
      throw new Error('AI批改响应格式无效');
    }

    // ==========================================
    // 4. 解析结果与容错 (完全保留你原本的逻辑)
    // ==========================================
    let gradingResult;
    try {
      const jsonMatch = gradingResultText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, gradingResultText];
      const jsonText = jsonMatch[1] || gradingResultText;
      gradingResult = JSON.parse(jsonText);
      
      // 重新计算正确率 (你的原有逻辑)
      let actualCorrectCount = 0;
      let actualTotalCount = 0;
      
      if (gradingResult.grading_results.question_details && Array.isArray(gradingResult.grading_results.question_details)) {
        gradingResult.grading_results.question_details.forEach(question => {
          actualTotalCount++;
          if (question.is_correct === true) {
            actualCorrectCount++;
          }
        });
      }
      
      if (actualTotalCount === 0) {
        actualCorrectCount = gradingResult.grading_results.total_score || 0;
        actualTotalCount = gradingResult.grading_results.max_score || 0;
      }
      
      const calculatedPercentage = actualTotalCount > 0 
        ? Math.round((actualCorrectCount / actualTotalCount) * 100)
        : 0;
      
      gradingResult.grading_results.percentage = calculatedPercentage;
      gradingResult.grading_results.total_score = actualCorrectCount;
      gradingResult.grading_results.max_score = actualTotalCount;
      
    } catch (parseError) {
      console.error('批改结果解析失败，使用 Fallback:', parseError);
      
      const totalQuestions = Object.keys(answers).length;
      gradingResult = {
        grading_results: {
          total_score: 0,
          max_score: totalQuestions,
          percentage: 0,
          grade_level: "需要加强",
          question_details: Object.keys(answers).map((questionId) => ({
            question_id: questionId,
            student_answer: answers[questionId] || '未作答',
            is_correct: false,
            score: 0,
            max_score: 1,
            explanation: '系统解析失败',
            knowledge_points: []
          })),
          overall_feedback: {
            strengths: [],
            weaknesses: ["系统解析失败"],
            suggestions: [],
            encouragement: "请重试"
          }
        }
      };
    }

    // 生成鼓励话语 (你的原有逻辑)
    const generateEncouragement = (percentage) => {
      if (percentage >= 90) return { emoji: "🎉", title: "优秀表现！", message: "表现出色！", color: "text-green-600", bgColor: "bg-green-50" };
      if (percentage >= 75) return { emoji: "👏", title: "良好表现！", message: "做得很好！", color: "text-blue-600", bgColor: "bg-blue-50" };
      if (percentage >= 60) return { emoji: "💪", title: "继续努力！", message: "还有提升空间。", color: "text-yellow-600", bgColor: "bg-yellow-50" };
      return { emoji: "🌱", title: "学习起步！", message: "加油！", color: "text-orange-600", bgColor: "bg-orange-50" };
    };

    const encouragementInfo = generateEncouragement(gradingResult.grading_results.percentage);

    // ==========================================
    // ✅ 5. 写入数据库 (核心修改：使用 supabaseAdmin)
    // ==========================================
    const resolvedUserId = 
      sessionUserId || 
      quiz_metadata?.user_id || 
      quiz_metadata?.userId || 
      null;

    let insertedQuizRecordId = null;

    if (resolvedUserId) {
        console.log(`[quiz-grading API] 正在写入测验记录 (UserID: ${resolvedUserId})...`);
        
        const results = gradingResult.grading_results;
        const correctCount = results.question_details?.filter(q => q.is_correct).length || 0;
        const totalQuestions = results.question_details?.length || 0;

        // 控制写入 payload 大小，避免超大 JSON 导致 fetch 失败
        const sanitizedDetails = (results.question_details || []).map((q) => ({
            ...q,
            explanation: q.explanation ? String(q.explanation).slice(0, 500) : '',
            knowledge_points: Array.isArray(q.knowledge_points) ? q.knowledge_points.slice(0, 10) : []
        }));

        const insertPayload = {
            user_id: resolvedUserId,
            topic: quiz_metadata?.parameters?.subject || '未知学科',
            score: results.total_score || 0,
            max_score: results.max_score || 0,
            correct_count: correctCount,
            total_questions: totalQuestions,
            questions_detail: sanitizedDetails
        };

        const payloadSize = Buffer.byteLength(JSON.stringify(insertPayload), 'utf8');
        if (payloadSize > 900_000) {
            console.warn('[quiz-grading] 插入 payload 过大，截断处理，size:', payloadSize);
        }

        try {
            // 直接使用 Admin 客户端写入，绕过所有 RLS 和 Fetch 限制
            const { data, error: dbError } = await supabaseAdmin
                .from('quiz_records')
                .insert([ insertPayload ])
                .select()
                .single();

            if (dbError) {
                console.error('[quiz-grading API] ❌ 写入失败:', dbError.message, dbError);
            } else if (data) {
                insertedQuizRecordId = data.id;
                console.log('[quiz-grading API] ✅ 写入成功，ID:', insertedQuizRecordId);
            }
        } catch (e) {
            console.error('[quiz-grading API] ❌ 数据库操作异常:', e?.message || e, e);
        }
    } else {
        console.warn('[quiz-grading API] ⚠️ 未找到 UserID，跳过写入');
    }

    // ==========================================
    // 6. 返回响应
    // ==========================================
    return NextResponse.json({
      success: true,
      grading_results: gradingResult.grading_results,
      encouragement: encouragementInfo,
      metadata: {
        graded_at: new Date().toISOString(),
        grading_duration: Date.now() - startTime,
        questions_count: Object.keys(answers).length,
        ai_model: 'Claude-3-Sonnet'
      },
      requires_assessment: !!detailed_data,
      assessment_data: detailed_data ? {
        quiz_metadata,
        grading_results: gradingResult.grading_results,
        detailed_data,
        quiz_record_id: insertedQuizRecordId // 传递给前端，用于生成评估
      } : null,
      quiz_record_id: insertedQuizRecordId
    });

  } catch (error) {
    console.error('试题批改错误:', error);
    return NextResponse.json(
      { 
        error: error.message || '试题批改失败，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}