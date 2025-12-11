// app/api/quiz/submit/route.js
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * 测验提交API处理函数
 * 接收用户答案并保存测验结果
 */
export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
        // 验证用户是否登录
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        // 解析请求体
        const body = await request.json();
        const { courseId, chapterId, answers, totalScore = 100 } = body;

        // 验证必要参数
        if (!courseId || !answers || !Array.isArray(answers)) {
            return NextResponse.json(
                { error: '缺少必要参数：courseId、answers或格式不正确' },
                { status: 400 }
            );
        }

        // 计算得分
        const correctCount = answers.filter(a => a.isCorrect).length;
        const score = Math.round((correctCount / answers.length) * totalScore);

        // 保存测验结果到数据库
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert({
                user_id: session.user.id,
                course_id: courseId,
                chapter_id: chapterId || null,
                score,
                max_score: totalScore,
                answers: answers
            });

        if (error) {
            console.error('保存测验结果时出错:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 更新用户进度
        if (chapterId) {
            // 获取当前课程章节数
            const { data: chapterData, error: chapterError } = await supabase
                .from('course_chapters')
                .select('id')
                .eq('course_id', courseId);

            if (chapterError) {
                console.error('获取课程章节数时出错:', chapterError);
            } else {
                const totalChapters = chapterData.length;

                // 获取已完成测验的章节
                const { data: attemptedData, error: attemptedError } = await supabase
                    .from('quiz_attempts')
                    .select('chapter_id')
                    .eq('user_id', session.user.id)
                    .eq('course_id', courseId)
                    .is('chapter_id', 'not.null');

                if (!attemptedError) {
                    // 计算不重复的已完成章节数
                    const completedChapterIds = new Set(attemptedData.map(a => a.chapter_id));
                    const completedChapters = completedChapterIds.size;

                    // 计算进度百分比
                    const progressPercentage = Math.round((completedChapters / totalChapters) * 100);

                    // 更新用户进度
                    await supabase
                        .from('user_progress')
                        .upsert({
                            user_id: session.user.id,
                            course_id: courseId,
                            progress_percentage: progressPercentage,
                            completed_chapters: completedChapters,
                            last_accessed: new Date().toISOString()
                        }, {
                            onConflict: 'user_id,course_id',
                            ignoreDuplicates: false
                        });
                }
            }
        }

        // 返回测验结果
        return NextResponse.json({
            success: true,
            score,
            totalScore,
            correctCount,
            totalQuestions: answers.length,
            percentage: Math.round((score / totalScore) * 100)
        });

    } catch (error) {
        console.error('处理测验提交时出错:', error);
        return NextResponse.json(
            { error: '处理测验提交失败: ' + error.message },
            { status: 500 }
        );
    }
}

/**
 * 获取用户测验历史API
 */
export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
        // 获取查询参数
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        // 验证用户是否登录
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        // 构建查询
        let query = supabase
            .from('quiz_attempts')
            .select(`
        *,
        courses(title, subject, level),
        course_chapters(title)
      `)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        // 如果指定了课程ID则过滤
        if (courseId) {
            query = query.eq('course_id', courseId);
        }

        // 执行查询
        const { data, error } = await query;

        if (error) {
            console.error('获取测验历史时出错:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 格式化响应数据
        const formattedData = data.map(attempt => ({
            id: attempt.id,
            courseId: attempt.course_id,
            courseTitle: attempt.courses?.title || 'Unknown Course',
            courseSubject: attempt.courses?.subject,
            chapterId: attempt.chapter_id,
            chapterTitle: attempt.course_chapters?.title,
            score: attempt.score,
            maxScore: attempt.max_score,
            percentage: Math.round((attempt.score / attempt.max_score) * 100),
            createdAt: attempt.created_at
        }));

        return NextResponse.json({ attempts: formattedData });

    } catch (error) {
        console.error('获取测验历史时出错:', error);
        return NextResponse.json(
            { error: '获取测验历史失败: ' + error.message },
            { status: 500 }
        );
    }
}