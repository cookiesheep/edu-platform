'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Target, Brain, BookOpen, Clock, TrendingUp, CheckCircle, 
    ArrowRight, Play, Star, Award, Calendar, Users, Lightbulb,
    BarChart, Settings, Rocket, Zap, Eye, Filter, Search
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {goal.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                    <p className="text-gray-600 mb-4">{goal.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {goal.subjects.slice(0, 3).map((subject, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {subject}
                            </span>
                        ))}
                        {goal.subjects.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{goal.subjects.length - 3}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {goal.estimatedTime}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                            goal.difficulty === '简单' ? 'bg-green-100 text-green-800' :
                            goal.difficulty === '中等' ? 'bg-yellow-100 text-yellow-800' :
                            goal.difficulty === '进阶' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
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
                    className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
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
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{path.title}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        path.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {path.isActive ? '进行中' : '已暂停'}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{path.progress}%</div>
                    <div className="text-sm text-gray-500">完成度</div>
                </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">学习进度</span>
                    <span className="text-sm text-gray-500">{path.completedSteps}/{path.totalSteps} 步骤</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">下一个任务:</span>
                    <span className="text-sm font-medium text-gray-900">{path.nextTask}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">预计完成:</span>
                    <span className="text-sm text-gray-700">{path.estimatedCompletion}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">难度等级:</span>
                    <span className="text-sm text-gray-700">{path.difficulty}</span>
                </div>
            </div>

            <div className="mt-6 flex space-x-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                    {path.isActive ? '继续学习' : '重启路径'}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                {/* 页面头部 */}
                <section className="bg-gradient-to-br from-purple-600 to-blue-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                🎯 智能学习路径规划
                            </h1>
                            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                                AI为您量身定制学习计划，科学规划学习路径，让每一步都更有价值
                            </p>
                            
                            {/* 特色功能展示 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold mb-2">目标导向</h3>
                                    <p className="text-sm opacity-80">基于学习目标智能制定路径</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold mb-2">进度追踪</h3>
                                    <p className="text-sm opacity-80">实时监控学习进展和效果</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Settings className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold mb-2">动态调整</h3>
                                    <p className="text-sm opacity-80">根据表现自动优化路径</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 主要内容区域 */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 标签页导航 */}
                    <div className="flex border-b border-gray-200 mb-8">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`px-6 py-3 font-medium transition-colors ${
                                activeTab === 'create'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            创建路径
                        </button>
                        <button
                            onClick={() => setActiveTab('my-paths')}
                            className={`px-6 py-3 font-medium transition-colors ${
                                activeTab === 'my-paths'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            我的路径 ({myPaths.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`px-6 py-3 font-medium transition-colors ${
                                activeTab === 'explore'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            探索路径
                        </button>
                    </div>

                    {/* 标签页内容 */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'create' && (
                            <motion.div
                                key="create"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {!generatedPath ? (
                                    <div className="space-y-8">
                                        {/* 步骤1：选择学习目标 */}
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                步骤1: 选择您的学习目标
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
                                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                    步骤2: 评估您的当前水平
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {levelOptions.map((level) => (
                                                        <motion.div
                                                            key={level.value}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setCurrentLevel(level.value)}
                                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                                currentLevel === level.value
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                                            }`}
                                                        >
                                                            <h3 className="font-bold text-lg mb-2">{level.label}</h3>
                                                            <p className="text-gray-600">{level.description}</p>
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
                                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                    步骤3: 设定学习时间投入
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {timeOptions.map((time) => (
                                                        <motion.div
                                                            key={time.value}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setTimeCommitment(time.value)}
                                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                                timeCommitment === time.value
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                                            }`}
                                                        >
                                                            <h3 className="font-bold text-lg mb-2">{time.label}</h3>
                                                            <p className="text-gray-600">{time.description}</p>
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
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    {isGenerating ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            AI正在生成您的专属学习路径...
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <Rocket className="w-5 h-5 mr-2" />
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
                                        <div className="bg-white rounded-xl shadow-lg p-8">
                                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{generatedPath.title}</h2>
                                            <p className="text-gray-600 mb-6">{generatedPath.description}</p>
                                            
                                            {/* 路径概览 */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{generatedPath.totalWeeks}</div>
                                                    <div className="text-sm text-gray-600">预计周数</div>
                                                </div>
                                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{generatedPath.estimatedHours}</div>
                                                    <div className="text-sm text-gray-600">总学习时长</div>
                                                </div>
                                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-purple-600">{generatedPath.difficulty}</div>
                                                    <div className="text-sm text-gray-600">难度等级</div>
                                                </div>
                                            </div>

                                            {/* 学习阶段 */}
                                            <h3 className="text-xl font-bold mb-4">学习阶段规划</h3>
                                            <div className="space-y-4 mb-8">
                                                {generatedPath.phases.map((phase, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-bold text-lg">{phase.title}</h4>
                                                            <span className="text-sm text-gray-500">{phase.duration}</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h5 className="font-medium mb-2">学习要点:</h5>
                                                                <ul className="text-sm text-gray-600 space-y-1">
                                                                    {phase.topics.map((topic, idx) => (
                                                                        <li key={idx} className="flex items-center">
                                                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                                            {topic}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h5 className="font-medium mb-2">阶段目标:</h5>
                                                                <p className="text-sm text-gray-600">{phase.milestone}</p>
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
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
                                                >
                                                    开始学习路径
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setGeneratedPath(null)}
                                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">我的学习路径</h2>
                                    <p className="text-gray-600">管理和追踪您的学习进度</p>
                                </div>

                                {myPaths.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有学习路径</h3>
                                        <p className="text-gray-500 mb-6">创建您的第一个个性化学习路径</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab('create')}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">探索热门学习路径</h2>
                                    <p className="text-gray-600">发现其他学习者喜爱的学习路径</p>
                                </div>

                                {/* 热门路径展示 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {learningGoals.map((goal, index) => (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                                    {goal.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{goal.title}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {Math.floor(Math.random() * 5000) + 1000} 学习者
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4">{goal.description}</p>
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="flex items-center text-sm text-gray-500">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {goal.estimatedTime}
                                                </span>
                                                <span className="flex items-center text-sm text-yellow-600">
                                                    <Star className="w-4 h-4 mr-1" />
                                                    4.{Math.floor(Math.random() * 3) + 7}
                                                </span>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
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