'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight, Brain, Sparkles, Zap, Globe, Shield, Users, CheckCircle, Play,
    Calculator, Beaker, Code, Palette, Music, Languages, Cpu, BookOpen, User, Star, Clock, Trophy
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import TypewriterText from '@/components/ui/TypewriterText';
import MagneticButton from '@/components/ui/MagneticButton';
import SpotlightCard from '@/components/ui/SpotlightCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ParallaxFloating from '@/components/ui/ParallaxFloating';

// 学科图标组件
const SubjectIcon = ({ subject, index }) => {
    const icons = {
        '数学': <Calculator className="w-6 h-6" />,
        '物理': <Zap className="w-6 h-6" />,
        '化学': <Beaker className="w-6 h-6" />,
        '编程': <Code className="w-6 h-6" />,
        '艺术': <Palette className="w-6 h-6" />,
        '音乐': <Music className="w-6 h-6" />,
        '语言': <Languages className="w-6 h-6" />,
        '科技': <Cpu className="w-6 h-6" />
    };

    return (
        <ScrollReveal delay={index * 0.05}>
            <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-3 group cursor-pointer"
            >
                <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/20">
                    {icons[subject] || <BookOpen className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                    {subject}
                </span>
            </motion.div>
        </ScrollReveal>
    );
};

// 课程卡片组件
const CourseCard = ({ course, index }) => {
    return (
        <ScrollReveal delay={index * 0.1}>
            <SpotlightCard className="glass-card rounded-2xl overflow-hidden group h-full flex flex-col border border-white/10 hover:border-cyan-500/30">
                {/* 课程封面 */}
                <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent z-10" />
                    <div className={`w-full h-full bg-gradient-to-br ${index % 2 === 0 ? 'from-slate-800 to-slate-700' : 'from-slate-900 to-slate-800'} group-hover:scale-110 transition-transform duration-700`} />

                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                            {course.subject}
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-black/60 text-white backdrop-blur-md flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {course.totalTime}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-black/60 text-white backdrop-blur-md">
                            {course.chapters} 章节
                        </span>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {course.title}
                        </h3>
                    </div>

                    <div className="flex items-center mb-4 text-sm text-slate-400">
                        <User className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{course.instructor}</span>
                        <span className="mx-2 text-slate-600">|</span>
                        <span>{course.university}</span>
                    </div>

                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                        {course.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-bold">{course.rating}</span>
                            <span className="text-slate-500 text-xs">({course.studentsEnrolled})</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                            {course.price === 0 ? '免费' : `¥${course.price}`}
                        </div>
                    </div>
                </div>
            </SpotlightCard>
        </ScrollReveal>
    );
};

export default function Home() {
    const [featuredCourses, setFeaturedCourses] = useState([]);

    useEffect(() => {
        const mockCourses = [
            {
                id: 1,
                title: '高等数学 - 从入门到精通',
                description: '清华大学数学系王教授主讲，涵盖极限、微分、积分、级数等核心概念，配合大量实例和动画演示',
                subject: '数学',
                chapters: 24,
                totalTime: '36小时',
                studentsEnrolled: 15240,
                rating: 4.9,
                instructor: '王志华教授',
                university: '清华大学',
                price: 0
            },
            {
                id: 2,
                title: 'Python数据科学与机器学习',
                description: '从Python基础语法到机器学习实战，包含pandas、numpy、sklearn等核心库，5个实战项目',
                subject: '编程',
                chapters: 32,
                totalTime: '48小时',
                studentsEnrolled: 8965,
                rating: 4.8,
                instructor: '李明博士',
                university: '北京大学',
                price: 199
            },
            {
                id: 3,
                title: '大学物理 - 力学与电磁学',
                description: '中科院物理所专家团队制作，包含丰富的物理实验视频和3D动画演示，让抽象概念变得生动',
                subject: '物理',
                chapters: 28,
                totalTime: '42小时',
                studentsEnrolled: 12580,
                rating: 4.7,
                instructor: '张建国研究员',
                university: '中科院',
                price: 0
            }
        ];
        setFeaturedCourses(mockCourses);
    }, []);

    const subjects = ['数学', '物理', '化学', '编程', '艺术', '音乐', '语言', '科技'];

    return (
        <MainLayout>
            <div className="flex flex-col min-h-screen bg-transparent">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

                    <ParallaxFloating speed={-0.5} className="absolute top-0 left-1/4 z-0">
                        <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    </ParallaxFloating>

                    <ParallaxFloating speed={0.8} className="absolute bottom-0 right-1/4 z-0">
                        <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    </ParallaxFloating>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <ScrollReveal>
                                <div className="inline-flex items-center px-3 py-1 rounded-full glass-panel mb-8 border border-cyan-500/30">
                                    <span className="relative flex h-2 w-2 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                    </span>
                                    <span className="text-cyan-100 text-sm font-medium tracking-wide">全新 AI 学习助手已上线</span>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.1}>
                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                                    <TypewriterText text="开启您的智能" />
                                    <span className="text-gradient-primary"> 学习之旅</span>
                                </h1>
                            </ScrollReveal>

                            <ScrollReveal delay={0.2}>
                                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    结合最前沿的 AI 技术，为您提供个性化学习路径、智能题目生成和实时答疑解惑。让学习变得更高效、更有趣。
                                </p>
                            </ScrollReveal>

                            <ScrollReveal delay={0.3}>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <MagneticButton>
                                        <Link href="/quiz-generator" className="block">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center cursor-pointer"
                                            >
                                                <Sparkles className="w-5 h-5 mr-2" />
                                                开始智能出题
                                            </motion.div>
                                        </Link>
                                    </MagneticButton>

                                    <MagneticButton>
                                        <Link href="/courses" className="block">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-4 glass-panel border border-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center cursor-pointer"
                                            >
                                                <Play className="w-5 h-5 mr-2" />
                                                浏览课程
                                            </motion.div>
                                        </Link>
                                    </MagneticButton>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Smart Quiz Generator Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-900/10 to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <ScrollReveal direction="left">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium mb-6">
                                    <Zap className="w-4 h-4 mr-2" />
                                    AI 智能评估系统
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    智能试题 <br />
                                    <span className="text-emerald-400">生成系统</span>
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                    根据年级、学科和难度即时生成个性化试题。
                                    我们的 AI 会分析您的表现，提供量身定制的反馈和学习路径。
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { title: "智能生成", desc: "根据您的水平自适应调整难度" },
                                        { title: "即时反馈", desc: "为每个答案提供详细解析" },
                                        { title: "表现分析", desc: "通过可视化图表追踪您的进步" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-white font-semibold">{item.title}</h4>
                                                <p className="text-slate-500 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10">
                                    <Link href="/quiz-generator">
                                        <MagneticButton>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center cursor-pointer"
                                            >
                                                体验智能出题
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </motion.div>
                                        </MagneticButton>
                                    </Link>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="right" delay={0.2}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                                    <SpotlightCard className="glass-panel p-8 rounded-3xl relative border-emerald-500/20" spotlightColor="rgba(16, 185, 129, 0.15)">
                                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                            <div>
                                                <div className="text-sm text-slate-400">学科</div>
                                                <div className="text-white font-semibold">数学</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-slate-400">难度</div>
                                                <div className="text-emerald-400 font-semibold">高级</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                                    <div className="h-2 w-3/4 bg-slate-700 rounded mb-3" />
                                                    <div className="space-y-2">
                                                        <div className="h-2 w-full bg-slate-800 rounded" />
                                                        <div className="h-2 w-5/6 bg-slate-800 rounded" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex justify-center">
                                            <div className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm animate-pulse">
                                                AI 正在生成题目...
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Subject Coverage Section */}
                <section className="py-24 bg-transparent relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    全学科覆盖
                                </h2>
                                <p className="text-slate-400 max-w-2xl mx-auto">
                                    从 STEM 到艺术，探索广泛的学科，助您掌握任何领域。
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
                            {subjects.map((subject, index) => (
                                <SubjectIcon key={subject} subject={subject} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Courses Section */}
                <section className="py-24 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <ScrollReveal>
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        热门 <span className="text-gradient-primary">精选课程</span>
                                    </h2>
                                    <p className="text-slate-400 max-w-2xl">
                                        精选名校名师优质课程，助您快速提升。
                                    </p>
                                </div>
                                <Link href="/courses" className="hidden md:block">
                                    <div className="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
                                        查看全部 <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </Link>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredCourses.map((course, index) => (
                                <CourseCard key={course.id} course={course} index={index} />
                            ))}
                        </div>

                        <div className="mt-12 text-center md:hidden">
                            <Link href="/courses">
                                <div className="text-cyan-400 hover:text-cyan-300 inline-flex items-center transition-colors">
                                    查看全部 <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Core Features Section */}
                <section className="py-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a]/50 to-[#020617] pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">为什么选择 EduPlatform？</h2>
                                <p className="text-slate-400 max-w-2xl mx-auto">
                                    我们不仅仅是一个学习平台，更是您的私人 AI 导师，全方位提升学习效率。
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Brain className="w-8 h-8 text-purple-400" />,
                                    title: "AI 智能驱动",
                                    description: "基于大语言模型的智能助教，随时为您解答疑惑，生成个性化习题。"
                                },
                                {
                                    icon: <Globe className="w-8 h-8 text-cyan-400" />,
                                    title: "全网资源聚合",
                                    description: "汇聚 B 站、慕课等优质教育资源，一站式获取最全学习资料。"
                                },
                                {
                                    icon: <Shield className="w-8 h-8 text-emerald-400" />,
                                    title: "科学学习体系",
                                    description: "基于艾宾浩斯遗忘曲线的复习计划，助您牢固掌握每一个知识点。"
                                }
                            ].map((feature, index) => (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <SpotlightCard className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group h-full">
                                        <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </SpotlightCard>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 border-y border-white/5 bg-white/[0.02] relative overflow-hidden">
                    <ParallaxFloating speed={0.2} className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
                    </ParallaxFloating>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { number: "10k+", label: "活跃用户" },
                                { number: "500+", label: "精品课程" },
                                { number: "1M+", label: "AI 生成题目" },
                                { number: "98%", label: "好评率" }
                            ].map((stat, index) => (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <div className="p-6">
                                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                                            {stat.number}
                                        </div>
                                        <div className="text-slate-400 font-medium">{stat.label}</div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none" />
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                准备好开始了吗？
                            </h2>
                            <p className="text-xl text-slate-400 mb-12">
                                立即加入 EduPlatform，体验 AI 时代的学习方式。
                            </p>
                            <MagneticButton>
                                <Link href="/login" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-colors cursor-pointer"
                                    >
                                        免费注册
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </motion.div>
                                </Link>
                            </MagneticButton>
                        </ScrollReveal>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}