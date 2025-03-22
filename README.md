# EduPlatform - AI驱动的智能教育平台

EduPlatform是一个结合AI技术的现代教育平台，旨在为学生提供个性化学习体验。平台通过AI模型提供智能题目生成、学习路径规划和成绩评估功能，帮助学生更高效地学习。

## 功能亮点

- 🧠 **AI学习助手**: 实时解答学习问题，提供学习建议
- 📊 **个性化学习分析**: 基于学习数据生成详细的成绩报告和改进建议
- 🗺️ **智能学习路径**: 根据学习目标和当前水平生成个性化学习计划
- 📝 **智能试题生成**: 自动生成符合学生能力水平的练习题
- 📚 **丰富的课程资源**: 多学科、多层次的系统化学习内容
- 📱 **响应式设计**: 适配各种设备，随时随地学习

## 技术栈

### 前端

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + Framer Motion
- **状态管理**: React Hooks
- **数据可视化**: Recharts
- **动画效果**: Framer Motion

### 后端

- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **API**: Next.js API Routes
- **AI集成**: FastGPT API

## 安装与运行

### 环境要求

- Node.js 18+
- npm 9+
- Supabase账户

### 安装步骤

1. 克隆仓库

```
bashCopygit clone https://github.com/your-username/edu-platform.git
cd edu-platform
```

1. 安装依赖

```
bash

Copy

npm install
```

1. 环境变量配置

创建`.env.local`文件并添加以下内容:

```
CopyNEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_KEY=你的Supabase匿名密钥
```

1. 数据库设置

在Supabase控制台中运行项目根目录下的`schema.sql`文件，创建必要的表和权限。

1. 启动开发服务器

```
bash

Copy

npm run dev
```

访问 http://localhost:3000 查看应用。

## 项目结构

```
Copyedu-platform/
├── app/                  # Next.js 应用路由
│   ├── api/              # API 路由
│   │   ├── ai-assistant/ # AI助手API
│   │   ├── assessment/   # 评估API
│   │   ├── learning-path/# 学习路径API
│   │   └── questions/    # 试题API
│   ├── dashboard/        # 仪表板页面
│   ├── courses/          # 课程页面
│   ├── practice/         # 练习页面
│   ├── analytics/        # 分析页面
│   ├── profile/          # 用户资料页面
│   └── ...
├── components/           # React组件
│   ├── layout/           # 布局组件
│   │   └── MainLayout.js # 主布局
│   └── ui/               # UI组件
│       ├── AIAssistant.js# AI助手组件
│       └── ...
├── lib/                  # 工具函数和API客户端 
│   ├── fastgptClient.js  # FastGPT API客户端
│   ├── supabaseClient.js # Supabase客户端
│   └── ...
├── public/               # 静态资源
└── ...
```

## 数据库模型

EduPlatform使用Supabase作为后端数据库，主要包含以下表结构：

- **courses**: 课程信息表
- **course_chapters**: 课程章节表
- **profiles**: 用户资料表
- **user_progress**: 用户学习进度表
- **quiz_attempts**: 用户测验记录表
- **assessment_results**: 成绩评估结果表
- **learning_paths**: 学习路径表
- **ai_chat_history**: AI聊天历史记录表

详细的表结构和字段信息请参考`schema.sql`文件。

## AI模型集成

本项目集成了三个FastGPT模型，通过API进行调用：

