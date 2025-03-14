// app/api/user-progress/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // 验证用户是否登录
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      courses(title)
    `)
    .eq('user_id', session.user.id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // 验证用户是否登录
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }
  
  const body = await request.json();
  const { course_id, progress_percentage, completed_chapters } = body;
  
  // 查询是否已有进度记录
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('course_id', course_id)
    .single();
  
  let result;
  
  if (existingProgress) {
    // 更新现有进度
    result = await supabase
      .from('user_progress')
      .update({
        progress_percentage,
        completed_chapters,
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
        progress_percentage,
        completed_chapters,
        last_accessed: new Date().toISOString()
      });
  }
  
  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
