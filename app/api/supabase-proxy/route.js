// Supabase API 完整代理路由
// 处理所有到 Supabase 的请求

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const SUPABASE_URL = 'https://iemqkeofkkvmavmwytxi.supabase.co';

// 代理函数
async function proxyRequest(request, method) {
  try {
    const url = new URL(request.url);
    
    // 提取路径：/api/supabase-proxy/后面的部分
    const proxyPath = url.pathname.replace('/api/supabase-proxy', '');
    
    // 如果没有子路径，返回状态信息
    if (!proxyPath || proxyPath === '/') {
      return Response.json({ 
        status: 'ok',
        message: 'Supabase proxy API is running',
        timestamp: new Date().toISOString()
      });
    }
    
    // 构建目标 URL
    const targetUrl = `${SUPABASE_URL}${proxyPath}${url.search}`;
    
    console.log(`🔄 代理请求: ${method} ${targetUrl}`);
    
    // 复制请求头
    const headers = {};
    request.headers.forEach((value, key) => {
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
    const headersToSkip = ['content-encoding', 'content-length', 'transfer-encoding'];
    
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

export async function GET(request) {
  return proxyRequest(request, 'GET');
}

export async function POST(request) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request) {
  return proxyRequest(request, 'PUT');
}

export async function DELETE(request) {
  return proxyRequest(request, 'DELETE');
}

export async function PATCH(request) {
  return proxyRequest(request, 'PATCH');
}
