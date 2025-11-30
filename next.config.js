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
  }
}

module.exports = nextConfig 