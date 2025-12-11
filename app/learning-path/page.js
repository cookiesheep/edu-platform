'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Brain, BookOpen, Clock, TrendingUp, CheckCircle,
    ArrowRight, Play, Star, Award, Calendar, Users, Lightbulb,
    BarChart, Settings, Rocket, Zap, Eye, Filter, Search, Sparkles
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function LearningPathPage() {
    const [activeTab, setActiveTab] = useState('create');
    const [selectedGoal, setSelectedGoal] = useState('');
    const [currentLevel, setCurrentLevel] = useState('');
    const [timeCommitment, setTimeCommitment] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPath, setGeneratedPath] = useState(null);
    const [myPaths, setMyPaths] = useState([]);

    // 学习目标选项
    const learningGoals = [
        {
            id: 'programming',
            title: '掌握编程技能',
            description: '从零基础到能够独立开发项目',
            icon: <Brain className="w-6 h-6" />,
            estimatedTime: '6-12个月',
            difficulty: '中等',
            subjects: ['Python', 'JavaScript', '数据结构', '算法']
        },
        {
            id: 'data-science',
            title: '数据科学入门',
            description: '学会数据分析、机器学习和可视化',
            icon: <BarChart className="w-6 h-6" />,
            estimatedTime: '4-8个月',
            difficulty: '进阶',
            subjects: ['统计学', 'Python', '机器学习', '数据可视化']
        },
        {
            id: 'math-advanced',
            title: '高等数学精通',
            description: '深入掌握微积分、线性代数等核心数学知识',
            icon: <Target className="w-6 h-6" />,
            estimatedTime: '8-12个月',
            difficulty: '高级',
            subjects: ['微积分', '线性代数', '概率论', '数理统计']
        },
        {
            id: 'web-development',
            title: '全栈Web开发',
            description: '前端后端全面掌握，能够构建完整应用',
            icon: <Rocket className="w-6 h-6" />,
            estimatedTime: '6-10个月',
            difficulty: '进阶',
            subjects: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', '数据库']
        },
        {
            id: 'ai-ml',
            title: '人工智能专家',
            description: '深度学习、神经网络、AI应用开发',
            icon: <Zap className="w-6 h-6" />,
            estimatedTime: '10-18个月',
            difficulty: '高级',
            subjects: ['机器学习', '深度学习', 'TensorFlow', 'PyTorch', 'NLP']
        },
        {
            id: 'physics-fundamentals',
            title: '物理学基础',
            description: '从经典力学到现代物理的系统学习',
            icon: <Lightbulb className="w-6 h-6" />,
            estimatedTime: '6-12个月',
            difficulty: '中等',
            subjects: ['力学', '电磁学', '热力学', '量子物理']
        }
    ];

    // 当前水平选项
    const levelOptions = [
        { value: 'beginner', label: '初学者', description: '完全没有相关经验' },
        { value: 'basic', label: '基础水平', description: '有一些了解但不深入' },
        { value: 'intermediate', label: '中级水平', description: '有一定基础，能处理常见问题' },
        { value: 'advanced', label: '高级水平', description: '已经有丰富经验，想要进一步提升' }
    ];

    // 时间投入选项
    const timeOptions = [
        { value: '1-2h', label: '1-2小时/天', description: '适合兼职学习' },
        { value: '3-4h', label: '3-4小时/天', description: '标准学习强度' },
        { value: '5-6h', label: '5-6小时/天', description: '高强度学习' },
        { value: '7h+', label: '7小时以上/天', description: '全职学习' }
    ];

    // 模拟已有的学习路径
    useEffect(() => {
        const mockPaths = [
            {
                id: 1,
                title: 'Python数据科学之路',
                progress: 65,
                totalSteps: 12,
                completedSteps: 8,
                estimatedCompletion: '2024-04-15',
                category: 'data-science',
                difficulty: '进阶',
                nextTask: 'Pandas数据处理实战',
                isActive: true
            },
            {
                id: 2,
                title: 'Web前端开发路径',
                progress: 30,
                totalSteps: 15,
                completedSteps: 4,
                estimatedCompletion: '2024-06-20',
                category: 'web-development',
                difficulty: '中等',
                nextTask: 'React组件开发',
                isActive: false
            }
        ];
        setMyPaths(mockPaths);
    }, []);

    // 生成学习路径
    const handleGeneratePath = async () => {
        if (!selectedGoal || !currentLevel || !timeCommitment) {
            alert('请填写完整的学习信息');
            return;
        }

        setIsGenerating(true);

        // 模拟AI生成过程
        setTimeout(() => {
            const goal = learningGoals.find(g => g.id === selectedGoal);
            const mockPath = {
                id: Date.now(),
                title: `个性化${goal.title}路径`,
                description: goal.description,
                totalWeeks: 24,
                estimatedHours: 150,
                difficulty: goal.difficulty,
                phases: [
                    {
                        title: '基础阶段',
                        duration: '4-6周',
                        topics: ['基础概念理解', '工具环境搭建', '入门实践'],
                        milestone: '完成第一个简单项目'
                    },
                    {
                        title: '进阶阶段',
                        duration: '8-10周',
                        topics: ['核心技能掌握', '复杂问题解决', '项目实战'],
                        milestone: '独立完成中等复杂度项目'
                    },
                    {
                        title: '精通阶段',
                        duration: '6-8周',
                        topics: ['高级特性运用', '性能优化', '最佳实践'],
                        milestone: '能够指导他人并解决复杂问题'
                    },
                    {
                        title: '专家阶段',
                        duration: '4-6周',
                        topics: ['前沿技术探索', '创新应用', '知识分享'],
                        milestone: '成为该领域的专家'
                    }
                ],
                weeklyPlan: [
                    { week: 1, focus: '基础概念学习', timeRequired: '6小时', tasks: 3 },
                    { week: 2, focus: '实践环境搭建', timeRequired: '8小时', tasks: 4 },
                    { week: 3, focus: '第一个项目', timeRequired: '10小时', tasks: 5 },
                    // ... 更多周计划
                ],
                recommendedResources: [
                    { type: 'course', title: goal.subjects[0] + '基础课程', platform: 'EduPlatform' },
                    { type: 'book', title: goal.subjects[1] + '权威指南', author: '专家推荐' },
                    { type: 'practice', title: '实战项目练习', description: '动手实践' }
                ]
            };

            setGeneratedPath(mockPath);
            setIsGenerating(false);
        }, 3000);
    };

    // 学习目标卡片
    const GoalCard = ({ goal, isSelected, onClick }) => (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 group ${isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'border-white/10 bg-[#0f172a]/50 hover:border-cyan-500/50 hover:bg-[#0f172a]/80'
                }`}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-cyan-500 text-white' : 'bg-white/5 text-cyan-400 group-hover:bg-cyan-500/20'
                    }`}>
                    {goal.icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {goal.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{goal.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {goal.subjects.slice(0, 3).map((subject, idx) => (
                            <span key={idx} className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded border border-white/5">
                                {subject}
                            </span>
                        ))}
                        {goal.subjects.length > 3 && (
                            <span className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded border border-white/5">
                                +{goal.subjects.length - 3}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {goal.estimatedTime}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${goal.difficulty === '简单' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                goal.difficulty === '中等' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                    goal.difficulty === '进阶' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {goal.difficulty}
                        </span>
                    </div>
                </div>
            </div>
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50"
                >
                    <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </motion.div>
    );

    // 路径进度卡片
    const PathProgressCard = ({ path }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{path.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${path.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${path.isActive ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                        {path.isActive ? '进行中' : '已暂停'}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-400">{path.progress}%</div>
                    <div className="text-xs text-slate-500 mt-1">完成度</div>
                </div>
            </div>

            {/* 进度条 */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">学习进度</span>
                    <span className="text-xs text-slate-400">{path.completedSteps}/{path.totalSteps} 步骤</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    />
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-xs text-slate-400">下一个任务</span>
                    <span className="text-sm font-medium text-white">{path.nextTask}</span>
                </div>
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-slate-500">预计完成</span>
                    <span className="text-xs text-slate-400">{path.estimatedCompletion}</span>
                </div>
            </div>

            <div className="flex space-x-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 px-4 rounded-xl font-medium hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                >
                    {path.isActive ? '继续学习' : '重启路径'}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                    <Eye className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.div>
    );

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#020617] pt-20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

                {/* 页面头部 */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-[#020617] to-[#020617] pointer-events-none" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full glass-panel mb-6 border border-cyan-500/30">
                                <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                                <span className="text-cyan-100 text-sm font-medium tracking-wide">AI 驱动</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                                智能学习 <span className="text-gradient-primary">路径规划</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                                AI 为您量身定制学习计划，科学规划学习路径，让每一步都更有价值。
                            </p>

                            {/* 特色功能展示 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                                        <Target className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">目标导向</h3>
                                    <p className="text-sm text-slate-400">基于学习目标智能制定路径</p>
                                </div>
                                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                        <TrendingUp className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">进度追踪</h3>
                                    <p className="text-sm text-slate-400">实时监控学习进展和效果</p>
                                </div>
                                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                                        <Settings className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">动态调整</h3>
                                    <p className="text-sm text-slate-400">根据表现自动优化路径</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 主要内容区域 */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* 标签页导航 */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-[#0f172a]/50 p-1 rounded-xl border border-white/10 inline-flex">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'create'
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                创建路径
                            </button>
                            <button
                                onClick={() => setActiveTab('my-paths')}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'my-paths'
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                我的路径 ({myPaths.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('explore')}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'explore'
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                探索路径
                            </button>
                        </div>
                    </div>

                    {/* 标签页内容 */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'create' && (
                            <motion.div
                                key="create"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {!generatedPath ? (
                                    <div className="space-y-12">
                                        {/* 步骤1：选择学习目标 */}
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                                                <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm mr-3 border border-cyan-500/30">1</span>
                                                选择您的学习目标
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {learningGoals.map((goal) => (
                                                    <GoalCard
                                                        key={goal.id}
                                                        goal={goal}
                                                        isSelected={selectedGoal === goal.id}
                                                        onClick={() => setSelectedGoal(goal.id)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* 步骤2：当前水平 */}
                                        {selectedGoal && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                                                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm mr-3 border border-cyan-500/30">2</span>
                                                    评估您的当前水平
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {levelOptions.map((level) => (
                                                        <motion.div
                                                            key={level.value}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setCurrentLevel(level.value)}
                                                            className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${currentLevel === level.value
                                                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                                                    : 'border-white/10 bg-[#0f172a]/50 hover:border-cyan-500/30 hover:bg-[#0f172a]/80'
                                                                }`}
                                                        >
                                                            <h3 className={`font-bold text-lg mb-2 ${currentLevel === level.value ? 'text-white' : 'text-slate-200'}`}>
                                                                {level.label}
                                                            </h3>
                                                            <p className="text-slate-400 text-sm">{level.description}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* 步骤3：时间投入 */}
                                        {currentLevel && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                                                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm mr-3 border border-cyan-500/30">3</span>
                                                    设定学习时间投入
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {timeOptions.map((time) => (
                                                        <motion.div
                                                            key={time.value}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setTimeCommitment(time.value)}
                                                            className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${timeCommitment === time.value
                                                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                                                    : 'border-white/10 bg-[#0f172a]/50 hover:border-cyan-500/30 hover:bg-[#0f172a]/80'
                                                                }`}
                                                        >
                                                            <h3 className={`font-bold text-lg mb-2 ${timeCommitment === time.value ? 'text-white' : 'text-slate-200'}`}>
                                                                {time.label}
                                                            </h3>
                                                            <p className="text-slate-400 text-sm">{time.description}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* 生成按钮 */}
                                        {timeCommitment && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-center py-8"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleGeneratePath}
                                                    disabled={isGenerating}
                                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isGenerating ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            AI 正在生成您的专属学习路径...
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <Rocket className="w-6 h-6 mr-3" />
                                                            生成智能学习路径
                                                        </div>
                                                    )}
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    // 生成的路径显示
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="space-y-8"
                                    >
                                        <div className="glass-panel rounded-2xl p-8 border border-white/10">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-3xl font-bold text-white">{generatedPath.title}</h2>
                                                <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                                                    AI 定制规划
                                                </div>
                                            </div>
                                            <p className="text-slate-300 mb-8 text-lg leading-relaxed">{generatedPath.description}</p>

                                            {/* 路径概览 */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                                <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                                    <div className="text-3xl font-bold text-blue-400 mb-1">{generatedPath.totalWeeks}</div>
                                                    <div className="text-sm text-blue-300/70">预计周数</div>
                                                </div>
                                                <div className="text-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                    <div className="text-3xl font-bold text-emerald-400 mb-1">{generatedPath.estimatedHours}</div>
                                                    <div className="text-sm text-emerald-300/70">总学习时长</div>
                                                </div>
                                                <div className="text-center p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                                    <div className="text-3xl font-bold text-purple-400 mb-1">{generatedPath.difficulty}</div>
                                                    <div className="text-sm text-purple-300/70">难度等级</div>
                                                </div>
                                            </div>

                                            {/* 学习阶段 */}
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                                <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                                                学习阶段规划
                                            </h3>
                                            <div className="space-y-4 mb-10">
                                                {generatedPath.phases.map((phase, index) => (
                                                    <div key={index} className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="font-bold text-lg text-white flex items-center">
                                                                <span className="w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center mr-3 text-slate-300">{index + 1}</span>
                                                                {phase.title}
                                                            </h4>
                                                            <span className="text-sm text-cyan-400 font-medium bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{phase.duration}</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h5 className="font-medium text-slate-300 mb-3 text-sm uppercase tracking-wider">学习要点</h5>
                                                                <ul className="text-sm text-slate-400 space-y-2">
                                                                    {phase.topics.map((topic, idx) => (
                                                                        <li key={idx} className="flex items-center">
                                                                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                                                            {topic}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h5 className="font-medium text-slate-300 mb-3 text-sm uppercase tracking-wider">阶段目标</h5>
                                                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-sm text-slate-300 flex items-start">
                                                                    <Award className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
                                                                    {phase.milestone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 操作按钮 */}
                                            <div className="flex space-x-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                                                >
                                                    开始学习路径
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setGeneratedPath(null)}
                                                    className="px-8 py-4 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    重新生成
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'my-paths' && (
                            <motion.div
                                key="my-paths"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">我的学习路径</h2>
                                    <p className="text-slate-400">管理和追踪您的学习进度</p>
                                </div>

                                {myPaths.length === 0 ? (
                                    <div className="text-center py-20 glass-panel rounded-2xl border border-white/10">
                                        <Target className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                                        <h3 className="text-xl font-bold text-white mb-2">还没有学习路径</h3>
                                        <p className="text-slate-400 mb-8">创建您的第一个个性化学习路径</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab('create')}
                                            className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
                                        >
                                            创建学习路径
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {myPaths.map((path, index) => (
                                            <PathProgressCard key={path.id} path={path} />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'explore' && (
                            <motion.div
                                key="explore"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">探索热门学习路径</h2>
                                    <p className="text-slate-400">发现其他学习者喜爱的学习路径</p>
                                </div>

                                {/* 热门路径展示 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {learningGoals.map((goal, index) => (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1"
                                        >
                                            <div className="flex items-center mb-6">
                                                <div className="p-3 bg-blue-500/10 rounded-xl mr-4 group-hover:bg-blue-500/20 transition-colors">
                                                    <div className="text-blue-400">
                                                        {goal.icon}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{goal.title}</h3>
                                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                                        <Users className="w-3 h-3 mr-1" />
                                                        {Math.floor(Math.random() * 5000) + 1000} 学习者
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-slate-400 text-sm mb-6 leading-relaxed h-10 line-clamp-2">{goal.description}</p>

                                            <div className="flex items-center justify-between mb-6 pt-4 border-t border-white/5">
                                                <span className="flex items-center text-xs text-slate-500">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {goal.estimatedTime}
                                                </span>
                                                <span className="flex items-center text-xs text-yellow-500">
                                                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                                                    4.{Math.floor(Math.random() * 3) + 7}
                                                </span>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-white/5 text-slate-300 py-2.5 px-4 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                            >
                                                查看详情
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </MainLayout>
    );
}