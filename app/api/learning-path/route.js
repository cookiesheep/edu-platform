// app/api/learning-path/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 30000;

/**
 * 学习路径API处理函数
 * 接收用户ID、学科和目标，调用Claude API生成个性化学习路径
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
        const { userId, subject, goal, deadline, currentLevel } = body;

        // 参数验证
        if (!subject || !goal) {
            return NextResponse.json(
                { error: '缺少必要参数：subject或goal' },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
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
        const systemPrompt = `您是EduPath，一个专业的个性化学习路径规划系统。您的任务是根据用户的学习目标、学科背景和时间安排，制定详细的、可执行的学习计划。

## 用户信息
- 学科：${subject}
- 学习目标：${goal}
- 当前水平：${currentLevel || '待评估'}
- 完成期限：${deadline || '无特定要求'}

## 学习路径设计原则
1. 循序渐进：从基础到高级，确保知识点的衔接性
2. 实用导向：注重理论与实践的结合
3. 可衡量性：设置明确的学习里程碑和评估标准
4. 灵活性：允许根据学习进度调整计划

## 返回格式要求
请严格按照以下JSON格式返回学习路径，不要包含任何额外文本：

{
  "learningPath": {
    "title": "学习路径标题",
    "subject": "${subject}",
    "goal": "${goal}",
    "estimated_duration": "预计学习时间（如：8周）",
    "difficulty_level": "难度等级",
    "phases": [
      {
        "phase_id": 1,
        "phase_title": "阶段标题",
        "duration": "阶段时长",
        "objectives": ["目标1", "目标2"],
        "topics": [
          {
            "topic_id": 1,
            "title": "知识点标题",
            "description": "详细描述",
            "estimated_hours": 4,
            "resources": ["资源1", "资源2"],
            "exercises": ["练习1", "练习2"],
            "assessment": "评估方式"
          }
        ]
      }
    ],
    "milestones": [
      {
        "week": 2,
        "title": "里程碑标题",
        "criteria": "达成标准"
      }
    ],
    "recommendations": {
      "study_tips": ["学习建议1", "学习建议2"],
      "resources": ["推荐资源1", "推荐资源2"],
      "practice_methods": ["练习方法1", "练习方法2"]
    }
  }
}`;

        const userPrompt = `请为我制定一个关于${subject}的学习路径，我的目标是${goal}。${currentLevel ? `我的当前水平是${currentLevel}。` : ''}${deadline ? `我希望在${deadline}完成学习。` : ''}请制定一个详细的、分阶段的学习计划。`;

        // 调用Claude API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        try {
            const response = await fetch(CLAUDE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CLAUDE_API_KEY}`,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
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
                    max_tokens: 4000,
                    temperature: 0.7
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Claude API错误 (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            const aiResponse = data.content?.[0]?.text || data.choices?.[0]?.message?.content;

            if (!aiResponse) {
                throw new Error('AI响应格式无效');
            }

            // 解析AI返回的JSON
            let learningPath;
            try {
                const parsed = JSON.parse(aiResponse);
                learningPath = parsed.learningPath || parsed;
            } catch (parseError) {
                console.error('解析AI响应失败:', parseError);
                // 创建一个简化版学习路径作为fallback
                learningPath = {
                    title: `${subject} - ${goal}`,
                    subject: subject,
                    goal: goal,
                    estimated_duration: "4-8周",
                    difficulty_level: currentLevel || "中级",
                    content: aiResponse,
                    phases: [{
                        phase_id: 1,
                        phase_title: "基础学习阶段",
                        duration: "2-4周",
                        objectives: [goal],
                        description: aiResponse.length > 500 ? aiResponse.substring(0, 500) + '...' : aiResponse
                    }]
                };
            }

            // 添加生成时间戳
            learningPath.generated_at = new Date().toISOString();
            learningPath.id = `path-${Date.now()}`;

            // 如果有userId，尝试保存到数据库
            if (userId) {
                try {
                    const { error: saveError } = await supabase
                        .from('learning_paths')
                        .insert({
                            user_id: userId,
                            subject,
                            goal,
                            path_data: learningPath,
                            deadline: deadline || null,
                            current_level: currentLevel || null,
                            created_at: new Date().toISOString()
                        });

                    if (saveError) {
                        console.error('保存学习路径时出错:', saveError);
                        // 即使保存失败，仍返回学习路径
                    }
                } catch (dbError) {
                    console.error('数据库操作失败:', dbError);
                    // 继续返回结果，不因数据库错误而失败
                }
            }

            return NextResponse.json({ 
                success: true,
                learningPath,
                metadata: {
                    generated_at: learningPath.generated_at,
                    subject,
                    goal
                }
            });

        } catch (apiError) {
            clearTimeout(timeoutId);
            
            if (apiError.name === 'AbortError') {
                return NextResponse.json(
                    { error: 'AI服务响应超时，请稍后重试' },
                    { status: 408 }
                );
            }
            
            throw apiError;
        }

    } catch (error) {
        console.error('学习路径API错误:', error);
        return NextResponse.json(
            { 
                error: `生成学习路径时出错：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// 获取用户所有学习路径
export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: '缺少必要参数：userId' },
                { status: 400 }
            );
        }

        // 验证用户是否登录
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session || session.user.id !== userId) {
            return NextResponse.json(
                { error: '未授权访问' },
                { status: 401 }
            );
        }

        // 获取用户的所有学习路径
        const { data, error } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({ 
            success: true,
            paths: data || [],
            total: data?.length || 0
        });
    } catch (error) {
        console.error('获取学习路径时出错:', error);
        return NextResponse.json(
            { 
                error: `获取学习路径失败：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}