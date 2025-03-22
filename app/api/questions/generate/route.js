// app/api/questions/generate/route.js
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { callFastGptModel } from '@/lib/fastgptClient';

const QUESTION_GENERATOR_MODEL_ID = 'jidvsej3g5cofla8xsm891kd'; // 试题生成模型

/**
 * 试题生成API处理函数
 * 接收科目、难度等参数，调用AI模型生成个性化试题
 */
export async function POST(request) {
    try {
        // 解析请求体
        const body = await request.json();
        const { userId, subject, difficulty, count, topics, excludeIds } = body;

        // 参数验证
        if (!userId || !subject || !difficulty || !count) {
            return NextResponse.json(
                { error: '缺少必要参数：userId、subject、difficulty或count' },
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

        // 获取用户资料
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('获取用户资料时出错:', profileError);
            // 继续执行，但不使用用户资料
        }

        // 获取用户历史作答数据，用于个性化试题
        const { data: userAnswers, error: answersError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('courses.subject', subject)
            .order('created_at', { ascending: false })
            .limit(20);

        if (answersError) {
            console.error('获取用户作答历史时出错:', answersError);
            // 继续执行，但不使用历史数据
        }

        // 准备发送给AI模型的数据
        const questionData = {
            userId,
            subject,
            difficulty,
            count: Math.min(count, 20), // 限制最大题目数量
            topics: topics || [],
            excludeIds: excludeIds || [],
            userHistory: userAnswers || [],
            profile: profile || null,
            timestamp: new Date().toISOString()
        };

        // 调用AI模型生成试题
        const result = await callFastGptModel(QUESTION_GENERATOR_MODEL_ID, questionData);

        // 处理AI返回的结果
        let questions;

        try {
            // 尝试解析AI返回的内容
            const aiResponse = result.choices[0].message.content;

            // 检查是否为JSON格式
            if (aiResponse.startsWith('[') || aiResponse.startsWith('{')) {
                questions = JSON.parse(aiResponse);

                // 确保返回的是数组
                if (!Array.isArray(questions)) {
                    if (questions.questions && Array.isArray(questions.questions)) {
                        questions = questions.questions;
                    } else {
                        questions = [questions];
                    }
                }
            } else {
                // 如果返回的不是JSON，创建一个模拟题目作为返回
                questions = [{
                    id: `gen-${Date.now()}`,
                    type: 'text-response',
                    stem: aiResponse,
                    difficulty: difficulty,
                    subject: subject
                }];
            }

            // 为每个问题添加唯一ID（如果没有的话）
            questions = questions.map((q, index) => ({
                ...q,
                id: q.id || `gen-${Date.now()}-${index}`
            }));

        } catch (parseError) {
            console.error('解析AI响应时出错:', parseError);

            // 如果解析失败，返回原始文本
            return NextResponse.json({
                raw: result.choices[0].message.content,
                questions: [{
                    id: `gen-${Date.now()}`,
                    type: 'text-response',
                    stem: result.choices[0].message.content,
                    difficulty: difficulty,
                    subject: subject
                }],
                error: '无法解析AI响应为JSON格式'
            });
        }

        // 返回生成的试题
        return NextResponse.json({ questions });
    } catch (error) {
        console.error('试题生成API错误:', error);
        return NextResponse.json(
            { error: '处理试题生成请求时出错: ' + error.message },
            { status: 500 }
        );
    }
}