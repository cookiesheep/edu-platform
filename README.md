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

### v1.2.3 (当前版本) - UI稳定性大幅提升
- 🔧 **修复React Key冲突**：彻底解决"Encountered two children with the same key"错误
- 🔧 **修复选择题选项问题**：解决"只能选A选项"的bug，现在所有选项都可正常选择
- 🔧 **优化字体加载**：移除Google Fonts依赖，使用本地字体避免网络问题
- 🔧 **增强错误处理**：添加ErrorBoundary组件，提供更好的错误恢复机制
- 🔧 **改进题目解析**：使用复合ID确保每个题目和选项的唯一性
- 🔧 **优化UI交互**：改进答题界面的响应性和用户体验

### v1.2.2 - 重大修复版
- 🔧 **修复选择题解析逻辑**：重写试题解析算法，支持多种选项格式
- 🔧 **增强批改API稳定性**：添加3次重试机制，智能处理504/500错误
- 🔧 **优化Vercel配置**：明确指定每个API路由的超时设置
- 🔧 **改进错误处理**：详细的日志输出和用户友好的错误提示
- 🔧 **网络连接优化**：120秒超时和智能重试策略

### v1.2.1 - Vercel部署修复
- 🔧 修复Vercel配置超时时间（从300秒调整到60秒）
- 🔧 优化函数配置路径，使用通配符匹配
- 🔧 调整所有API超时时间到45秒，确保在Vercel限制内运行
- 📝 完善部署故障排除文档

### v1.2.0 - 性能优化版
- ✅ 修复Vercel部署超时问题
- ✅ 增强API错误处理和重试机制
- ✅ 优化试题解析和显示逻辑
- ✅ 添加智能备用结果系统
- ✅ 完善故障排除指南

### v1.1.0
- ✅ 实现试题智能批改功能
- ✅ 添加学习内容生成器
- ✅ 完善用户界面设计
- ✅ 集成Supabase认证系统

### v1.0.0
- ✅ 基础试题生成功能
- ✅ AI学习助手
- ✅ 响应式UI设计
- ✅ 基础部署配置

---

*EduPlatform - 让AI助力每一个学习者的成长之路* 🌟

## 🔍 故障排除

### 常见问题

#### 1. API超时错误（504 Gateway Timeout）
**问题**: 在Vercel上部署后，API调用出现504错误

**解决方案**:
- 项目已配置 `vercel.json` 文件，将API函数超时时间设置为300秒
- 如果仍有问题，检查API密钥是否正确配置
- 查看Vercel函数日志获取详细错误信息

```json
// vercel.json 已配置
{
  "functions": {
    "app/api/*/route.js": {
      "maxDuration": 300
    }
  }
}
```

#### 2. JSON解析错误
**问题**: "Unexpected token 'A', "An error o"... is not valid JSON"

**解决方案**:
- 这通常是由于API返回HTML错误页面而不是JSON
- 检查API密钥配置
- 查看网络标签页的详细错误响应
- API已添加智能重试机制和备用结果

#### 3. 选择题选项显示问题
**问题**: 选择题四个选项只显示一个按钮

**解决方案**:
- 检查试题生成内容的格式
- 确认选项解析逻辑正确
- 查看浏览器控制台是否有JavaScript错误

#### 4. Supabase认证问题
**问题**: "Auth session missing!" 错误

**解决方案**:
- 检查Supabase环境变量配置
- 确认Supabase项目设置正确
- 查看是否需要用户登录

### API配置检查

#### 验证API密钥
```bash
# 测试API连接
node test-api.js
```

#### 查看API日志
- Vercel项目 → Functions → 查看日志
- 检查API调用状态和错误信息

### 性能优化

#### API响应优化
- 已优化提示词长度，减少请求体大小
- 设置合理的max_tokens限制
- 实施智能重试机制

#### 前端优化
- 使用Framer Motion优化动画
- 实施懒加载
- 优化图片和静态资源

## 📊 使用指南

### 试题生成
1. 访问 `/quiz-generator`
2. 填写学科、年级、知识点等信息
3. 点击"生成试题"
4. 在线答题或打印使用
5. 提交后查看AI批改结果

