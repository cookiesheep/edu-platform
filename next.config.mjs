/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  
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
