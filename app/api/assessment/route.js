// app/api/assessment/route.js
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { callFastGptModel } from '@/lib/fastgptClient';

const ASSESSMENT_MODEL_ID = 'jo87glkagm0bjuu3a8a9fscf'; // 成绩评估模型

/**
 * 成绩评估API处理函数
 * 接收用户ID和学科信息，调用AI模型进行成绩评估
 */
export async function POST(request) {
    try {
        // 解析请求体
        const body = await request.json();
        const { userId, subjectId, period, includeDetails } = body;

        // 参数验证
        if (!userId || !subjectId) {
            return NextResponse.json(
                { error: '缺少必要参数：userId或subjectId' },
                { status: 400 }
            );
        }

        // 验证用户是否登录
        // 此处可以添加额外的认证检查

        // 从Supabase获取用户测验数据
        const { data: quizData, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('courses.subject', subjectId)
            .order('created_at', { ascending: false });

        if (quizError) {
            console.error('获取测验数据时出错:', quizError);
            return NextResponse.json(
                { error: '获取用户测验数据失败' },
                { status: 500 }
            );
        }

        // 从Supabase获取用户进度数据
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('courses.subject', subjectId);

        if (progressError) {
            console.error('获取进度数据时出错:', progressError);
            return NextResponse.json(
                { error: '获取用户进度数据失败' },
                { status: 500 }
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
        }

        // 准备发送给AI模型的数据
        const assessmentData = {
            userId,
            subjectId,
            period: period || 'month',
            quizData: quizData || [],
            progressData: progressData || [],
            profile: profile || null,
            includeDetails: includeDetails !== false,
            timestamp: new Date().toISOString()
        };

        // 调用AI模型进行评估
        const result = await callFastGptModel(ASSESSMENT_MODEL_ID, assessmentData);

        // 处理AI返回的结果
        let assessment;

        try {
            // 尝试解析AI返回的内容
            const aiResponse = result.choices[0].message.content;

            // 检查是否为JSON格式
            if (aiResponse.startsWith('{') && aiResponse.endsWith('}')) {
                assessment = JSON.parse(aiResponse);
            } else {
                assessment = {
                    overall: {
                        summary: aiResponse,
                        score: 0,
                        improvement: 0
                    },
                    raw: aiResponse
                };
            }
        } catch (parseError) {
            console.error('解析AI响应时出错:', parseError);

            // 如果解析失败，返回原始文本
            assessment = {
                overall: {
                    summary: result.choices[0].message.content,
                    score: 0,
                    improvement: 0
                },
                raw: result.choices[0].message.content,
                error: '无法解析AI响应为JSON格式'
            };
        }

        // 在Supabase中记录评估结果
        const { error: saveError } = await supabase
            .from('assessment_results')
            .insert({
                user_id: userId,
                subject_id: subjectId,
                assessment_data: assessment,
                created_at: new Date().toISOString()
            });

        if (saveError) {
            console.error('保存评估结果时出错:', saveError);
            // 即使保存失败，仍返回评估结果
        }

        // 返回评估结果
        return NextResponse.json({ assessment });
    } catch (error) {
        console.error('成绩评估API错误:', error);
        return NextResponse.json(
            { error: '处理评估请求时出错: ' + error.message },
            { status: 500 }
        );
    }
}