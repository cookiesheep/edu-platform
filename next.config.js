/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 在生产构建中忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 