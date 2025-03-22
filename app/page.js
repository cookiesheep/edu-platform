'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bot, BookOpen, PieChart, Brain, Sparkles, Users, Trophy, ChevronRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import HeroSection from '@/components/ui/HeroSection';

// 课程卡片组件
const CourseCard = ({ course, index }) => {
  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-primary-200 transform hover:-translate-y-1"
      >
        <div className="h-48 w-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {course.subject}
            </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{course.title}</h3>
            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full font-medium">
            {course.level}
          </span>
          </div>
          <p className="text-gray-700 mb-4 line-clamp-2">{course.description}</p>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
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
            <Button className="w-full bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 border border-primary-200 transition-all group-hover:bg-primary-600 group-hover:text-white font-medium">
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
        {/* 使用Hero组件 */}
        <HeroSection />

        {/* 特色课程 */}
        <section className="mb-16 py-12 bg-gray-50 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-2 text-gray-800"
              >
                热门课程
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-700 max-w-2xl mx-auto"
              >
                探索我们精心设计的课程，开启你的学习之旅
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
            
            <motion.div 
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/courses">
                <Button variant="outline" className="px-8 py-2.5 rounded-full border-2 border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400 font-medium">
                  查看全部课程
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 平台特点 */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                智能学习平台的核心功能
              </h2>
              <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
                结合AI技术和教育科学，为每位学生提供个性化学习体验
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* 功能1: AI学习助手 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all p-6 hover:border-primary-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot size={24} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI学习助手</h3>
                <p className="text-gray-600">
                  随时解答问题，提供个性化学习建议，引导学习过程，就像你的专属导师
                </p>
                <Link href="/ai-assistant" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
                  了解更多 <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* 功能2: 个性化学习路径 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all p-6 hover:border-primary-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen size={24} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">个性化学习路径</h3>
                <p className="text-gray-600">
                  基于你的学习目标和当前水平，规划最优学习路线，确保高效达成目标
                </p>
                <Link href="/learning-path" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
                  了解更多 <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* 功能3: 数据驱动评估 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all p-6 hover:border-primary-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart size={24} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">数据驱动评估</h3>
                <p className="text-gray-600">
                  详细分析学习数据，识别优势和弱点，提供针对性改进建议，持续优化学习
                </p>
                <Link href="/analytics" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
                  了解更多 <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
  );
}