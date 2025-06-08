export async function POST(req) {
  const startTime = Date.now();
  
  try {
    // 解析请求数据
    const { answers, quiz_metadata, answers_content, detailed_data } = await req.json();
    console.log('收到试题批改请求:', { answersCount: Object.keys(answers).length, hasMetadata: !!quiz_metadata, hasDetailedData: !!detailed_data });

    // 验证必要字段
    if (!answers || !quiz_metadata || !answers_content) {
      return Response.json(
        { error: '缺少必要的批改数据' },
        { status: 400 }
      );
    }

    // 构建批改系统指令
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
请严格按照JSON格式输出批改结果，包含详细的逐题分析和总体评价。`;

    // 构建批改请求内容
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
    "percentage": 得分百分比,
    "grade_level": "优秀/良好/及格/需要加强",
    "question_details": [
      {
        "question_id": "题目ID",
        "student_answer": "学生答案",
        "correct_answer": "正确答案",
        "is_correct": true/false,
        "score": 得分,
        "max_score": 满分,
        "explanation": "详细解析和反馈",
        "knowledge_points": ["涉及的知识点1", "涉及的知识点2"]
      }
    ],
    "overall_feedback": {
      "strengths": ["优势点1", "优势点2"],
      "weaknesses": ["需要改进的地方1", "需要改进的地方2"],
      "suggestions": ["学习建议1", "学习建议2"],
      "encouragement": "鼓励话语和总体评价"
    }
  }
}`;

    // 调用Claude API进行批改
    const response = await fetch(process.env.CLAUDE_API_URL || 'https://globalai.vip/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [
          {
            role: 'system',
            content: gradingSystemPrompt
          },
          {
            role: 'user',
            content: gradingContent
          }
        ],
        max_tokens: 2000, // 减少token数量以加快响应
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API 批改错误:', errorData);
      throw new Error(`Claude API 调用失败: ${response.status}`);
    }

    const data = await response.json();
    console.log('Claude API 批改响应成功');

    // 提取批改结果
    const gradingResultText = data.choices?.[0]?.message?.content;
    
    if (!gradingResultText) {
      throw new Error('AI批改响应格式无效');
    }

    // 尝试解析JSON结果
    let gradingResult;
    try {
      // 提取JSON部分（可能包含在代码块中）
      const jsonMatch = gradingResultText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, gradingResultText];
      const jsonText = jsonMatch[1] || gradingResultText;
      gradingResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('批改结果解析失败:', parseError);
      
      // 如果JSON解析失败，创建一个基本的结果结构
      gradingResult = {
        grading_results: {
          total_score: Object.keys(answers).length,
          max_score: Object.keys(answers).length,
          percentage: 100,
          grade_level: "良好",
          question_details: [],
          overall_feedback: {
            strengths: ["积极参与答题"],
            weaknesses: ["系统批改解析失败"],
            suggestions: ["请联系老师获取详细反馈"],
            encouragement: "继续努力学习！"
          },
          raw_response: gradingResultText
        }
      };
    }

    // 生成鼓励话语
    const generateEncouragement = (percentage) => {
      if (percentage >= 90) {
        return {
          emoji: "🎉",
          title: "优秀表现！",
          message: "恭喜你！你的表现非常出色，已经很好地掌握了这部分知识。继续保持这种学习热情和严谨的态度，你一定能在学习的道路上取得更大的成就！",
          color: "text-green-600",
          bgColor: "bg-green-50"
        };
      } else if (percentage >= 75) {
        return {
          emoji: "👏",
          title: "良好表现！",
          message: "做得很好！你已经掌握了大部分知识点，只需要在个别地方多加练习。相信通过持续的努力，你很快就能达到优秀水平！",
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        };
      } else if (percentage >= 60) {
        return {
          emoji: "💪",
          title: "继续努力！",
          message: "你已经有了不错的基础，但还有提升的空间。不要气馁，每一次练习都是进步的机会。相信坚持下去，你一定能够突破自己！",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50"
        };
      } else {
        return {
          emoji: "🌱",
          title: "学习起步！",
          message: "学习是一个循序渐进的过程，每个人都有自己的节奏。重要的是你已经开始了这个旅程！建议从基础知识开始，一步一个脚印，相信努力一定会有回报！",
          color: "text-orange-600",
          bgColor: "bg-orange-50"
        };
      }
    };

    const encouragementInfo = generateEncouragement(gradingResult.grading_results.percentage);

    // 如果有详细数据，尝试调用成绩评估API
    let assessmentResult = null;
    // 注释掉assessment调用以避免超时，改为前端单独调用
    /*
    if (detailed_data) {
      try {
        console.log('调用成绩评估API...');
        console.log('发送给评估API的数据:', {
          quiz_metadata,
          grading_results: gradingResult.grading_results,
          detailed_data
        });
        
        // 构建assessment API的URL - 使用相对路径或当前请求的host
        const assessmentUrl = new URL('/api/assessment', req.url);
        console.log('评估API URL:', assessmentUrl.toString());
        
        const assessmentResponse = await fetch(assessmentUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quiz_metadata,
            grading_results: gradingResult.grading_results,
            detailed_data
          })
        });

        console.log('评估API响应状态:', assessmentResponse.status);

        if (assessmentResponse.ok) {
          assessmentResult = await assessmentResponse.json();
          console.log('成绩评估完成，评估结果:', assessmentResult ? '有评估数据' : '无评估数据');
        } else {
          const errorText = await assessmentResponse.text();
          console.error('评估API调用失败:', errorText);
        }
      } catch (assessmentError) {
        console.error('调用评估API出错:', assessmentError.message);
        // 评估失败不影响批改结果的返回
      }
    }
    */

    // 返回批改结果（不包含评估，让前端单独调用）
    return Response.json({
      success: true,
      grading_results: gradingResult.grading_results,
      encouragement: encouragementInfo,
      metadata: {
        graded_at: new Date().toISOString(),
        grading_duration: Date.now() - startTime,
        questions_count: Object.keys(answers).length,
        ai_model: 'Claude-3-Sonnet'
      },
      // 添加标志表示需要单独调用评估
      requires_assessment: !!detailed_data,
      assessment_data: detailed_data ? {
        quiz_metadata,
        grading_results: gradingResult.grading_results,
        detailed_data
      } : null
    });

  } catch (error) {
    console.error('试题批改错误:', error);
    return Response.json(
      { 
        error: error.message || '试题批改失败，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 