// app/api/quiz-records/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
// 1. 删除旧的引用
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// 2. 引入新的 ssr 库
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 获取用户的测验记录历史
 * GET /api/quiz-records
 */
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    
    // 3. 使用新的初始化方式 (兼容 Next.js 15)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // 在 GET 请求中忽略 cookie 设置错误
            }
          },
        },
      }
    );
    
    // 验证用户是否登录
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 从数据库获取测验记录
    const { data, error } = await supabase
      .from('quiz_records')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取测验记录失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 格式化响应数据
    const formattedData = (data || []).map(record => ({
      id: record.id,
      topic: record.topic,
      score: record.score,
      maxScore: record.max_score,
      correctCount: record.correct_count,
      totalQuestions: record.total_questions,
      percentage: record.max_score > 0 ? Math.round((record.score / record.max_score) * 100) : 0,
      questionsDetail: record.questions_detail,
      createdAt: record.created_at
    }));

    return NextResponse.json({ records: formattedData });
  } catch (error) {
    console.error('处理测验记录请求时出错:', error);
    return NextResponse.json(
      { error: '获取测验记录失败: ' + error.message },
      { status: 500 }
    );
  }
}