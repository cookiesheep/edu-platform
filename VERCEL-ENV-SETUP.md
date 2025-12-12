# ⚙️ Vercel 环境变量配置指南

## 🎯 必须在 Vercel 后台设置的环境变量

登录 [Vercel Dashboard](https://vercel.com) → 选择项目 → Settings → Environment Variables

### 1. Supabase 配置（关键！）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eduplatform.top/api/supabase-proxy` | ⚠️ 注意：必须是你的域名 + /api/supabase-proxy |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbXFrZW9ma2t2bWF2bXd5dHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNjc4NzUsImV4cCI6MjA4MDg0Mzg3NX0.Ehm_HT1b6y_IohDkDtLYopHKCFGC5ekLNLM5W2eJkRE` | Supabase 公钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbXFrZW9ma2t2bWF2bXd5dHhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI2Nzg3NSwiZXhwIjoyMDgwODQzODc1fQ.CXtjsbQwFsLP_2N-M7ds4afsD1Z_MnWYGPdm-7CY5LI` | 服务端密钥（仅后端使用） |
| `SUPABASE_URL` | `https://iemqkeofkkvmavmwytxi.supabase.co` | 后端直连地址 |

### 2. AI API 配置

| 变量名 | 值 |
|--------|-----|
| `CLAUDE_API_KEY` | `sk-0PS8ZmxbBPvbROWtIiaaNyx0FfUqwbGsljsyY2sFXZS8lNvi` |
| `CLAUDE_API_URL` | `https://globalai.vip/v1/chat/completions` |

---

## ✅ 设置步骤

### 第一步：进入 Vercel 项目设置
1. 打开 https://vercel.com
2. 选择你的项目（eduplatform）
3. 点击 **Settings** 标签
4. 点击左侧 **Environment Variables**

### 第二步：添加环境变量
对于每个变量：
1. 点击 **Add New** 按钮
2. **Name**: 填入变量名（如 `NEXT_PUBLIC_SUPABASE_URL`）
3. **Value**: 填入对应的值
4. **Environments**: 全选 **Production**, **Preview**, **Development**
5. 点击 **Save**

### 第三步：重新部署
⚠️ **重要**：添加/修改环境变量后，必须重新部署才能生效！

方法 1 - Git 推送触发：
```bash
git add .
git commit -m "update: fix supabase proxy config"
git push origin main
```

方法 2 - 手动触发：
1. 进入 **Deployments** 标签
2. 找到最新的部署
3. 点击右侧的 **三个点** → **Redeploy**

---

## 🔍 验证配置是否生效

### 1. 检查运行时环境变量
部署成功后，在 Vercel 部署日志中搜索：
```
Build Environment Variables:
  NEXT_PUBLIC_SUPABASE_URL: https://eduplatform.top/supabase
```

### 2. 测试注册功能
1. 访问 https://eduplatform.top/register
2. 填写邮箱和密码
3. 点击注册按钮
4. 打开浏览器开发者工具（F12）→ Network 标签
5. 应该看到请求：`https://eduplatform.top/supabase/auth/v1/signup`（而不是直接访问 supabase.co）

### 3. 检查错误
如果还有问题，查看：
- Vercel 部署日志（Runtime Logs）
- 浏览器控制台错误（F12 Console）

---

## ⚠️ 常见错误

### 错误 1: `405 Method Not Allowed`
**原因**: `NEXT_PUBLIC_SUPABASE_URL` 没有设置为代理路径  
**解决**: 确保值是 `https://eduplatform.top/supabase` 而不是 `https://iemqkeofkkvmavmwytxi.supabase.co`

### 错误 2: `Auth session missing!`
**原因**: 前端使用了旧的 Supabase URL  
**解决**: 清除浏览器缓存，或者强制刷新（Ctrl+Shift+R）

### 错误 3: 部署后修改未生效
**原因**: Vercel 使用了缓存的构建  
**解决**: 点击 **Redeploy** 而不是 **Restart**

---

## 📝 快速检查清单

- [ ] 所有环境变量已添加到 Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 确认使用了 `/supabase` 路径
- [ ] 已点击 Redeploy 按钮重新部署
- [ ] 部署日志显示 "Build completed"
- [ ] 访问网站测试注册功能
- [ ] 浏览器网络请求显示正确的代理路径

---

## 🆘 还是不行？

1. **验证 next.config.mjs 是否包含 rewrites 配置**
2. **检查 Vercel 项目根目录是否正确**
3. **确认域名 DNS 已正确解析到 Vercel**
4. **查看 Vercel Runtime Logs** 获取详细错误信息