1. **成绩评估模型** (Assessment)
   - 分析学生的学习数据，生成详细的评估报告
   - 提供优势和弱点分析，给出改进建议
   - 模型ID: `jo87glkagm0bjuu3a8a9fscf`
   - 访问链接: [成绩评估模型](https://cloud.fastgpt.cn/chat/share?shareId=jo87glkagm0bjuu3a8a9fscf)

2. **学习路径模型** (Learning Path)
   - 根据学生目标和当前水平，生成个性化学习计划
   - 提供时间规划和学习资源推荐
   - 模型ID: `w6v4iudnki84eer4e2dmwo37`
   - 访问链接: [学习路径推荐模型](https://cloud.fastgpt.cn/chat/share?shareId=w6v4iudnki84eer4e2dmwo37)

3. **试题生成模型** (Question Generator)
   - 生成符合学生水平的个性化练习题
   - 提供详细的解析和知识点说明
   - 模型ID: `jidvsej3g5cofla8xsm891kd`
   - 访问链接: [试题生成模型](https://cloud.fastgpt.cn/chat/share?shareId=jidvsej3g5cofla8xsm891kd)

### 模型调用流程

AI模型通过`lib/fastgptClient.js`中封装的API客户端进行调用：

1. 用户在AI助手界面输入问题
2. 系统根据选择的模型类型收集相关用户数据(如测验记录、学习进度)
3. 将用户问题和相关数据发送到FastGPT API
4. 获取AI响应并展示给用户
5. 对于已登录用户，系统会保存聊天历史记录

### AI助手使用说明

1. 点击界面右下角的AI助手按钮打开聊天窗口
2. 在顶部选择需要使用的模式(成绩评估/学习路径/试题生成)
3. 输入问题或需求，按发送按钮或回车键提交
4. 等待AI响应(通常在几秒内完成)
5. 可以继续提问或切换模式进行不同类型的交互

### 开发者说明

如需修改或扩展AI模型功能，可以通过以下步骤：

1. 在FastGPT平台上微调现有模型或创建新模型
2. 更新`lib/fastgptClient.js`中的模型ID
3. 根据需要调整`app/api/ai-assistant/route.js`中的数据收集逻辑
4. 在组件`components/ui/AIAssistant.js`中更新用户界面

## 功能说明

### AI学习助手

AI学习助手支持三种模式：

1. **成绩评估模式**: 分析学习数据，提供评估和建议
2. **学习路径模式**: 创建个性化学习计划
3. **试题生成模式**: 生成适合用户水平的练习题

用户可以在聊天界面中切换模式，与AI助手进行自然语言交流。

### 课程学习

课程学习流程：

1. 在课程列表中选择课程
2. 进入课程详情页，查看课程章节
3. 按顺序学习章节内容
4. 完成章节后进行测验
5. 系统记录学习进度和成绩

### 学习分析

学习分析功能包括：

- 学习时长统计
- 测验成绩趋势
- 知识点掌握程度
- 学科强弱分析
- 学习习惯评估

### 智能练习

智能练习系统会根据用户的学习情况和水平，生成适合的练习题，并提供即时反馈和详细解析。

## 部署说明

### Vercel部署(推荐)

1. Fork本仓库到你的GitHub账户
2. 在Vercel中导入该仓库
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_KEY`
4. 点击部署

### Docker部署

1. 构建Docker镜像

```
bash

Copy

docker build -t edu-platform .
```

1. 运行容器

```
bash

Copy

docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=xxx -e NEXT_PUBLIC_SUPABASE_KEY=xxx edu-platform
```

## 贡献指南

欢迎贡献代码或提出建议。请遵循以下步骤：

1. Fork仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 项目GitHub: https://github.com/your-username/edu-platform
- 电子邮件: [your-email@example.com](mailto:your-email@example.com)

## 更新日志

### 2024-03-21 更新

#### 修复了以下问题：

1. **AI助手现在真正调用FastGPT API**
   - 修复了之前AI助手只使用模拟响应的问题
   - 现在AI助手可以正确调用三个不同的FastGPT模型：
     - 成绩评估模型 (jo87glkagm0bjuu3a8a9fscf)
     - 学习路径推荐模型 (w6v4iudnki84eer4e2dmwo37)
     - 试题生成模型 (jidvsej3g5cofla8xsm891kd)

2. **优化了主页UI设计**
   - 改进了HeroSection部分：
     - 添加了动态波浪效果
     - 增加了浮动动画元素
     - 优化了按钮交互效果
     - 添加了标签展示核心功能
   - 优化了课程卡片设计：
     - 改进了卡片悬停效果
     - 优化了卡片布局和视觉层次
     - 增加了过渡动画
   - 整体提升了视觉一致性和现代感

#### 如何验证更新：

1. 访问主页，体验新的UI设计和动画效果
2. 打开AI助手，选择不同模型进行测试，确认是否能获取真实API响应

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```