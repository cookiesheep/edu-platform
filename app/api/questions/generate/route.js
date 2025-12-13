// app/api/questions/generate/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { streamClaude } from '@/lib/claudeStream';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 30000;

/**
 * 试题生成API处理函数
 * 接收科目、难度等参数，调用Claude API生成个性化试题
 */
export async function POST(request) {
    try {
        // 检查API配置
        if (!CLAUDE_API_KEY) {
            return NextResponse.json(
                { 
                    error: 'API服务未配置', 
                    details: '请在.env.local文件中配置CLAUDE_API_KEY'
                },
                { status: 500 }
            );
        }

        // 解析请求体
        const body = await request.json();
        const { userId, subject, difficulty, count, topics, excludeIds } = body;

        // 参数验证
        if (!subject || !difficulty || !count) {
            return NextResponse.json(
                { error: '缺少必要参数：subject、difficulty或count' },
                { status: 400 }
            );
        }

        // 如果提供了userId，验证用户登录状态
        if (userId) {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session || session.user.id !== userId) {
                return NextResponse.json(
                    { error: '未授权访问' },
                    { status: 401 }
                );
            }
        }

        // 构建系统提示词
        const systemPrompt = `您是EduQuest，一个专业的教育试题生成系统。您的任务是根据给定的学科、难度和数量要求，生成高质量的教育测试题目。

## 生成要求
- 学科：${subject}
- 难度：${difficulty}
- 题目数量：${Math.min(count, 10)} 道
- 特定话题：${topics && topics.length > 0 ? topics.join(', ') : '无特定要求'}

## 题目格式要求
请严格按照以下JSON格式返回题目，不要包含任何额外文本：

{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "subject": "${subject}",
      "difficulty": "${difficulty}",
      "stem": "题目描述",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "correct_answer": "A",
      "explanation": "详细解析",
      "knowledge_points": ["知识点1", "知识点2"],
      "estimated_time": 120
    }
  ]
}

## 题目类型分布
- 70% 选择题 (multiple_choice)
- 20% 填空题 (fill_blank)
- 10% 简答题 (short_answer)

## 质量标准
1. 题目表述清晰，无歧义
2. 选择题干扰项设计合理
3. 答案准确，解析详细
4. 符合对应难度要求
5. 知识点覆盖全面`;

        const userPrompt = `请为${subject}生成${Math.min(count, 10)}道${difficulty}难度的题目。${topics && topics.length > 0 ? `重点关注以下话题：${topics.join(', ')}。` : ''}请确保题目质量高，答案准确。`;

        try {
            const aiResponse = await streamClaude({
                apiUrl: CLAUDE_API_URL,
                apiKey: CLAUDE_API_KEY,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ],
                maxTokens: 4000,
                temperature: 0.7,
                timeoutMs: API_TIMEOUT
            });

            // 解析AI返回的JSON
            let questions;
            try {
                const parsed = JSON.parse(aiResponse);
                questions = parsed.questions || (Array.isArray(parsed) ? parsed : [parsed]);
            } catch (parseError) {
                console.error('解析AI响应失败:', parseError);
                // 创建一个简单的题目作为fallback
                questions = [{
                    id: `gen-${Date.now()}`,
                    type: 'short_answer',
                    subject: subject,
                    difficulty: difficulty,
                    stem: aiResponse.length > 200 ? aiResponse.substring(0, 200) + '...' : aiResponse,
                    explanation: '由于格式解析问题，这是一个简化版题目',
                    knowledge_points: [subject],
                    estimated_time: 300
                }];
            }

            // 为每个问题添加唯一ID
            questions = questions.map((q, index) => ({
                ...q,
                id: q.id || `gen-${Date.now()}-${index}`,
                generated_at: new Date().toISOString()
            }));

            return NextResponse.json({ 
                success: true,
                questions,
                metadata: {
                    total_generated: questions.length,
                    subject,
                    difficulty,
                    generated_at: new Date().toISOString()
                }
            });

        } catch (apiError) {
            if (apiError.name === 'AbortError' || /超时/.test(apiError.message || '')) {
                return NextResponse.json(
                    { error: 'AI服务响应超时，请稍后重试' },
                    { status: 408 }
                );
            }
            
            throw apiError;
        }

    } catch (error) {
        console.error('试题生成API错误:', error);
        return NextResponse.json(
            { 
                error: `生成试题时出错：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}