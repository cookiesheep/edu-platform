import './globals.css'

export const metadata = {
  title: 'EduPlatform - 智能教育平台',
  description: '基于AI技术的个性化教育学习平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <style>{`
          /* 本地字体配置，避免Google Fonts访问问题 */
          body {
            font-family: 'Microsoft YaHei', '微软雅黑', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          }
          
          /* 代码字体 */
          code, pre {
            font-family: 'Courier New', Consolas, Monaco, 'Lucida Console', monospace;
          }
          
          /* 数学公式字体 */
          .math {
            font-family: 'Times New Roman', Times, serif;
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
