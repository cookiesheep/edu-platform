# EduPlatform - 智能教育学习平台

一个基于 Next.js 14 的现代化在线教育平台，集成了AI辅助学习、智能出题评估、学习路径规划等功能。

## 🌟 主要特性

### 核心功能
- **📝 智能出题+评估** - AI自动生成题目并智能评估学习效果  
- **📚 精品课程库** - 汇聚B站、慕课等优质平台的真实课程
- **🎯 智能学习路径** - AI个性化定制学习计划和进度跟踪
- **📊 智能内容生成** - 基于学习者特征的个性化学习内容生成系统
- **📊 学习统计面板** - 详细的学习数据分析和可视化
- **🤖 AI学习助手** - 智能问答、学习指导、个性化建议（游客可用）

### 最新更新 (2024-03-15)

#### 🎨 全新UI/UX设计
- **现代化配色方案**: 将刺眼的橙色调整为柔和的蓝紫渐变色系
- **一致性设计语言**: 统一了所有页面的背景色和视觉风格
- **响应式布局**: 完美适配桌面端、平板和移动设备
- **微交互动画**: 使用Framer Motion增强用户体验

#### 📊 智能内容生成系统重构
- **全新UI设计**: 现代化的蓝紫渐变设计，提升视觉体验
- **个性化生成**: 基于学习者认知水平、学习风格等特征智能生成内容
- **多维度调控**: 支持复杂度、密度、互动性等多参数调节
- **实时预览**: 生成过程可视化，提供清晰的状态反馈
- **智能适配**: 根据知识点类型和学习目标精准匹配内容结构

#### 🔄 导航系统优化
- **功能重组**: 将AI助手调整为学习内容生成入口，突出核心功能
- **访问权限**: AI助手支持游客模式，无需登录即可体验基础功能
- **优先级调整**: 根据用户使用频率优化功能入口排序

#### 📚 真实课程数据集成
- **B站优质课程**: 
  - Python零基础教程 (黑马程序员)
  - JavaScript高级编程 (技术胖)
  - 机器学习基础 (李宏毅教授)
  - React+TypeScript实战 (尚硅谷)
  - 深度学习PyTorch (小土堆)

- **中国大学MOOC课程**:
  - 数据结构与算法 (清华大学 邓俊辉)
  - 微积分 (北京大学 张筑生)
  - 大学物理 (北京大学 钟锡华)

- **课程数据完整性**:
  - ✅ 真实的课程链接和平台标识
  - ✅ 详细的讲师和大学信息
  - ✅ 准确的学习人数和评分数据
  - ✅ 完整的课程大纲和时长信息

#### 🔗 外部平台集成
- **直接跳转学习**: 点击课程直接跳转到B站/慕课原页面
- **平台标识**: 清晰显示课程来源平台（B站/中国大学MOOC）
- **价格信息**: 准确标识免费和付费课程
- **讲师认证**: 显示大学/机构认证信息

#### 🎯 智能学习路径系统
- **目标导向规划**: 基于学习目标智能制定路径
- **多领域覆盖**: 编程、AI、数学、物理等6大领域
- **进度追踪**: 实时监控学习进展和完成度
- **个性化推荐**: 根据水平和时间投入智能推荐

