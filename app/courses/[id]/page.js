'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Play, Clock, Users, Star, BookOpen, Award, TrendingUp, 
    Shield, User, Heart, Share2, Download, CheckCircle,
    ChevronRight, ArrowLeft, Calendar, Globe, Trophy, ExternalLink
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function CoursePage() {
    const params = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        // 模拟课程数据 - 更详细的信息
        const courseData = {
            1: {
                id: 1,
                title: '2024年Python零基础入门到精通教程',
                instructor: '黑马程序员',
                platform: 'B站',
                university: '传智教育',
                rating: 4.9,
                studentsEnrolled: 125600,
                duration: '52小时',
                lessons: 156,
                price: 0,
                level: '初级',
                category: 'programming',
                tags: ['Python', '零基础', '实战项目', '爬虫'],
                description: '从Python基础语法到项目实战，包含网络爬虫、数据分析等实用技能，适合零基础学员学习。',
                fullDescription: `本课程是2024年最新版Python零基础入门到精通的完整教程，由黑马程序员团队精心制作。课程从Python基础语法开始，逐步深入到面向对象编程、文件处理、异常处理等核心知识点。

特别亮点：
• 包含5个大型实战项目：网络爬虫、数据分析、Web开发、自动化办公、机器学习入门
• 提供完整的项目源码和数据集
• 24小时内答疑响应
• 配套练习题和阶段测试
• 就业指导和简历优化建议

适合人群：
- 编程零基础的初学者
- 想要转行IT行业的人员  
- 在校大学生
- 需要Python技能的工作人员`,
                url: 'https://www.bilibili.com/video/BV1qW4y1a7fU',
                completionRate: 92,
                lastUpdated: '2024-01-15',
                features: ['提供源码', '答疑服务', '实战项目', '就业指导'],
                requirements: ['无需编程基础', '有电脑和网络即可', '愿意投入时间学习'],
                outcomes: ['掌握Python核心语法', '能够编写实用程序', '具备爬虫开发能力', '了解数据分析基础', '获得项目开发经验'],
                chapters: [
                    { id: 1, title: 'Python环境安装与配置', duration: '45分钟', completed: false, free: true },
                    { id: 2, title: 'Python基础语法', duration: '2小时30分钟', completed: false, free: true },
                    { id: 3, title: '数据类型与变量', duration: '3小时15分钟', completed: false, free: false },
                    { id: 4, title: '条件语句与循环', duration: '2小时45分钟', completed: false, free: false },
                    { id: 5, title: '函数与模块', duration: '4小时', completed: false, free: false },
                    { id: 6, title: '面向对象编程', duration: '5小时20分钟', completed: false, free: false },
                    { id: 7, title: '文件操作与异常处理', duration: '3小时10分钟', completed: false, free: false },
                    { id: 8, title: '网络爬虫项目实战', duration: '8小时30分钟', completed: false, free: false },
                    { id: 9, title: '数据分析项目实战', duration: '6小时45分钟', completed: false, free: false },
                    { id: 10, title: 'Web开发项目实战', duration: '10小时20分钟', completed: false, free: false }
                ],
                reviews: [
                    {
                        id: 1,
                        user: '小明同学',
                        avatar: '/api/placeholder/40/40',
                        rating: 5,
                        date: '2024-03-01',
                        content: '讲解非常详细，项目实战很有用，作为零基础学员感觉收获很大！'
                    },
                    {
                        id: 2,
                        user: '程序媛小王',
                        avatar: '/api/placeholder/40/40',
                        rating: 5,
                        date: '2024-02-28',
                        content: '老师讲得很清楚，答疑也很及时，已经成功找到Python相关工作了！'
                    },
                    {
                        id: 3,
                        user: '数据分析师李华',
                        avatar: '/api/placeholder/40/40',
                        rating: 4,
                        date: '2024-02-25',
                        content: '内容很全面，但是有些地方讲得比较快，需要反复看几遍。'
                    }
                ]
            },
            2: {
                id: 2,
                title: 'JavaScript高级程序设计与实战',
                instructor: '技术胖',
                platform: 'B站',
                university: '个人UP主',
                rating: 4.8,
                studentsEnrolled: 89300,
                duration: '42小时',
                lessons: 98,
                price: 0,
                level: '中级',
                category: 'programming',
                tags: ['JavaScript', 'ES6+', 'Vue', 'React'],
                description: 'JavaScript从基础到高级，包含最新ES6+语法、框架应用、项目实战等内容。',
                fullDescription: `本课程由知名UP主技术胖主讲，全面覆盖JavaScript从基础到高级的所有知识点。课程结合最新的ES6+语法特性，深入讲解异步编程、模块化开发、前端框架等现代JavaScript开发技术。

课程特色：
• 深入浅出的讲解方式，适合有一定基础的同学进阶
• 包含Vue3和React18最新特性
• 10个实战项目涵盖各种应用场景
• 源码详细注释，便于理解
• 技术交流群活跃，学习氛围好

实战项目：
- 仿京东商城前端
- Vue3管理后台系统
- React Native移动应用
- 微信小程序开发
- Node.js全栈应用`,
                url: 'https://www.bilibili.com/video/BV1Kt411w7MP',
                completionRate: 87,
                lastUpdated: '2024-02-10',
                features: ['视频高清', '项目实战', '技术答疑', '学习群'],
                requirements: ['具备HTML/CSS基础', '了解JavaScript基本语法', '有简单编程经验'],
                outcomes: ['精通ES6+新特性', '掌握异步编程', '熟练使用Vue/React', '具备全栈开发能力', '完成企业级项目'],
                chapters: [
                    { id: 1, title: 'ES6+新特性深入解析', duration: '3小时', completed: false, free: true },
                    { id: 2, title: '异步编程与Promise', duration: '2小时30分钟', completed: false, free: true },
                    { id: 3, title: '模块化开发详解', duration: '2小时', completed: false, free: false },
                    { id: 4, title: 'Vue3框架核心概念', duration: '4小时15分钟', completed: false, free: false },
                    { id: 5, title: 'React18新特性详解', duration: '3小时45分钟', completed: false, free: false }
                ],
                reviews: [
                    {
                        id: 1,
                        user: '前端小白',
                        avatar: '/api/placeholder/40/40',
                        rating: 5,
                        date: '2024-03-02',
                        content: '技术胖老师讲得太好了，Vue和React都学会了！'
                    }
                ]
            },
            3: {
                id: 3,
                title: '大学物理 - 力学与电磁学',
                description: '中科院物理所专家团队制作，包含丰富的物理实验视频和3D动画演示，让抽象概念变得生动',
                longDescription: '由中科院物理所张建国研究员领衔的专家团队精心制作，课程内容覆盖经典力学和电磁学的核心内容。通过大量的实验视频、3D动画和仿真演示，将抽象的物理概念具象化，帮助学生深入理解物理现象的本质和规律。',
                imageUrl: '/course-physics.jpg',
                videoUrl: 'https://example.com/video3',
                level: '大一必修',
                subject: '物理',
                chapters: 28,
                totalTime: '42小时',
                studentsEnrolled: 12580,
                rating: 4.7,
                instructor: '张建国研究员',
                university: '中科院',
                price: 0,
                tags: ['力学', '电磁学', '实验物理'],
                difficulty: '中等',
                completionRate: 82,
                lastUpdated: '2024-01-20',
                prerequisites: ['高中物理基础', '基础数学知识'],
                objectives: [
                    '理解牛顿力学的基本原理',
                    '掌握电磁学的核心概念',
                    '具备物理实验设计能力',
                    '培养科学思维和分析方法'
                ],
                syllabus: [
                    { title: '质点运动学', duration: '3小时', lessons: 8, preview: true },
                    { title: '牛顿运动定律', duration: '4小时', lessons: 10, preview: false },
                    { title: '动量和能量', duration: '3.5小时', lessons: 9, preview: false },
                    { title: '刚体力学', duration: '4小时', lessons: 11, preview: false },
                    { title: '振动与波动', duration: '3小时', lessons: 8, preview: false },
                    { title: '电场与电势', duration: '4.5小时', lessons: 12, preview: false },
                    { title: '磁场与电磁感应', duration: '5小时', lessons: 13, preview: false },
                    { title: '电磁波', duration: '3小时', lessons: 7, preview: false }
                ],
                reviews: [
                    { name: '孙八', rating: 5, comment: '实验视频太棒了！让我真正理解了物理概念。', date: '2024-01-15' },
                    { name: '周九', rating: 4, comment: '3D动画很有帮助，复杂的概念变得容易理解。', date: '2024-01-12' }
                ]
            }
        };

        const courseId = parseInt(params.id);
        if (courseData[courseId]) {
            setCourse(courseData[courseId]);
        }
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">加载课程信息中...</p>
                </div>
                </div>
            </MainLayout>
        );
    }

    if (!course) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">课程未找到</h1>
                        <Link href="/courses" className="text-blue-600 hover:text-blue-800">
                            返回课程列表
                        </Link>
                </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                {/* 返回按钮 */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <Link 
                            href="/courses" 
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回课程列表
                </Link>
            </div>
                    </div>

                {/* 课程头部信息 */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* 左侧：课程信息 */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* 平台标识 */}
                                <div className="flex items-center mb-4">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mr-3">
                                        {course.platform}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        course.level === '初级' ? 'bg-green-500/80' :
                                        course.level === '中级' ? 'bg-yellow-500/80' :
                                        'bg-red-500/80'
                                    }`}>
                                        {course.level}
                                    </span>
                                    {course.price === 0 && (
                                        <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium ml-3">
                                            免费
                                    </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                    {course.title}
                                </h1>
                                
                                <p className="text-xl opacity-90 mb-6">
                                    {course.description}
                                </p>

                                {/* 讲师信息 */}
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                                        <User className="w-6 h-6" />
                            </div>
                                    <div>
                                        <div className="font-semibold text-lg">{course.instructor}</div>
                                        <div className="opacity-75">{course.university}</div>
                        </div>
                                </div>

                                {/* 课程统计 */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                            <span className="text-2xl font-bold">{course.rating}</span>
                                        </div>
                                        <div className="text-sm opacity-75">课程评分</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <Users className="w-5 h-5 mr-1" />
                                            <span className="text-2xl font-bold">{(course.studentsEnrolled / 1000).toFixed(0)}K</span>
                                        </div>
                                        <div className="text-sm opacity-75">学习人数</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <Clock className="w-5 h-5 mr-1" />
                                            <span className="text-2xl font-bold">{course.duration}</span>
                                        </div>
                                        <div className="text-sm opacity-75">课程时长</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <BookOpen className="w-5 h-5 mr-1" />
                                            <span className="text-2xl font-bold">{course.lessons}</span>
                            </div>
                                        <div className="text-sm opacity-75">课程节数</div>
                    </div>
                </div>

                                {/* 标签 */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {course.tags.map((tag, index) => (
                                        <span key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
            </div>

                                {/* 行动按钮 */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.a
                                        href={course.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        前往{course.platform}学习
                                    </motion.a>
                                    <motion.button
                                        className="px-6 py-4 border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Heart className="w-5 h-5 mr-2" />
                                        收藏课程
                                    </motion.button>
                                    <motion.button
                                        className="px-6 py-4 border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Share2 className="w-5 h-5 mr-2" />
                                        分享
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* 右侧：视频预览 */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="aspect-video bg-gradient-to-br from-blue-800 to-purple-900 rounded-xl shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <motion.button
                                            className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => window.open(course.url, '_blank')}
                                        >
                                            <Play className="w-8 h-8 text-blue-600 ml-1" />
                                        </motion.button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                                            <div className="flex justify-between items-center text-white text-sm">
                                                <span>第1节：{course.chapters[0]?.title}</span>
                                                <span>{course.chapters[0]?.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 课程详细内容 */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* 主要内容区 */}
                        <div className="lg:col-span-2">
                            {/* 标签页导航 */}
                            <div className="flex border-b border-gray-200 mb-6">
                                {[
                                    { key: 'overview', label: '课程概述' },
                                    { key: 'syllabus', label: '课程大纲' },
                                    { key: 'reviews', label: '学员评价' }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-6 py-3 font-medium transition-colors ${
                                            activeTab === tab.key
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* 标签页内容 */}
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">课程介绍</h3>
                                            <p className="text-gray-700 leading-relaxed">{course.fullDescription}</p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">学习目标</h3>
                                            <ul className="space-y-2">
                                                {course.outcomes.map((objective, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{objective}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">课程标签</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {course.tags.map((tag, index) => (
                                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'syllabus' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold mb-4">课程大纲</h3>
                                        {course.chapters.map((chapter, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-lg">{chapter.title}</h4>
                                                    {chapter.free && (
                                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                            免费预览
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                    <span className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {chapter.duration}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <BookOpen className="w-4 h-4 mr-1" />
                                                        {chapter.lessons}节课
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold">学员评价</h3>
                                            <div className="flex items-center">
                                                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                                                <span className="font-semibold mr-2">{course.rating}</span>
                                                <span className="text-gray-600">({course.reviews.length} 条评价)</span>
                                            </div>
                                        </div>
                                        
                                        {course.reviews.map((review, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white rounded-lg border border-gray-200 p-6"
                                            >
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                        <User className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{review.user}</div>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star 
                                                                    key={i} 
                                                                    className={`w-4 h-4 ${
                                                                        i < review.rating 
                                                                            ? 'text-yellow-500 fill-current' 
                                                                            : 'text-gray-300'
                                                                    }`} 
                                                                />
                                                            ))}
                                                            <span className="text-sm text-gray-600 ml-2">{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{review.content}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* 侧边栏 */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                                <h4 className="font-bold mb-4">课程信息</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">难度等级:</span>
                                        <span className="font-medium">{course.difficulty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">更新时间:</span>
                                        <span className="font-medium">{course.lastUpdated}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">章节数量:</span>
                                        <span className="font-medium">{course.chapters.length}章</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">学习时长:</span>
                                        <span className="font-medium">{course.duration}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-bold mb-4">前置知识</h4>
                                    <ul className="space-y-2 text-sm">
                                        {course.requirements.map((prereq, index) => (
                                            <li key={index} className="flex items-start">
                                                <ChevronRight className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                                <span className="text-gray-700">{prereq}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                    </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}