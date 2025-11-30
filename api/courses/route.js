// app/api/courses/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const level = searchParams.get('level');
  const searchTerm = searchParams.get('search');
  
  const supabase = createRouteHandlerClient({ cookies });
  
  let query = supabase.from('courses').select('*');
  
  // 应用过滤条件
  if (subject && subject !== 'all') {
    query = query.eq('subject', subject);
  }
  
  if (level && level !== 'all') {
    query = query.eq('level', level);
  }
  
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  const { data, error } = await query.order('id', { ascending: true });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
