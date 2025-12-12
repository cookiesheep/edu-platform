// 测试 Vercel 路由配置
// 访问 /api/test-route 来验证基础功能

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  
  return Response.json({
    status: 'ok',
    message: 'Test route is working',
    path: url.pathname,
    search: url.search,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries())
  });
}

export async function POST(request) {
  const body = await request.text();
  
  return Response.json({
    status: 'ok',
    message: 'POST method works',
    receivedBody: body,
    timestamp: new Date().toISOString()
  });
}