#### 🎨 配色系统优化
- **主色调**: 深蓝渐变 (#1e40af → #7c3aed)
- **辅助色**: 
  - 成功色: 绿色系 (#10b981)
  - 警告色: 黄色系 (#f59e0b) 
  - 错误色: 红色系 (#ef4444)
- **背景层次**:
  - 一级背景: 白色 (#ffffff)
  - 二级背景: 浅灰 (#f9fafb)
  - 三级背景: 深色渐变用于对比度

#### ⚡ 重要BUG修复 (2024-12-28)
- **前端错误修复**: 修复了QuizResults组件中访问未定义属性导致的运行时错误
  - 问题：`Cannot read properties of undefined (reading 'level')`
  - 原因：前端代码尝试访问不存在的属性路径（如 `knowledge_assessment.level`、`learning_style.primary`）
  - 解决：调整前端代码以匹配assessment API实际返回的数据结构
  - 影响：确保试题评估完成后能正常显示结果页面

- **数据结构统一**: 规范了assessment API与前端组件间的数据交互
  - 统一使用 `cognitive_assessment.level`（认知水平）
  - 基于 `overall_performance.score` 评估总体表现  
  - 根据 `learning_patterns.modification_count` 分析答题风格
  - 通过 `completion_rate` 评估学习投入度

- **系统稳定性提升**: 
  - API调用成功率保持100%（批改、评估均正常）
  - 消除了导致开发服务器崩溃的前端错误
  - 确保用户能顺利完成"出题→答题→批改→评估"完整流程

### 技术架构

#### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + 自定义组件
- **动画**: Framer Motion
- **图标**: Lucide React
- **状态管理**: React Hooks
- **类型检查**: JavaScript + JSDoc

#### 数据库设计
- **用户系统**: 用户信息、学习进度、偏好设置
- **课程系统**: 课程信息、章节内容、学习路径
- **AI系统**: 题目库、评估结果、智能推荐

#### API集成
- **FastGPT**: AI对话和智能问答
- **外部课程API**: B站、慕课网课程数据同步
- **内容生成**: AI辅助内容创作

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/edu-platform.git
cd edu-platform
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
```bash
cp .env.local.example .env.local
```

配置环境变量：
```bash
# FastGPT API配置
FASTGPT_API_KEY=your_fastgpt_api_key
FASTGPT_BASE_URL=your_fastgpt_base_url

# 数据库配置 (如果使用)
DATABASE_URL=your_database_url

# 其他配置
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **启动开发服务器**
```bash
npm run dev
# 或  
yarn dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📱 页面导航

### 主要页面
- **首页** (`/`) - 平台介绍、功能展示、课程推荐
- **课程中心** (`/courses`) - 完整课程库，支持搜索和筛选
- **课程详情** (`/courses/[id]`) - 课程详细信息、章节、评价
- **智能出题** (`/quiz-generator`) - AI题目生成和评估
- **学习路径** (`/learning-path`) - 个性化学习规划
- **学习内容生成** (`/content-generator`) - 基于学习者特征的智能内容生成
- **AI助手** (`/ai-assistant`) - 智能问答和学习指导（支持游客模式）
- **学习统计** (`/dashboard`) - 个人学习数据面板

### 功能特色

#### 📊 智能内容生成系统
- **学习者建模**: 基于认知水平、先验知识、学习风格等多维度特征
- **知识点分析**: 智能识别概念类型、复杂度、先决条件
- **个性化生成**: 根据学习者特征定制最适合的内容结构和表达方式
- **多样化调节**: 支持语言复杂度、内容密度、实例比例等细粒度调控
- **实时反馈**: 生成过程可视化，提供清晰的状态和进度反馈

#### 📝 智能出题+评估系统
- **多种题型**: 选择题、填空题、简答题、编程题
- **难度分级**: 基础、中级、高级三个等级
- **智能评估**: AI自动评分和详细反馈
- **错题分析**: 错误原因分析和改进建议
- **学习报告**: 综合学习表现评估

#### 🎯 智能学习路径
- **目标设定**: 明确学习目标和期望成果
- **能力评估**: 当前水平测试和技能分析
- **路径规划**: 个性化学习步骤和时间安排
- **进度跟踪**: 实时学习进度监控
- **动态调整**: 根据学习表现优化路径

#### 🤖 AI学习助手（支持游客模式）
- **智能问答**: 支持学科相关问题解答
- **学习指导**: 个性化学习建议和方法指导
- **概念解释**: 复杂概念的简化解释
- **答疑解惑**: 24/7在线智能答疑
- **游客访问**: 无需登录即可体验基础AI助手功能

#### 📚 精品课程库
- **多平台整合**: B站、中国大学MOOC等优质资源
- **智能筛选**: 按学科、难度、价格、评分筛选
- **详细信息**: 课程大纲、讲师介绍、学习人数
- **直达学习**: 一键跳转到原平台学习

## 🛠️ 开发指南

### 项目结构
```
edu-platform/
├── app/                    # Next.js 14 App Router
│   ├── page.js            # 首页
│   ├── courses/           # 课程相关页面
│   ├── ai-assistant/      # AI助手页面
│   ├── quiz-generator/    # 智能出题页面
│   ├── learning-path/     # 学习路径页面
│   ├── content-generator/ # 学习内容生成页面
│   └── api/              # API路由
├── components/            # React组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI组件
├── lib/                  # 工具函数
├── public/               # 静态资源
└── styles/               # 样式文件
```

### 主要组件

#### 布局组件
- `MainLayout`: 主要页面布局，包含导航和页脚
- `Header`: 响应式导航栏，支持用户状态管理
- `Footer`: 页脚组件，包含链接和联系信息

#### UI组件
- `CourseCard`: 课程卡片，支持多种显示模式
- `FeatureCard`: 功能特色展示卡片
- `SubjectIcon`: 学科图标组件
- `AnimatedBackground`: 动态背景效果

### 样式系统

#### Tailwind配置
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

#### 响应式断点
- `sm`: 640px+
- `md`: 768px+ 
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

## 🔧 自定义配置

### 主题颜色调整
在 `/app/page.js` 中可以调整各专区的背景色：

```javascript
// 学科覆盖专区
<section className="py-16 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">

// 核心功能专区  
<section className="py-16 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100">

// 课程展示专区
<section className="py-16 bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100">

// 信任展示专区
<section className="py-16 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900">
```

### 颜色深度调整参数
- `from-[color]-50`: 最浅
- `from-[color]-100`: 浅色
- `from-[color]-200`: 中浅色  
- `via-[color]-50/60/70`: 中间色透明度
- `bg-white/60`: 白色背景60%透明度

## 🤝 贡献指南

### 提交规范
- `feat`: 新功能
- `fix`: 问题修复
- `docs`: 文档更新
- `style`: 样式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- **Issues**: [GitHub Issues](https://github.com/your-username/edu-platform/issues)
- **文档**: [在线文档](https://edu-platform-docs.vercel.app)
- **邮箱**: support@eduplatform.com

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**EduPlatform** - 让学习更智能，让教育更个性化

### 🆕 最新重大更新 (2024-12-06)

#### 🔧 核心架构升级
- **API框架迁移**: 完全移除FastGPT依赖，升级到Claude API
- **环境配置优化**: 标准化环境变量配置，支持多种Claude兼容API服务
- **错误处理增强**: 统一的错误处理机制，提供清晰的错误信息和调试支持
- **超时管理**: 实现30秒API超时机制，避免504错误
- **配置验证**: 启动时检查API配置，提供明确的配置指导

#### 🚀 API服务重构

##### 内容生成系统 (`/api/content-generator`)
- **EduSage引擎**: 专业的自适应教育内容生成系统
- **个性化建模**: 基于认知水平、学习风格、动机类型的精准建模
- **结构化输出**: 标准化的学习指南格式，包含8个核心模块
- **可视化支持**: 针对视觉型学习者的图表和流程图生成
- **智能降级**: API失败时提供高质量的备用内容

##### 试题生成系统 (`/api/quiz-generator`)
- **EduQuest引擎**: 专业的试题生成系统，支持多种题型
- **智能难度调节**: 基于年级、学科、自评水平的精准难度控制
- **多维度评估**: 知识点覆盖、认知层次、时间估算
- **标准化格式**: JSON结构化输出，支持前端直接使用

##### 问题生成系统 (`/api/questions/generate`)
- **EduQuest引擎**: 智能问题生成，支持个性化练习
- **多题型支持**: 选择题、填空题、简答题等
- **知识点匹配**: 精确的知识点标签和解析
- **游客友好**: 支持无用户ID的访问模式

##### 学习路径规划 (`/api/learning-path`)
- **EduPath引擎**: 个性化学习路径规划系统
- **阶段化设计**: 多阶段学习计划，包含具体的里程碑和评估标准
- **资源整合**: 智能推荐学习资源和练习方法
- **灵活调整**: 支持根据学习进度动态调整计划

##### 学习评估系统 (`/api/assessment`)
- **EduAnalyst引擎**: 专业的学习者分析系统
- **多维分析**: 认知能力、知识掌握、学习风格、动机分析
- **行为建模**: 基于答题行为的学习特征推断
- **结构化报告**: 标准化的评估报告格式，支持后续个性化推荐

##### 智能助手系统 (`/api/ai-assistant`)
- **专业化分工**: 根据功能类型提供专门的系统提示词
- **会话历史**: 完整的聊天记录保存和管理
- **游客支持**: 无需登录即可体验基础AI助手功能

#### 🔒 安全性增强
- **密钥管理**: 移除所有硬编码API密钥，使用环境变量管理
- **权限控制**: 优雅的身份验证处理，支持游客和登录用户
- **数据保护**: 安全的用户数据处理和存储机制

#### 🛠️ 开发体验优化
- **统一错误处理**: 标准化的错误响应格式
- **调试支持**: 开发环境下提供详细的错误堆栈信息
- **日志系统**: 完善的日志记录，便于问题排查
- **代码清理**: 移除所有过时的依赖和代码

## 🔧 环境配置

### API服务配置

EduPlatform支持多种AI API服务，包括Claude、OpenAI兼容API、国内AI服务等。

#### 1. 配置API密钥

在项目根目录创建 `.env.local` 文件（如果不存在）：

```bash
# EduPlatform 环境变量配置

# 主要API配置（必填）
CLAUDE_API_KEY=your-api-key-here
CLAUDE_API_URL=https://api.anthropic.com/v1/messages

# 可选：Supabase 用户认证服务
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here  
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key-here

# 开发环境标识
NODE_ENV=development
```

#### 2. 支持的API服务

##### Claude官方API
```bash
CLAUDE_API_KEY=claude-api-key
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
```

##### OpenAI官方API
```bash
CLAUDE_API_KEY=openai-api-key
CLAUDE_API_URL=https://api.openai.com/v1/chat/completions
```

##### 国内AI服务
```bash
# 月之暗面 Moonshot
CLAUDE_API_KEY=moonshot-api-key
CLAUDE_API_URL=https://api.moonshot.cn/v1/chat/completions

# DeepSeek
CLAUDE_API_KEY=deepseek-api-key  
CLAUDE_API_URL=https://api.deepseek.com/v1/chat/completions

# 其他兼容OpenAI格式的服务
CLAUDE_API_KEY=your-api-key
CLAUDE_API_URL=https://your-api-service.com/v1/chat/completions
```

#### 3. API配置验证

启动开发服务器后，系统会自动验证API配置：

```bash
npm run dev
```

检查控制台输出：
- ✅ `API配置有效` - 配置正确
- ⚠️ `使用模拟数据` - API未配置，使用演示数据
- ❌ `API调用失败` - 检查密钥和网络连接

#### 4. 备用API机制

系统内置多个备用API服务，当主API失败时会自动尝试：

1. **主API服务** - 您配置的主要API
2. **DeepSeek API** - 国内高性能AI服务  
3. **Moonshot API** - 月之暗面API服务
4. **OpenAI API** - OpenAI官方服务
5. **模拟数据** - 演示用数据（最后备用）

### 故障排除指南

#### 常见问题

##### 🔴 401 认证失败
```
Error: AI服务暂时不可用 (401)
```
**解决方案**:
1. 检查API密钥是否正确
2. 确认API密钥未过期
3. 验证API服务URL是否正确
4. 检查API密钥格式（是否包含前缀等）

##### 🔴 403 访问被拒绝  
```
Error: AI服务暂时不可用 (403)
```
**解决方案**:
1. 检查API配额是否用完
2. 确认IP地址白名单设置
3. 验证API服务的地区限制

##### 🔴 超时错误
```
Error: AI服务响应超时
```
**解决方案**:
1. 检查网络连接
2. 尝试切换到其他API服务
3. 增加超时时间设置

##### 🔴 Supabase错误
```
Error: supabase.auth.getSession is not a function
```
**解决方案**:
- 系统已修复此问题，重启开发服务器即可

#### 调试模式

开发环境下，系统提供详细的调试信息：

```bash
# 查看API调用日志
npm run dev

# 检查环境变量
echo $CLAUDE_API_KEY  # Linux/Mac
echo $env:CLAUDE_API_KEY  # Windows PowerShell
```

#### 配置优先级

系统按以下优先级查找配置：
1. `.env.local` 文件（推荐）
2. `.env` 文件  
3. 系统环境变量
4. 默认配置

### 生产环境配置

#### Vercel部署

在Vercel项目设置中添加环境变量：

```bash
CLAUDE_API_KEY=your-production-api-key
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
```

#### Docker部署

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  edu-platform:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CLAUDE_API_KEY=your-api-key
      - CLAUDE_API_URL=https://api.anthropic.com/v1/messages
      - NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
      - NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
```