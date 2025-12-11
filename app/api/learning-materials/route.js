// app/api/learning-materials/route.js
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * 获取用户的学习内容历史
 * GET /api/learning-materials
 */
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
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

