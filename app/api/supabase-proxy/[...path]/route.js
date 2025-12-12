// Supabase API 代理路由
// 将所有 /api/supabase-proxy/* 请求转发到真实的 Supabase

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const SUPABASE_URL = 'https://iemqkeofkkvmavmwytxi.supabase.co';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'GET');
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'POST');
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'PUT');
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'DELETE');
}

export async function PATCH(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'PATCH');
}

async function proxyRequest(request, params, method) {
  try {
    // 调试：打印 params 结构
    console.log('📦 Params:', JSON.stringify(params));
    
    if (!params?.path) {
      console.error('❌ params.path 不存在！');
      return new Response(
        JSON.stringify({ error: 'Invalid path parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const path = params.path.join('/');
    const url = new URL(request.url);
    
    // 构建目标 URL
    const targetUrl = `${SUPABASE_URL}/${path}${url.search}`;
    
    console.log(`🔄 代理请求: ${method} ${targetUrl}`);
    
    // 复制请求头
    const headers = {};
    request.headers.forEach((value, key) => {
      // 跳过某些不应该转发的头
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });
    
    // 准备请求选项
    const options = {
      method,
      headers,
    };
    
    // 如果有请求体，添加到选项中
    if (method !== 'GET' && method !== 'HEAD') {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }
    
    // 发送请求到 Supabase
    const response = await fetch(targetUrl, options);
    
    console.log(`✅ 代理响应: ${response.status} ${response.statusText}`);
    
    // 复制响应头（排除会导致问题的头）
    const responseHeaders = {};
    const headersToSkip = [
      'content-encoding',  // fetch 已自动解压，不能再传这个头
      'content-length',    // 长度可能已改变
      'transfer-encoding', // 不应该转发
    ];
    
    response.headers.forEach((value, key) => {
      if (!headersToSkip.includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });
    
    // 返回响应
    const responseBody = await response.text();
    
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('❌ 代理错误:', error);
    return new Response(
      JSON.stringify({ error: '代理请求失败', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
