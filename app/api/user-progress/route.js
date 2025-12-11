// app/api/user-progress/route.js
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * 获取用户学习进度API
 * GET /api/user-progress
 */
export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');

        // 获取用户会话
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        let query = supabase
            .from('user_progress')
            .select(`
        *,
        courses(id, title, subject, level, image_url)
      `)
            .eq('user_id', session.user.id);

        // 如果提供了课程ID，则筛选特定课程的进度
        if (courseId) {
            query = query.eq('course_id', courseId);
        }

        const { data, error } = await query.order('last_accessed', { ascending: false });

        if (error) {
            console.error('获取用户进度时出错:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 格式化响应数据
        const formattedData = data.map(progress => ({
            id: progress.id,
            courseId: progress.course_id,
            courseTitle: progress.courses?.title || 'Unknown Course',
            courseSubject: progress.courses?.subject,
            courseLevel: progress.courses?.level,
            courseImage: progress.courses?.image_url,
            progress: progress.progress_percentage,
            completedChapters: progress.completed_chapters,
            lastAccessed: progress.last_accessed
        }));

        return NextResponse.json({ progresses: formattedData });
    } catch (error) {
        console.error('处理用户进度请求时出错:', error);
        return NextResponse.json({ error: '获取进度失败' }, { status: 500 });
    }
}

/**
 * 更新用户学习进度API
 * POST /api/user-progress
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
        const { course_id, progress_percentage, completed_chapters } = body;

        if (!course_id) {
            return NextResponse.json({ error: '缺少必要参数: course_id' }, { status: 400 });
        }

        // 查询是否已有进度记录
        const { data: existingProgress, error: queryError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('course_id', course_id)
            .single();

        if (queryError && queryError.code !== 'PGRST116') {
            console.error('查询进度记录时出错:', queryError);
            return NextResponse.json({ error: queryError.message }, { status: 500 });
        }

        let result;

        if (existingProgress) {
            // 更新现有进度
            result = await supabase
                .from('user_progress')
                .update({
                    progress_percentage: progress_percentage !== undefined ? progress_percentage : existingProgress.progress_percentage,
                    completed_chapters: completed_chapters !== undefined ? completed_chapters : existingProgress.completed_chapters,
                    last_accessed: new Date().toISOString()
                })
                .eq('id', existingProgress.id);
        } else {
            // 创建新进度记录
            result = await supabase
                .from('user_progress')
                .insert({
                    user_id: session.user.id,
                    course_id,
                    progress_percentage: progress_percentage || 0,
                    completed_chapters: completed_chapters || 0,
                    last_accessed: new Date().toISOString()
                });
        }

        if (result.error) {
            console.error('更新进度时出错:', result.error);
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        // 更新成功
        return NextResponse.json({
            success: true,
            message: existingProgress ? '进度已更新' : '进度已创建'
        });

    } catch (error) {
        console.error('处理进度更新请求时出错:', error);
        return NextResponse.json({ error: '更新进度失败' }, { status: 500 });
    }
}