/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 在生产构建中忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  env: {
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    CLAUDE_API_URL: process.env.CLAUDE_API_URL,
  },
  
  // 🚀 反向代理配置：绕过 GFW 访问 Supabase
  async rewrites() {
    return [
      {
        // 前端请求 /supabase/xxx 时，Next.js 服务器代理转发到真实的 Supabase
        source: '/supabase/:path*',
        destination: 'https://iemqkeofkkvmavmwytxi.supabase.co/:path*',
      },
    ];
  },
};

export default nextConfig;
