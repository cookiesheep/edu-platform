'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    Bot, BookOpen, PieChart, Brain, Sparkles, Users, Trophy, ChevronRight,
    Zap, Star, ArrowRight, Play, CheckCircle, Award, TrendingUp,
    Globe, Lightbulb, Target, Rocket, Code, Calculator, Beaker,
    Palette, Music, Languages, Cpu, Shield, Clock, Heart, Eye, User
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

// Hero 部分组件
const HeroSection = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, -50]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
    const [particles, setParticles] = useState([]);

    // 在客户端初始化粒子位置，避免hydration错误
    useEffect(() => {
        const particleArray = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }));
        setParticles(particleArray);
    }, []);

    return (
        <motion.section 
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950"
            style={{ y, opacity }}
        >
            {/* 动态背景 */}
            <div className="absolute inset-0">
                {/* 渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
                
                {/* 浮动粒子 - 只在客户端渲染 */}
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                        }}
                    />
                ))}

                {/* 大型装饰圆形 */}
                <motion.div
                    className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                        opacity: [0.6, 0.3, 0.6],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                {/* 主标题区域 */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-8"
                >
                    <motion.div
                        className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-400 animate-pulse" />
                        <span className="text-white font-medium">🚀 全新AI学习平台</span>
                        <Star className="w-5 h-5 ml-2 text-yellow-400 animate-bounce" />
                    </motion.div>

                    <motion.h1 
                        className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                            智能学习
                        </span>
                        <br />
                        <motion.span
                            className="inline-block"
                            animate={{ 
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{
                                background: "linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6, #60A5FA)",
                                backgroundSize: "200% 200%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            新体验
                        </motion.span>
                    </motion.h1>

                    <motion.p 
                        className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        基于先进AI技术，为每位学习者提供个性化学习体验。
                        从智能试题生成到学习路径规划，开启您的智慧学习之旅。
                    </motion.p>
                </motion.div>

                {/* CTA 按钮组 */}
                <motion.div 
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link 
                            href="/quiz-generator"
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all"
                        >
                            <Brain className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                            <span>🧠 智能出题+评估</span>
                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link 
                            href="/courses"
                            className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                        >
                            <Play className="w-6 h-6 mr-3" />
                            <span>探索课程</span>
                            <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* 特色数据展示 */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    {[
                        { icon: <Users size={24} />, number: "50K+", label: "活跃学习者", color: "from-blue-400 to-cyan-400" },
                        { icon: <BookOpen size={24} />, number: "1000+", label: "精品课程", color: "from-purple-400 to-pink-400" },
                        { icon: <Trophy size={24} />, number: "98%", label: "满意度", color: "from-green-400 to-emerald-400" },
                        { icon: <Zap size={24} />, number: "24/7", label: "AI助手", color: "from-orange-400 to-red-400" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-3 group-hover:shadow-xl transition-all`}>
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {stat.icon}
                                </motion.div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* 滚动指示器 */}
            <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <motion.div 
                        className="w-1 h-3 bg-white rounded-full mt-2"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </motion.section>
    );
};

// 课程卡片组件 - 重新设计
const CourseCard = ({ course, index }) => {
  return (
      <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -8 }}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-blue-200"
        >
            {/* 课程封面和视频预览 */}
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <motion.div
                        className="text-center text-white"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Play className="w-16 h-16 mx-auto mb-3 opacity-90" />
                        <div className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                            {course.subject}
                        </div>
                    </motion.div>
                </div>
                
                {/* 播放时长和章节数 */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {course.totalTime}
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {course.chapters}章节
                </div>
                
                {/* 价格标签 */}
                <div className="absolute bottom-3 left-3">
                    {course.price === 0 ? (
                        <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                            免费
                        </span>
                    ) : (
                        <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                            ¥{course.price}
                        </span>
            )}
          </div>
            </div>

        <div className="p-6">
                {/* 课程标题和等级 */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight flex-1 mr-2">
                        {course.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full font-medium whitespace-nowrap">
            {course.level}
          </span>
          </div>

                {/* 讲师和大学 */}
                <div className="flex items-center mb-3 text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1.5 text-blue-500" />
                    <span className="font-medium">{course.instructor}</span>
                    <span className="mx-2">·</span>
                    <span>{course.university}</span>
                </div>

                {/* 课程描述 */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags?.slice(0, 3).map((tag, idx) => (
                        <span 
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* 统计数据 */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1.5 text-blue-500" />
                        <span>{course.studentsEnrolled?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1.5 text-yellow-500" />
                        <span className="font-medium">{course.rating}</span>
                    </div>
            <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1.5 text-green-500" />
                        <span>{course.completionRate}% 完成率</span>
            </div>
            <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1.5 text-purple-500" />
                        <span>{course.difficulty}</span>
            </div>
          </div>

                {/* 立即学习按钮 */}
          <Link href={`/courses/${course.id}`}>
                    <motion.button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-center">
                            <Play className="w-4 h-4 mr-2" />
                            立即学习
                        </div>
                    </motion.button>
          </Link>
        </div>
      </motion.div>
  );
};

// 特色功能卡片组件
const FeatureCard = ({ feature, index }) => {
  return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-${feature.hoverColor}-200 p-8`}
        >
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            
            <div className="relative z-10">
                <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                >
                    {feature.icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                </p>

                <Link href={feature.href}>
                    <motion.button 
                        className={`inline-flex items-center text-${feature.hoverColor}-600 hover:text-${feature.hoverColor}-700 font-semibold group-hover:translate-x-1 transition-all`}
                        whileHover={{ x: 5 }}
                    >
                        <span>了解更多</span>
                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </Link>
        </div>
        </motion.div>
    );
};

// 学科图标组件
const SubjectIcon = ({ subject, index }) => {
    const icons = {
        '数学': <Calculator className="w-8 h-8" />,
        '物理': <Zap className="w-8 h-8" />,
        '化学': <Beaker className="w-8 h-8" />,
        '编程': <Code className="w-8 h-8" />,
        '艺术': <Palette className="w-8 h-8" />,
        '音乐': <Music className="w-8 h-8" />,
        '语言': <Languages className="w-8 h-8" />,
        '科技': <Cpu className="w-8 h-8" />
    };

    const colors = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-teal-500 to-blue-500',
        'from-pink-500 to-rose-500',
        'from-amber-500 to-orange-500'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="text-center group cursor-pointer"
        >
            <div className={`w-20 h-20 bg-gradient-to-r ${colors[index % colors.length]} rounded-2xl flex items-center justify-center mb-3 mx-auto text-white shadow-lg group-hover:shadow-xl transition-all`}>
                <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                >
                    {icons[subject] || <BookOpen className="w-8 h-8" />}
                </motion.div>
      </div>
            <p className="text-gray-700 font-medium">{subject}</p>
        </motion.div>
  );
};

// 主页组件
export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
        // 使用更真实的课程数据，参考B站和慕课风格
        const mockCourses = [
      {
        id: 1,
                title: '高等数学 - 从入门到精通',
                description: '清华大学数学系王教授主讲，涵盖极限、微分、积分、级数等核心概念，配合大量实例和动画演示',
                imageUrl: '/course-math.jpg',
                videoUrl: 'https://example.com/video1',
                level: '大一必修',
        subject: '数学',
                chapters: 24,
                totalTime: '36小时',
                studentsEnrolled: 15240,
                rating: 4.9,
                instructor: '王志华教授',
                university: '清华大学',
                price: 0,
                tags: ['微积分', '高等数学', '理科基础'],
                difficulty: '中等',
                completionRate: 85,
                lastUpdated: '2024-01-15'
      },
      {
        id: 2,
                title: 'Python数据科学与机器学习',
                description: '从Python基础到机器学习实战，包含pandas、numpy、sklearn等核心库，5个实战项目',
                imageUrl: '/course-python.jpg',
                videoUrl: 'https://example.com/video2',
                level: '进阶课程',
                subject: '编程',
                chapters: 32,
                totalTime: '48小时',
                studentsEnrolled: 8965,
                rating: 4.8,
                instructor: '李明博士',
                university: '北京大学',
                price: 199,
                tags: ['Python', '机器学习', '数据科学'],
                difficulty: '进阶',
                completionRate: 78,
                lastUpdated: '2024-02-01'
      },
      {
        id: 3,
                title: '大学物理 - 力学与电磁学',
                description: '中科院物理所专家团队制作，包含丰富的物理实验视频和3D动画演示，让抽象概念变得生动',
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
                lastUpdated: '2024-01-20'
            },
            {
                id: 4,
                title: '前端开发：React + TypeScript实战',
                description: '腾讯前端专家亲授，从React基础到企业级应用开发，包含完整的电商项目实战',
                imageUrl: '/course-react.jpg',
                videoUrl: 'https://example.com/video4',
                level: '实战课程',
                subject: '前端',
                chapters: 45,
                totalTime: '60小时',
                studentsEnrolled: 6789,
                rating: 4.9,
                instructor: '陈晓明',
                university: '腾讯学院',
                price: 299,
                tags: ['React', 'TypeScript', '前端开发'],
                difficulty: '进阶',
                completionRate: 75,
                lastUpdated: '2024-02-10'
            },
            {
                id: 5,
                title: '有机化学基础',
                description: '华东理工大学化学系精品课程，系统学习有机化学反应机理和合成方法',
                imageUrl: '/course-chemistry.jpg',
                videoUrl: 'https://example.com/video5',
                level: '大二专业课',
                subject: '化学',
                chapters: 20,
                totalTime: '30小时',
                studentsEnrolled: 4567,
                rating: 4.6,
                instructor: '刘慧敏教授',
                university: '华东理工大学',
                price: 0,
                tags: ['有机化学', '化学反应', '实验技能'],
                difficulty: '中等',
                completionRate: 79,
                lastUpdated: '2024-01-08'
            },
            {
                id: 6,
                title: 'AI人工智能导论',
                description: '斯坦福CS229课程中文版，涵盖机器学习、深度学习、自然语言处理等前沿技术',
                imageUrl: '/course-ai.jpg',
                videoUrl: 'https://example.com/video6',
                level: '前沿课程',
                subject: '人工智能',
                chapters: 38,
                totalTime: '55小时',
                studentsEnrolled: 9876,
                rating: 4.9,
                instructor: 'Andrew Ng',
                university: 'Stanford',
                price: 399,
                tags: ['AI', '机器学习', '深度学习'],
                difficulty: '高级',
                completionRate: 68,
                lastUpdated: '2024-02-15'
            }
        ];
        
        // 只显示前3个课程在首页
        setFeaturedCourses(mockCourses.slice(0, 3));
  }, []);

    const features = [
        {
            icon: <Bot size={32} className="text-white" />,
            title: "AI学习助手",
            description: "24/7智能陪伴，实时解答学习疑问，提供个性化学习建议和路径规划。",
            href: "/ai-assistant",
            gradient: "from-blue-500 to-indigo-600",
            hoverColor: "blue"
        },
        {
            icon: <Brain size={32} className="text-white" />,
            title: "智能试题生成",
            description: "AI自动生成个性化试题，支持在线答题、智能批改和学习者评估分析。",
            href: "/quiz-generator",
            gradient: "from-emerald-500 to-teal-600",
            hoverColor: "emerald"
        },
        {
            icon: <BookOpen size={32} className="text-white" />,
            title: "个性化学习内容",
            description: "根据学习者特征和知识点特性，自动生成高适配性的学习内容和指南。",
            href: "/content-generator",
            gradient: "from-purple-500 to-violet-600",
            hoverColor: "purple"
        },
        {
            icon: <Target size={32} className="text-white" />,
            title: "智能学习路径",
            description: "基于学习目标和当前水平，AI制定最优学习路线，确保高效达成目标。",
            href: "/learning-path",
            gradient: "from-pink-500 to-rose-600",
            hoverColor: "pink"
        }
    ];

    const subjects = ['数学', '物理', '化学', '编程', '艺术', '音乐', '语言', '科技'];

  return (
      <MainLayout>
            {/* Hero 区域 */}
        <HeroSection />

            {/* 智能试题生成专区 - 保留原有的绿色设计 */}
            <section className="py-16 bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-200/30 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-emerald-300/20 rounded-full animate-bounce delay-500"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                            🔥 热门功能
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🧠 AI智能出题+评估系统
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            基于Claude AI技术，智能生成个性化试题，支持全年级全学科，一键出题+批改+学习者评估
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* 左侧功能介绍 */}
                        <motion.div 
                            className="space-y-8"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">智能出题系统</h3>
                                    <p className="text-gray-600">根据年级、学科、难度自动生成高质量试题，涵盖选择题和填空题，确保知识点全面覆盖</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI智能批改</h3>
                                    <p className="text-gray-600">Claude AI自动批改答案，提供详细解析和改进建议，支持部分给分和同义词识别</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">学习者评估</h3>
                                    <p className="text-gray-600">基于答题数据生成个性化学习者评估报告，分析认知水平、学习风格和知识掌握情况</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 右侧CTA按钮和统计 */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
                            
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">立即体验智能出题</h3>
                                <p className="text-gray-600 mb-8">选择年级和学科，AI为您量身定制专属试题，支持在线答题和智能批改</p>
                                
                                <Link 
                                    href="/quiz-generator"
                                    className="group inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                                >
                                    <Zap className="w-6 h-6 mr-2" />
                                    开始智能出题+评估
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                {/* 功能亮点 */}
                                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-emerald-600">15+</div>
                                        <div className="text-sm text-gray-600">支持学科</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">AI</div>
                                        <div className="text-sm text-gray-600">智能批改</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">5s</div>
                                        <div className="text-sm text-gray-600">快速生成</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">3</div>
                                        <div className="text-sm text-gray-600">维度评估</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 学科覆盖展示 */}
            <section className="py-16 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/60">
                    <div className="absolute top-10 right-10 w-20 h-20 bg-blue-300/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-16 h-16 bg-indigo-300/40 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-purple-300/30 rounded-full animate-bounce delay-500"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center bg-blue-200/80 text-blue-900 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                            🌟 全覆盖学习
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🎯 全学科覆盖
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            从基础学科到前沿技术，我们的AI平台支持多领域学习内容
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                        {subjects.map((subject, index) => (
                            <SubjectIcon key={subject} subject={subject} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 核心功能展示 */}
            <section className="py-16 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/70">
                    <div className="absolute top-10 left-10 w-24 h-24 bg-purple-300/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-18 h-18 bg-pink-300/40 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-14 h-14 bg-rose-300/30 rounded-full animate-bounce delay-500"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center bg-purple-200/80 text-purple-900 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
                            ⚡ 核心技术
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            🚀 智能学习平台的核心功能
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            结合AI技术和教育科学，为每位学生提供个性化学习体验
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 课程展示 */}
            <section className="py-16 bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/70">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-300/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-cyan-300/40 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-blue-300/30 rounded-full animate-bounce delay-500"></div>
            </div>
            
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center bg-indigo-200/80 text-indigo-900 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                            📚 精品内容
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🎓 热门课程推荐
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            精心设计的系统化课程，涵盖多个学科领域，助您快速提升专业技能
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {featuredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
            
            <motion.div 
                        className="text-center"
              initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
                        <Link 
                            href="/courses"
                            className="group inline-flex items-center bg-white text-blue-600 hover:text-blue-700 px-8 py-4 rounded-xl font-bold text-lg border-2 border-blue-200 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                        >
                            <Eye className="w-5 h-5 mr-2" />
                            浏览所有课程
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

            {/* 信任标识和数据展示 */}
            <section className="py-16 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
              </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/20">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            🌟 行业领先
                </div>
                        <h2 className="text-4xl font-bold mb-4 text-white">
                            🏆 值得信赖的学习伙伴
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            数万学习者的共同选择，专业AI技术赋能个性化学习
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Users size={32} />, number: "50,000+", label: "活跃学习者", color: "from-blue-400 to-cyan-400" },
                            { icon: <BookOpen size={32} />, number: "1,000+", label: "优质课程", color: "from-purple-400 to-pink-400" },
                            { icon: <Award size={32} />, number: "98%", label: "用户满意度", color: "from-green-400 to-emerald-400" },
                            { icon: <Globe size={32} />, number: "50+", label: "国家地区", color: "from-orange-400 to-red-400" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 group-hover:shadow-2xl transition-all`}>
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {stat.icon}
                                    </motion.div>
                                </div>
                                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </motion.div>
                        ))}
            </div>
          </div>
        </section>
      </MainLayout>
  );
}