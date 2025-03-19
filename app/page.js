'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

// 首页Hero组件
const HeroSection = () => {
  return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              AI驱动的大学学习平台，<br/>提升你的专业技能
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              融合人工智能与优质教学内容，助力大学生攻克专业课程难关，实现学术突破
            </p>
            <div className="flex space-x-4">
              <Link href="/courses" className="px-6 py-3 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 shadow-md transition duration-300">
                探索课程
              </Link>
              <Link href="/about" className="px-6 py-3 text-base font-medium rounded-md text-white border border-white hover:bg-white/10 transition duration-300">
                了解更多
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
                src="/hero-image.svg"
                alt="智能学习平台"
                className="max-w-md w-full"
            />
          </div>
        </div>
      </div>
  );
};

// 课程卡片组件
const CourseCard = ({ course, index }) => {
  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
      >
        <div className="h-48 w-full overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {course.subject === '数学' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.871 4h4.258m4.258 0h4.742M4.871 8h4.258m4.258 0h4.742M4.871 12h4.258m4.258 0h4.742M4.871 16h4.258m4.258 0h4.742M4.871 20h4.258m4.258 0h4.742" />
                </svg>
            )}
            {course.subject === '物理' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292m0 0a7 7 0 0010.8 10.8 7 7 0 00-10.8-10.8zM12 13a4 4 0 110 5.292M7 13a4 4 0 110 5.292" />
                </svg>
            )}
            {course.subject === '计算机' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {course.subject}
            </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
            <span className="text-sm bg-blue-100 text-blue-700 py-1 px-2 rounded-full">
            {course.level}
          </span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{course.chapters} 章节</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{course.studentsEnrolled.toLocaleString()} 名学生</span>
            </div>
          </div>
          <Link href={`/courses/${course.id}`}>
            <Button className="w-full">
              查看详情
            </Button>
          </Link>
        </div>
      </motion.div>
  );
};

// 平台特点项组件
const FeatureItem = ({ icon, title, description }) => {
  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
  );
};

// 首页组件
export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    // 大学课程数据
    setFeaturedCourses([
      {
        id: 1,
        title: '高等数学 (上)',
        description: '覆盖极限、连续、微分学、积分学等核心内容，为理工科学生打下坚实的数学基础',
        imageUrl: '/placeholder.jpg',
        level: '大一',
        subject: '数学',
        chapters: 16,
        studentsEnrolled: 5240,
        rating: 4.8,
        instructor: '张教授'
      },
      {
        id: 2,
        title: '数据结构与算法',
        description: '系统讲解常用数据结构与算法，包括数组、链表、树、图以及相关算法的分析与设计',
        imageUrl: '/placeholder.jpg',
        level: '大二',
        subject: '计算机',
        chapters: 18,
        studentsEnrolled: 3785,
        rating: 4.9,
        instructor: '王教授'
      },
      {
        id: 3,
        title: '大学物理 - 力学与热学',
        description: '牛顿力学、刚体力学、流体力学、热力学，以及相关物理实验与应用',
        imageUrl: '/placeholder.jpg',
        level: '大一',
        subject: '物理',
        chapters: 14,
        studentsEnrolled: 4158,
        rating: 4.7,
        instructor: '李教授'
      },
    ]);
  }, []);

  return (
      <MainLayout>
        {/* 英雄区域 */}
        <HeroSection />

        {/* 特色课程 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">热门课程</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/courses">
              <Button variant="outline" className="mt-2">
                查看全部课程
              </Button>
            </Link>
          </div>
        </section>

        {/* 平台特点 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">平台特点</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureItem
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
                title="专业题库"
                description="AI生成的专业课题库，根据学生的学习进度和弱点自动调整难度和题型，助力专业课高分。"
            />
            <FeatureItem
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title="学习分析"
                description="全面分析学习数据，提供个性化学习报告和改进建议，帮助找到学习瓶颈，提高学习效率。"
            />
            <FeatureItem
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="学习路径"
                description="基于AI算法的个性化学习路径规划，帮助大学生高效备考、攻克难关、提升专业技能。"
            />
          </div>
        </section>

        {/* 师资力量 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">顶尖师资</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['张教授', '李教授', '王教授', '刘教授'].map((name, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {index === 0 ? '高等数学' : index === 1 ? '大学物理' : index === 2 ? '数据结构' : 'C语言编程'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {index === 0 ? '北京大学博士，教学经验15年' :
                        index === 1 ? '清华大学教授，物理学博士' :
                            index === 2 ? '计算机科学与技术专家，教学经验10年' :
                                '软件工程专家，多年企业实战经验'}
                  </p>
                </motion.div>
            ))}
          </div>
        </section>

        {/* 号召行动 */}
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 p-8 rounded-lg shadow-sm text-center"
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-4">准备好提升你的专业能力了吗？</h2>
          <p className="text-blue-600 mb-6 max-w-2xl mx-auto">
            加入我们的学习平台，体验AI驱动的个性化学习，攻克专业课程难关，为学术和职业发展打下坚实基础。
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8">
              立即注册
            </Button>
          </Link>
        </motion.section>
      </MainLayout>
  );
}