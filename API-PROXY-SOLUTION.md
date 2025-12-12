# 🎯 Supabase 代理方案更新说明

## ❌ 旧方案的问题

使用 Next.js `rewrites` 配置时，Supabase 客户端发送请求后收到 404 HTML 页面，导致 JSON 解析错误：
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**原因**: Next.js rewrites 在某些情况下不能正确处理客户端 Supabase SDK 的请求。

---

## ✅ 新方案：API Route 代理

### 架构变更

**旧方案（rewrites）：**
```
浏览器 → /supabase/* → Next.js rewrites → Supabase
```

**新方案（API Route）：**
```
浏览器 → /api/supabase-proxy/* → API Route 处理 → Supabase
```

### 关键文件

#### 1. API 代理路由
**文件**: `app/api/supabase-proxy/[...path]/route.js`

这个路由拦截所有 `/api/supabase-proxy/*` 请求，并转发到真实的 Supabase：
- 支持所有 HTTP 方法（GET, POST, PUT, DELETE, PATCH）
- 复制请求头和请求体
- 返回原始的 Supabase 响应

#### 2. 环境变量更新
**文件**: `.env.local`

```env
# 本地开发
NEXT_PUBLIC_SUPABASE_URL=http://localhost:3000/api/supabase-proxy

# Vercel 生产环境（需要在 Vercel Dashboard 设置）
NEXT_PUBLIC_SUPABASE_URL=https://eduplatform.top/api/supabase-proxy
```

---

## 🚀 现在测试

### 步骤 1: 访问测试页面
```
http://localhost:3000/test-supabase
```

### 步骤 2: 检查环境配置
应该显示：
```
NEXT_PUBLIC_SUPABASE_URL: http://localhost:3000/api/supabase-proxy
ANON_KEY: ✅ eyJhbGci...
Supabase 客户端: ✅ 已初始化
```

### 步骤 3: 点击 "🚀 测试连接"

### 步骤 4: 查看 Network 标签
应该看到：
```
✅ http://localhost:3000/api/supabase-proxy/auth/v1/signup
状态码: 200 或 400（取决于 Supabase 的响应）
```

**不应该再看到**:
- ❌ 404 错误
- ❌ HTML 响应
- ❌ JSON 解析错误

---

## 🔧 工作原理

### 请求流程

1. **前端调用**
   ```javascript
   supabase.auth.signUp({ email, password })
   ```

2. **Supabase SDK 发送请求**
   ```
   POST http://localhost:3000/api/supabase-proxy/auth/v1/signup
   ```

3. **API Route 拦截**
   ```javascript
   // app/api/supabase-proxy/[...path]/route.js
   export async function POST(request, { params }) {
     const path = params.path.join('/'); // "auth/v1/signup"
     const targetUrl = `https://iemqkeofkkvmavmwytxi.supabase.co/${path}`;
     const response = await fetch(targetUrl, { ... });
     return response;
   }
   ```

4. **转发到真实 Supabase**
   ```
   POST https://iemqkeofkkvmavmwytxi.supabase.co/auth/v1/signup
   ```

5. **返回响应给前端**
   前端收到正确的 JSON 响应

---

## 📊 对比

| 方案 | 优点 | 缺点 | 状态 |
|------|------|------|------|
| **Rewrites** | 配置简单 | 在某些情况下不工作 | ❌ 已废弃 |
| **API Route** | 完全控制，稳定可靠 | 需要额外的代码 | ✅ 当前使用 |

---

## 🌐 部署到 Vercel

### 必须修改的环境变量

在 Vercel Dashboard → Settings → Environment Variables：

**修改**:
```
NEXT_PUBLIC_SUPABASE_URL
```

**从**:
```
https://eduplatform.top/supabase
```

**改为**:
```
https://eduplatform.top/api/supabase-proxy
```

### 重新部署
```bash
git add .
git commit -m "feat: 使用 API Route 代理 Supabase 请求"
git push origin main
```

然后在 Vercel 点击 **Redeploy**。

---

## ✅ 验证成功的标志

### 本地开发
- 测试页面显示 "✅ 连接成功！"
- Network 请求到 `/api/supabase-proxy/*`
- 没有 404 或 JSON 解析错误
- Console 显示：`🔄 代理请求: POST https://...`

### 生产环境
- 注册功能正常
- 登录功能正常
- Network 显示：`https://eduplatform.top/api/supabase-proxy/*`

---

## 🐛 故障排除

### 如果还有错误

1. **确认 API 路由文件存在**
   ```powershell
   Test-Path "app\api\supabase-proxy\[...path]\route.js"
   ```

2. **重启开发服务器**
   ```powershell
   # Ctrl+C 停止
   npm run dev
   ```

3. **清除浏览器缓存**
   - Ctrl + Shift + Delete
   - 选择"缓存的图像和文件"
   - 清除

4. **检查终端日志**
   应该看到：
   ```
   🔄 代理请求: POST https://iemqkeofkkvmavmwytxi.supabase.co/auth/v1/signup
   ✅ 代理响应: 200 OK
   ```

---

## 📝 总结

- ✅ 使用 API Route 完全控制代理逻辑
- ✅ 支持所有 HTTP 方法
- ✅ 正确处理请求头和响应头
- ✅ 本地和生产环境统一方案
- ✅ 绕过 GFW 访问 Supabase
