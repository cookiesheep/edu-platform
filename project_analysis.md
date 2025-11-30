# EduPlatform 项目深度分析报告

## 1. 项目概览
**EduPlatform** 是一个基于 Next.js 14 构建的现代化智能教育平台，旨在利用 AI 技术提供个性化的学习体验。项目集成了智能出题、课程聚合、学习路径规划和 AI 助手等核心功能。

### 技术栈
- **前端框架**: Next.js 14 (App Router)
- **样式方案**: Tailwind CSS v4 + 自定义 CSS 变量
- **动画库**: Framer Motion (用于页面过渡和微交互)
- **图标库**: Lucide React
- **后端/API**: Next.js API Routes
- **AI 集成**: 支持 Claude, OpenAI, DeepSeek, Moonshot 等多种模型接口
- **数据存储**: Supabase (用于用户认证和数据持久化)

## 2. 目录结构分析
项目遵循标准的 Next.js App Router 结构：

- **`app/`**: 应用路由和页面逻辑
  - `layout.js`: 全局布局，包含字体配置和 CSS 引入。
  - `page.js`: 首页，包含 Hero 区域、课程展示和功能入口。
  - `api/`: 后端 API 路由，处理 AI 请求和数据逻辑。
  - `quiz-generator/`, `courses/`, `ai-assistant/`: 各个功能模块的页面。
- **`components/`**: 可复用组件
  - `layout/`: 布局组件（如 Header, Footer）。
  - `ui/`: 通用 UI 组件（如 Button, Card）。
- **`lib/`**: 工具函数和辅助类。
- **`public/`**: 静态资源（图片、图标）。

## 3. UI/UX 设计分析
项目采用了极具现代感和科技感的设计风格，注重用户体验和视觉冲击力。

### 设计语言
- **配色方案**: 以深蓝、紫、粉色渐变为主色调，营造"智慧"和"未来感"。
  - 主背景：`bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950`
  - 强调色：Emerald (成功/推荐), Blue/Purple (主操作), Yellow/Orange (高亮/警告)。
- **视觉效果**:
  - **Glassmorphism (毛玻璃)**: 广泛用于卡片和导航栏，提升层次感。
  - **动态背景**: 首页使用粒子效果和流动的渐变光晕。
  - **微交互**: 按钮悬停缩放、卡片浮动、图标旋转等细节动画。

### 核心组件
- **Hero Section**: 动态粒子背景 + 渐变文字标题，强烈的视觉引导。
- **CourseCard**: 包含封面、标签、评分、价格等信息，悬停时有上浮和阴影加深效果。
- **FeatureCard**: 使用毛玻璃效果，配以动态渐变图标，展示核心功能。

## 4. 功能模块深度解析

### 4.1 智能出题系统 (Quiz Generator)
这是项目的核心功能之一，实现了从用户输入到 AI 生成再到前端展示的完整流程。

- **前端 (`app/quiz-generator/page.js`)**:
  - 使用 `QuizGeneratorForm` 收集用户需求（年级、学科、难度等）。
  - 调用 `/api/quiz-generator` 接口。
  - 接收返回的 JSON 数据，渲染 `GeneratedQuiz` 组件供用户答题。
  - 支持"重新生成"和"错题分析"。

- **后端 (`app/api/quiz-generator/route.js`)**:
  - **多模型支持**: 兼容 Claude 和 OpenAI 格式的 API，内置 DeepSeek/Moonshot 作为备用。
  - **Prompt 工程**: 精心设计的 System Prompt，要求 AI 按特定格式（`===QUIZ_CONTENT_START===`）输出，实现题目与答案的自动分离。
  - **容错机制**: 包含超时控制 (30s) 和多级 API 降级策略，确保服务高可用。

### 4.2 课程中心 (Courses)
- 目前主要展示精选课程（Mock Data），模拟了 B 站和 MOOC 的课程结构。
- 支持按学科、难度筛选。
- 详情页包含课程大纲、讲师信息和评价系统。

### 4.3 AI 助手 (AI Assistant)
- 提供 24/7 的智能问答服务。
- 支持游客模式，降低使用门槛。
- 针对不同学科提供定制化的学习建议。

## 5. 数据流与架构
1.  **用户交互**: 用户在前端组件（如表单）输入数据。
2.  **API 调用**: 前端通过 `fetch` 请求 Next.js API Routes。
3.  **AI 处理**: API Route 构建 Prompt，调用外部 LLM 服务（Claude/OpenAI）。
4.  **数据解析**: 后端解析 AI 返回的非结构化文本，转换为结构化 JSON。
5.  **前端渲染**: 前端接收 JSON 数据，更新 React 状态，动态渲染 UI。

## 6. 总结
EduPlatform 是一个完成度较高的 AI 教育 Demo，具备现代化的技术栈和优秀的设计感。其核心优势在于将 AI 能力（出题、对话）与教育场景紧密结合，并通过优雅的 UI 呈现给用户。代码结构清晰，易于扩展和维护。