### 内容生成
1. 访问 `/content-generator`
2. 输入知识点和学习需求
3. 选择学习风格和目标
4. 生成个性化学习内容

### 学习路径
1. 访问 `/learning-path`
2. 完成能力评估
3. 获取个性化学习计划
4. 跟踪学习进度

## 🧪 测试

### API测试
```bash
# 运行API测试脚本
node test-api.js

# 测试结果示例
✅ 试题生成测试通过 - 响应时间: 2.1s
✅ 内容生成测试通过 - 响应时间: 1.8s
✅ 试题批改测试通过 - 响应时间: 2.3s
```

### 功能测试
1. **试题生成**: 检查各种学科和难度级别
2. **在线答题**: 验证选择题和填空题功能
3. **智能批改**: 确认批改结果准确性
4. **内容生成**: 测试不同学习风格的内容

## 📈 开发注意事项

### API使用指南
- 所有API都已实施重试机制
- 增加了详细的错误处理和日志
- 支持备用结果以确保用户体验

### 代码规范
- 使用ESLint进行代码检查
- 遵循React最佳实践
- 组件化设计原则

### 数据结构
```javascript
// 试题数据结构
{
  questions: [
    {
      id: 1,
      question: "题目内容",
      type: "multiple_choice",
      options: [
        { key: "A", text: "选项A" },
        { key: "B", text: "选项B" }
      ]
    }
  ]
}

// 批改结果结构
{
  grading_results: {
    total_score: 85,
    max_score: 100,
    percentage: 85,
    grade_level: "良好",
    question_details: [...],
    overall_feedback: {...}
  }
}
```

## 🔮 版本历史

### v1.2.3 (当前版本) - UI稳定性大幅提升
- 🔧 **修复React Key冲突**：彻底解决"Encountered two children with the same key"错误
- 🔧 **修复选择题选项问题**：解决"只能选A选项"的bug，现在所有选项都可正常选择
- 🔧 **优化字体加载**：移除Google Fonts依赖，使用本地字体避免网络问题
- 🔧 **增强错误处理**：添加ErrorBoundary组件，提供更好的错误恢复机制
- 🔧 **改进题目解析**：使用复合ID确保每个题目和选项的唯一性
- 🔧 **优化UI交互**：改进答题界面的响应性和用户体验

### v1.2.2 - 重大修复版
- 🔧 **修复选择题解析逻辑**：重写试题解析算法，支持多种选项格式
- 🔧 **增强批改API稳定性**：添加3次重试机制，智能处理504/500错误
- 🔧 **优化Vercel配置**：明确指定每个API路由的超时设置
- 🔧 **改进错误处理**：详细的日志输出和用户友好的错误提示
- 🔧 **网络连接优化**：120秒超时和智能重试策略

### v1.2.1 - Vercel部署修复
- 🔧 修复Vercel配置超时时间（从300秒调整到60秒）
- 🔧 优化函数配置路径，使用通配符匹配
- 🔧 调整所有API超时时间到45秒，确保在Vercel限制内运行
- 📝 完善部署故障排除文档

### v1.2.0 - 性能优化版
- ✅ 修复Vercel部署超时问题
- ✅ 增强API错误处理和重试机制
- ✅ 优化试题解析和显示逻辑
- ✅ 添加智能备用结果系统
- ✅ 完善故障排除指南

### v1.1.0
- ✅ 实现试题智能批改功能
- ✅ 添加学习内容生成器
- ✅ 完善用户界面设计
- ✅ 集成Supabase认证系统

### v1.0.0
- ✅ 基础试题生成功能
- ✅ AI学习助手
- ✅ 响应式UI设计
- ✅ 基础部署配置

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 支持与反馈

如有问题或建议，请：
1. 查看故障排除指南
2. 检查GitHub Issues
3. 创建新Issue描述问题

## 📄 许可证

本项目采用MIT许可证。详见 [LICENSE](LICENSE) 文件。

---

**注意**: 请确保妥善保管API密钥，不要将其提交到版本控制系统中。在生产环境中使用环境变量管理敏感信息。