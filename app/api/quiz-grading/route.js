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
请严格按照JSON格式输出批改结果，包含详细的逐题分析和总体评价。

**重要：**
1. 必须返回有效的JSON格式，不要包含任何额外的文字说明
2. percentage字段必须是整数，计算公式：Math.round((total_score / max_score) * 100)
3. 每道题的is_correct字段必须准确反映答案是否正确
4. 确保total_score是所有题目得分的总和
5. 确保max_score是所有题目满分的总和`;

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
    "total_score": 总分（所有题目得分之和）,
    "max_score": 满分（所有题目满分之和）,
    "percentage": 得分百分比（整数，计算公式：Math.round((total_score / max_score) * 100)）,
    "grade_level": "优秀/良好/及格/需要加强",
    "question_details": [
      {
        "question_id": "题目ID",
        "student_answer": "学生答案",
        "correct_answer": "正确答案",
        "is_correct": true/false（必须准确判断）,
        "score": 得分（0或满分）,
        "max_score": 满分（通常为1）,
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
}

**注意：请确保返回的是有效的JSON格式，不要包含任何额外的文字说明或代码块标记。**`;

    // 调用Claude API进行批改
    const response = await fetch(process.env.CLAUDE_API_URL || 'https://globalai.vip/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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
      
      // 验证解析结果的基本结构
      if (!gradingResult.grading_results || 
          typeof gradingResult.grading_results.percentage !== 'number' ||
          typeof gradingResult.grading_results.total_score !== 'number' ||
          typeof gradingResult.grading_results.max_score !== 'number') {
        throw new Error('AI返回的结果格式不正确');
      }
      
      // 重新计算正确率，完全基于question_details中的实际答题情况
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
      
      // 如果无法从question_details计算，则使用AI返回的total_score和max_score
      if (actualTotalCount === 0) {
        actualCorrectCount = gradingResult.grading_results.total_score || 0;
        actualTotalCount = gradingResult.grading_results.max_score || 0;
      }
      
      // 计算正确的百分比
      const calculatedPercentage = actualTotalCount > 0 
        ? Math.round((actualCorrectCount / actualTotalCount) * 100)
        : 0;
      
      console.log('重新计算正确率:', {
        ai_percentage: gradingResult.grading_results.percentage,
        calculated_percentage: calculatedPercentage,
        actual_correct_count: actualCorrectCount,
        actual_total_count: actualTotalCount,
        ai_total_score: gradingResult.grading_results.total_score,
        ai_max_score: gradingResult.grading_results.max_score
      });
      
      // 强制使用计算出的百分比和重新计算的分数
      gradingResult.grading_results.percentage = calculatedPercentage;
      gradingResult.grading_results.total_score = actualCorrectCount;
      gradingResult.grading_results.max_score = actualTotalCount;
      
    } catch (parseError) {
      console.error('批改结果解析失败:', parseError);
      
      // 如果JSON解析失败，创建一个基本的结果结构
      // 计算实际的正确率
      const totalQuestions = Object.keys(answers).length;
      const correctAnswers = 0; // 由于解析失败，假设全部错误
      const actualPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      console.log('使用fallback逻辑计算百分比:', {
        totalQuestions,
        correctAnswers,
        actualPercentage
      });
      
      gradingResult = {
        grading_results: {
          total_score: correctAnswers,
          max_score: totalQuestions,
          percentage: actualPercentage,
          grade_level: actualPercentage >= 80 ? "优秀" : actualPercentage >= 60 ? "良好" : actualPercentage >= 40 ? "及格" : "需要加强",
          question_details: Object.keys(answers).map((questionId, index) => ({
            question_id: questionId,
            student_answer: answers[questionId] || '未作答',
            correct_answer: '解析失败',
            is_correct: false,
            score: 0,
            max_score: 1,
            explanation: '系统批改解析失败，无法提供详细分析',
            knowledge_points: []
          })),
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