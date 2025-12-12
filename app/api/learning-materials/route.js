// app/api/learning-materials/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
// 1. 删掉旧的 auth-helpers 引用
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// 2. 引入新的 ssr 库
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 获取用户的学习内容历史
 * GET /api/learning-materials
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
              // 在 Server Component 或 GET 请求中通常不需要设置 cookie，忽略此错误
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
    const topic = searchParams.get('topic');

    // 构建查询
    let query = supabase
      .from('learning_materials')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    // 如果提供了主题，则过滤
    if (topic) {
      query = query.ilike('topic', `%${topic}%`);
    }

    // 执行查询
    const { data, error } = await query;

    if (error) {
      console.error('获取学习内容失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 格式化响应数据
    const formattedData = (data || []).map(record => ({
      id: record.id,
      topic: record.topic,
      content: record.content,
      params: record.params,
      createdAt: record.created_at
    }));

    return NextResponse.json({ materials: formattedData });
  } catch (error) {
    console.error('处理学习内容请求时出错:', error);
    return NextResponse.json(
      { error: '获取学习内容失败: ' + error.message },
      { status: 500 }
    );
  }
}