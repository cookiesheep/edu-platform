# 🎓 EduPlatform - 智能教育平台

## 📋 项目概述

EduPlatform是一个基于AI技术的个性化教育平台，提供智能学习内容生成、自适应测试评估和个性化学习路径推荐功能。

## ✨ 核心功能

### 🤖 AI学习助手
- **智能问答**：基于Claude API的智能学习咨询
- **个性化指导**：根据学习者水平提供针对性建议
- **学习规划**：制定个性化学习计划

### 📝 智能试题生成
- **自适应评估**：根据年级、学科、水平生成测试题目
- **多维度出题**：选择题、填空题、应用题等多种题型
- **即时批改**：AI自动批改并提供详细解析

### 📚 学习内容生成
- **个性化内容**：基于认知水平和学习风格的内容定制
- **多样化表达**：支持视觉型、文本型、应用型等学习方式
- **结构化学习**：完整的学习指南和知识体系

### 🎯 学习路径规划
- **能力评估**：全面评估学习者当前水平
- **路径推荐**：基于目标的学习路径设计
- **进度跟踪**：实时监控学习进度和效果

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 14**：React服务端渲染框架
- **Tailwind CSS**：实用优先的CSS框架
- **React Hooks**：现代React状态管理

### 后端技术栈
- **Next.js API Routes**：服务端API接口
- **Supabase**：开源Firebase替代方案（可选）
- **Claude API**：Anthropic的AI语言模型

### AI集成
- **Claude 3.5 Sonnet**：高质量内容生成
- **FastGPT**：备用AI服务（可选）
- **自适应算法**：个性化学习推荐

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm 或 yarn
- 有效的Claude API密钥

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/edu-platform.git
cd edu-platform
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.local.example .env.local
# 编辑 .env.local 文件，填入真实的API密钥
```

4. **测试API配置**
```bash
node test-api.js
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问应用**
打开浏览器访问 `http://localhost:3000`

## 🔧 API配置指南

### Claude API配置（推荐）
1. 访问 [Global AI](https://globalai.vip/) 注册账号
2. 获取Claude API密钥
3. 在`.env.local`中配置：
```
CLAUDE_API_KEY=sk-your-claude-api-key
CLAUDE_API_URL=https://globalai.vip/v1/chat/completions
```

### FastGPT配置（备选）
1. 访问 [FastGPT](https://fastgpt.io/) 注册账号
2. 获取API密钥
3. 在`.env.local`中配置：
```
FASTGPT_API_KEY=your-fastgpt-api-key
FASTGPT_API_URL=https://api.fastgpt.io/api/v1/chat/completions
```

### Supabase配置（可选）
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
```

## 🛠️ 开发指南

### 项目结构
```
edu-platform/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API路由
│   │   ├── ai-assistant/  # AI助手API
│   │   ├── quiz-generator/# 试题生成API
│   │   └── content-generator/ # 内容生成API
│   ├── components/        # React组件
│   ├── dashboard/         # 仪表板页面
│   ├── quiz-generator/    # 试题生成页面
│   └── content-generator/ # 内容生成页面
├── components/            # 共享组件
├── lib/                   # 工具库
├── public/               # 静态资源
└── test-api.js           # API测试脚本
```

### API性能优化

#### 1. 请求优化
- **精简提示词**：减少请求体大小，提高响应速度
- **分离内容**：试题和答案分离存储，便于前端处理
- **缓存机制**：对常用内容进行缓存

#### 2. 超时处理
- **增加超时时间**：从30秒增加到60秒
- **重试机制**：失败时自动重试2次
- **智能退避**：根据错误类型调整重试间隔

#### 3. 错误处理
- **分类处理**：根据HTTP状态码提供具体建议
- **详细日志**：完整的请求/响应日志记录
- **用户友好**：向用户提供清晰的错误信息

### 测试
```bash
# API功能测试
node test-api.js

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📊 性能监控

### API性能指标
- **响应时间**：平均2-5秒
- **成功率**：目标>95%
- **并发支持**：支持多用户同时使用

### 监控工具
- **内置日志**：详细的API调用日志
- **性能测试**：多轮测试验证稳定性
- **错误追踪**：完整的错误堆栈跟踪

## 🔍 故障排除

### 常见问题

#### API调用超时
**症状**：显示"AI服务响应超时"错误
**解决方案**：
1. 检查网络连接稳定性
2. 确认API服务状态
3. 减少请求内容复杂度
4. 增加超时时间设置

#### API密钥无效
**症状**：401错误或"API密钥无效"
**解决方案**：
1. 验证`.env.local`文件配置
2. 确认API密钥未过期
3. 检查API密钥权限

#### 网络连接失败
**症状**：fetch错误或503状态码
**解决方案**：
1. 检查网络连接
2. 确认防火墙设置
3. 尝试不同的API端点

### 调试工具
```bash
# 运行API诊断
node test-api.js

# 查看详细日志
npm run dev
# 查看控制台输出的详细API调用日志
```

## 🚀 生产部署

### Vercel部署（推荐）
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 自托管部署
```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 环境变量配置
确保在生产环境中配置所有必要的环境变量：
- `CLAUDE_API_KEY`：Claude API密钥
- `CLAUDE_API_URL`：Claude API地址
- `NODE_ENV=production`：生产环境标识

## 📈 未来规划

### 短期目标
- [ ] 添加用户认证系统
- [ ] 实现学习进度跟踪
- [ ] 优化移动端体验
- [ ] 增加更多学科支持

### 长期目标
- [ ] 集成语音交互功能
- [ ] 开发协作学习功能
- [ ] 构建智能推荐系统
- [ ] 支持多语言界面

## 🤝 贡献指南

### 开发流程
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循React最佳实践
- 编写清晰的注释和文档

## 📄 许可证

本项目采用MIT许可证，详见[LICENSE](LICENSE)文件。

## 📞 支持与联系

- **项目主页**：[GitHub Repository](https://github.com/your-username/edu-platform)
- **问题反馈**：[GitHub Issues](https://github.com/your-username/edu-platform/issues)
- **功能建议**：[GitHub Discussions](https://github.com/your-username/edu-platform/discussions)

---

## 🔄 更新日志

### v1.2.0 (2025-01-06) - 性能优化版
#### 🚀 重大改进
- **API性能优化**：将超时时间从30秒增加到60秒
- **重试机制**：添加智能重试，失败时自动重试2次
- **请求优化**：精简提示词，减少请求体大小50%+
- **错误处理**：完善的错误分类和用户友好提示

#### 🛠️ 技术改进
- **日志系统**：详细的API调用日志和性能监控
- **测试工具**：优化的API测试脚本，多轮稳定性测试
- **响应优化**：减少token使用，提高响应速度

#### 🐛 问题修复
- 修复间歇性API超时问题
- 改善网络不稳定环境下的可靠性
- 优化大请求处理的稳定性

### v1.1.0 (2025-01-05) - API集成版
- ✅ 集成Claude API
- ✅ 完善试题生成功能
- ✅ 添加内容生成功能
- ✅ 实现AI助手对话

### v1.0.0 (2025-01-04) - 初始版本
- ✅ 基础项目架构
- ✅ 用户界面设计
- ✅ 核心功能框架

---

*EduPlatform - 让AI助力每一个学习者的成长之路* 🌟