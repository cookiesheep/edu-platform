# Supabase 反向代理测试文档

## 🎯 问题排查步骤

### 1. 停止当前开发服务器
如果服务器正在运行，按 `Ctrl + C` 停止

### 2. 启动开发服务器（带环境检查）
```powershell
.\start-dev.ps1
```

或者手动启动：
```powershell
npm run dev
```

### 3. 访问测试页面
打开浏览器访问：http://localhost:3000/test-supabase

这个页面会：
- ✅ 显示当前的环境变量配置
- ✅ 测试 Supabase 连接
- ✅ 在浏览器控制台显示详细日志

### 4. 检查 Network 请求

在测试页面：
1. 按 F12 打开开发者工具
2. 切换到 **Network** 标签
3. 点击 "🚀 测试连接" 按钮
4. 观察请求：

**✅ 正确的请求应该是：**
```
http://localhost:3000/api/supabase-proxy/auth/v1/signup
```

**❌ 错误的请求（直连）：**
```
https://iemqkeofkkvmavmwytxi.supabase.co/auth/v1/signup
```

### 5. 查看控制台日志

在 Console 标签查看：
- `🔍 Supabase URL:` - 应该显示 `http://localhost:3000/supabase`
- `🧪 测试 Supabase 连接...`
- 任何错误信息

---

## 🔧 常见问题解决方案

### 问题 1: 环境变量为空

**症状**: 测试页面显示 "❌ 未设置"

**解决方案**:
```powershell
# 1. 确认 .env.local 存在
Get-Content .env.local | Select-String "NEXT_PUBLIC"

# 2. 重启开发服务器（必须！）
# 按 Ctrl+C 停止，然后重新运行
npm run dev
```

### 问题 2: 请求直连 Supabase（绕过了代理）

**症状**: Network 标签显示请求到 `*.supabase.co`

**原因**: Supabase 客户端可能缓存了配置

**解决方案**:
1. 完全关闭浏览器（不是标签页，是整个浏览器）
2. 清除浏览器缓存
3. 重新访问 http://localhost:3000/test-supabase

### 问题 3: 405 Method Not Allowed

**症状**: 请求返回 405 状态码

**可能原因**:
1. Rewrites 配置有问题
2. Next.js 版本不兼容
3. 请求方法不正确

**解决方案**:
检查 `next.config.mjs`:
```javascript
async rewrites() {
  return [
    {
      source: '/supabase/:path*',
      destination: 'https://iemqkeofkkvmavmwytxi.supabase.co/:path*',
    },
  ];
}
```

### 问题 4: 本地可以但 Vercel 上不行

**原因**: Vercel 环境变量未设置或设置错误

**Vercel 上应该设置**:
```
NEXT_PUBLIC_SUPABASE_URL=https://eduplatform.top/supabase
```
（注意：不是 localhost，是你的域名）

---

## 📊 调试信息收集

如果问题仍未解决，请提供以下信息：

### 本地环境
```powershell
# 1. 检查 Node.js 版本
node --version

# 2. 检查 Next.js 版本
npm list next

# 3. 查看环境变量
Get-Content .env.local | Select-String "NEXT_PUBLIC_SUPABASE"

# 4. 检查 next.config.mjs
Get-Content next.config.mjs | Select-String -Pattern "rewrite|supabase" -Context 2
```

### 浏览器信息
1. 浏览器类型和版本
2. Console 标签的完整错误信息
3. Network 标签中失败请求的详细信息（Headers, Response）

---

## ✅ 成功标志

当一切正常时，你应该看到：

### 测试页面
- ✅ NEXT_PUBLIC_SUPABASE_URL: `http://localhost:3000/supabase`
- ✅ ANON_KEY: `eyJhbGci...`
- ✅ Supabase 客户端: 已初始化
- ✅ 测试结果: "✅ 连接成功！"

### Network 标签
```
Request URL: http://localhost:3000/supabase/auth/v1/signup
Status Code: 200 OK (或其他 Supabase 返回的正常状态码)
```

### Console 标签
```
🧪 测试 Supabase 连接...
📊 会话测试: { ... }
📊 注册测试: { ... }
```

---

## 🚀 验证通过后

1. 测试注册页面：http://localhost:3000/register
2. 测试登录页面：http://localhost:3000/login
3. 提交代码到 Git
4. 在 Vercel 设置环境变量（参考 VERCEL-ENV-SETUP.md）
5. 重新部署
