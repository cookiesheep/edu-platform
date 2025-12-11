export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 获取用户的评估记录历史
 * GET /api/assessment-records
 */
export async function GET(request) {
  try {
    // 1. 初始化 Supabase 客户端 (Next.js 15 标准写法)
    const cookieStore = await cookies();
    
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
              // 忽略 Server Component 的 set 错误
            }
          },
        },
      }
    );
    
    // 2. 验证用户是否登录 (使用 getUser 更安全)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 3. 从数据库获取评估记录
    // 因为 supabase 客户端包含用户 Session，RLS 策略会自动生效，只返回该用户的数据
    const { data, error } = await supabase
      .from('assessment_records')
      .select('*')
      .eq('user_id', user.id) // 显式过滤更保险
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取评估记录失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. 格式化响应数据 (保持原逻辑)
    const formattedData = (data || []).map(record => ({
      id: record.id,
      relatedQuizId: record.related_quiz_id,
      cognitiveLevel: record.cognitive_level,
      learningStyle: record.learning_style,
      knowledgeGaps: record.knowledge_gaps,
      strengths: record.strengths,
      suggestions: record.suggestions,
      fullReport: record.full_report,
      createdAt: record.created_at
    }));

    return NextResponse.json({ records: formattedData });

  } catch (error) {
    console.error('处理评估记录请求时出错:', error);
    return NextResponse.json(
      { error: '获取评估记录失败: ' + error.message },
      { status: 500 }
    );
  }
}