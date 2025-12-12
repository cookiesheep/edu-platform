// Supabase API 完整代理路由
// 处理所有到 Supabase 的请求

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const SUPABASE_URL = 'https://iemqkeofkkvmavmwytxi.supabase.co';

// 代理函数 - 优化版本
async function proxyRequest(request, method) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    const url = new URL(request.url);
    
    // 提取路径：/api/supabase-proxy/后面的部分
    let proxyPath = url.pathname.replace('/api/supabase-proxy', '');
    
    // 处理通过 rewrites 传递的路径参数
    const pathMatch = url.searchParams.get('path');
    if (pathMatch && !proxyPath) {
      proxyPath = `/${pathMatch}`;
    }
    
    console.log(`[${requestId}] 🔄 代理请求: ${method} ${proxyPath}`);
    
    // 如果没有子路径，返回状态信息
    if (!proxyPath || proxyPath === '/') {
      return Response.json({ 
        status: 'ok',
        message: 'Supabase proxy API is running',
        method: method,
        timestamp: new Date().toISOString(),
        requestId: requestId
      });
    }
    
    // 构建目标 URL
    const targetUrl = `${SUPABASE_URL}${proxyPath}${url.search}`;
    console.log(`[${requestId}] 🎯 目标 URL: ${targetUrl}`);
    
    // 复制请求头
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['host', 'connection', 'content-length', 'content-encoding'].includes(lowerKey)) {
        headers.set(key, value);
      }
    });
    
    // 准备请求选项
    const options = {
      method,
      headers,
      // 添加重试和超时控制
      signal: AbortSignal.timeout(50000), // 50s timeout
    };
    
    // 如果有请求体，添加到选项中
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const body = await request.text();
        if (body) {
          options.body = body;
          console.log(`[${requestId}] 📦 请求体长度: ${body.length}`);
        }
      } catch (err) {
        console.error(`[${requestId}] ❌ 读取请求体失败:`, err);
      }
    }
    
    // 发送请求到 Supabase
    const response = await fetch(targetUrl, options);
    
    console.log(`[${requestId}] ✅ 代理响应: ${response.status} ${response.statusText}`);
    
    // 复制响应头（排除会导致问题的头）
    const responseHeaders = new Headers();
    const headersToSkip = ['content-encoding', 'content-length', 'transfer-encoding'];
    
    response.headers.forEach((value, key) => {
      if (!headersToSkip.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });
    
    // 添加 CORS 头
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    
    // 返回响应
    const responseBody = await response.text();
    console.log(`[${requestId}] 📤 响应体长度: ${responseBody.length}`);
    
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error(`[${requestId}] ❌ 代理错误:`, error);
    return new Response(
      JSON.stringify({ 
        error: '代理请求失败', 
        details: error.message,
        requestId: requestId,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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

// 处理 CORS 预检请求
export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
}
