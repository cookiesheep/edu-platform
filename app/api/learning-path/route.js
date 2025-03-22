// app/api/learning-path/route.js
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { callFastGptModel } from '@/lib/fastgptClient';

const LEARNING_PATH_MODEL_ID = 'w6v4iudnki84eer4e2dmwo37'; // 学习路径推荐模型

/**
 * 学习路径API处理函数
 * 接收用户ID、学科和目标，调用AI模型生成个性化学习路径
 */
export async function POST(request) {
    try {
        // 解析请求体
        const body = await request.json();
        const { userId, subject, goal, deadline, currentLevel } = body;

        // 参数验证
        if (!userId || !subject || !goal) {
            return NextResponse.json(
                { error: '缺少必要参数：userId、subject或goal' },
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

        // 获取用户资料数据
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('获取用户资料时出错:', profileError);
            // 继续执行，但不使用用户资料
        }

        // 获取用户测验数据
        const { data: quizData, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('*, courses(subject, title)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(30);

        if (quizError) {
            console.error('获取测验数据时出错:', quizError);
            // 继续执行，但不使用测验数据
        }

        // 获取用户课程进度
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*, courses(*)')
            .eq('user_id', userId);

        if (progressError) {
            console.error('获取进度数据时出错:', progressError);
            // 继续执行，但不使用进度数据
        }

        // 获取相关课程数据
        const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .eq('subject', subject);

        if (coursesError) {
            console.error('获取课程数据时出错:', coursesError);
            // 继续执行，但不使用课程数据
        }

        // 准备发送给AI模型的数据
        const learningPathData = {
            userId,
            subject,
            goal,
            deadline: deadline || null,
            currentLevel: currentLevel || null,
            profile: profile || null,
            quizData: quizData || [],
            progressData: progressData || [],
            coursesData: coursesData || [],
            timestamp: new Date().toISOString()
        };

        // 调用AI模型生成学习路径
        const result = await callFastGptModel(LEARNING_PATH_MODEL_ID, learningPathData);

        // 处理AI返回的结果
        let learningPath;

        try {
            // 尝试解析AI返回的内容
            const aiResponse = result.choices[0].message.content;

            // 检查是否为JSON格式
            if (aiResponse.startsWith('{') && aiResponse.endsWith('}')) {
                learningPath = JSON.parse(aiResponse);
            } else {
                learningPath = {
                    subject,
                    goal,
                    plan: aiResponse,
                    raw: aiResponse
                };
            }
        } catch (parseError) {
            console.error('解析AI响应时出错:', parseError);

            // 如果解析失败，返回原始文本
            return NextResponse.json({
                learningPath: {
                    subject,
                    goal,
                    plan: result.choices[0].message.content,
                    raw: result.choices[0].message.content
                },
                error: '无法解析AI响应为JSON格式'
            });
        }

        // 在Supabase中记录学习路径
        const { error: saveError } = await supabase
            .from('learning_paths')
            .insert({
                user_id: userId,
                subject,
                goal,
                path_data: learningPath,
                deadline: deadline || null,
                created_at: new Date().toISOString()
            });

        if (saveError) {
            console.error('保存学习路径时出错:', saveError);
            // 即使保存失败，仍返回学习路径
        }

        // 返回生成的学习路径
        return NextResponse.json({ learningPath });
    } catch (error) {
        console.error('学习路径API错误:', error);
        return NextResponse.json(
            { error: '处理学习路径请求时出错: ' + error.message },
            { status: 500 }
        );
    }
}

// 获取用户所有学习路径
export async function GET(request) {
    try {
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

        return NextResponse.json({ paths: data || [] });
    } catch (error) {
        console.error('获取学习路径时出错:', error);
        return NextResponse.json(
            { error: '获取学习路径失败: ' + error.message },
            { status: 500 }
        );
    }
}