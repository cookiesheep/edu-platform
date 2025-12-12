// 简单的测试 API
export async function GET() {
  return Response.json({ 
    status: 'ok',
    message: 'Supabase proxy API is running',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  return Response.json({ 
    status: 'ok',
    message: 'POST method is supported',
    timestamp: new Date().toISOString()
  });
}
