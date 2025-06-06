# 🔑 API密钥配置指南

## 当前问题
您的Claude API密钥已过期或无效，需要重新配置。

## 🚀 快速解决方案

### 方案1: Global AI (推荐)
1. 访问 [Global AI](https://globalai.vip/)
2. 注册账号并获取API密钥
3. 在 `.env.local` 文件中更新：
```
CLAUDE_API_KEY=你的新密钥
CLAUDE_API_URL=https://globalai.vip/v1/chat/completions
```

### 方案2: 其他Claude API服务商
- [API2D](https://api2d.com/)
- [OpenAI-SB](https://openai-sb.com/)
- [AI Proxy](https://aiproxy.io/)

### 方案3: 直接使用OpenAI GPT-4
1. 访问 [OpenAI](https://platform.openai.com/)
2. 获取API密钥
3. 配置：
```
CLAUDE_API_KEY=sk-your-openai-key
CLAUDE_API_URL=https://api.openai.com/v1/chat/completions
```

## 🔧 配置步骤

1. **获取API密钥**
   - 选择上述任一服务商
   - 注册账号并充值（通常需要少量费用）
   - 获取API密钥

2. **更新配置文件**
   ```bash
   # 编辑 .env.local 文件
   CLAUDE_API_KEY=你的新密钥
   CLAUDE_API_URL=对应的API地址
   ```

3. **测试配置**
   ```bash
   node test-api.js
   ```

4. **重启开发服务器**
   ```bash
   npm run dev
   ```

## 📊 费用预估
- Global AI: 大约 ¥10-20 可用很久
- OpenAI: 按使用量计费，新用户有免费额度
- 其他服务商: 类似价格水平

## 🆘 需要帮助？
如果您需要帮助配置API密钥，请：
1. 告诉我您选择的服务商
2. 提供获取密钥时遇到的具体问题
3. 我可以帮您完成配置步骤

## ⚡ 临时解决方案
如果暂时无法获取API密钥，我可以为您：
1. 配置模拟数据模式
2. 提供演示用的预设内容
3. 指导本地测试方法

---

**重要**: 请确保API密钥的安全，不要将其提交到公开的代码仓库中。 