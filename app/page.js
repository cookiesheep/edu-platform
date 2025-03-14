'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    // 模拟数据
    setFeaturedCourses([
      {
        id: 1,
        title: '高中数学',
        description: '包含高中数学必修和选修全部内容，深入浅出讲解各类题型。',
        imageUrl: 'https://source.unsplash.com/random/300x200?math',
        level: '高中',
      },
      {
        id: 2,
        title: '高中物理',
        description: '物理原理与实际应用相结合，培养科学思维与解题能力。',
        imageUrl: 'https://source.unsplash.com/random/300x200?physics',
        level: '高中',
      },
      {
        id: 3,
        title: '高中化学',
        description: '覆盖无机化学、有机化学核心知识点，强化理论与实验结合。',
        imageUrl: 'https://source.unsplash.com/random/300x200?chemistry',
        level: '高中',
      },
    ]);
  }, []);

  return (
    <MainLayout>
      {/* 英雄区域 */}
      <div className="bg-blue-600 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8 sm:p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">智能学习助手，个性化教育平台</h1>
          <p className="text-xl mb-6">
            利用AI技术为每个学生提供个性化学习路径、成绩评估和智能题库
          </p>
          <Link href="/courses" className="inline-block px-6 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100">
            立即开始学习
          </Link>
        </div>
      </div>

      {/* 特色课程 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">特色课程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <span className="text-sm bg-blue-100 text-blue-700 py-1 px-2 rounded">
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <Link href={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  查看详情 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 平台特点 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">平台特点</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">智能题库</h3>
            <p className="text-gray-600">
              AI生成的题库根据学生的学习进度和弱点自动调整难度和题型，提高学习效率。
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">成绩评估</h3>
            <p className="text-gray-600">
              全面分析学生的答题情况，提供深入的成绩评估和改进建议，帮助找到学习瓶颈。
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">学习路径</h3>
            <p className="text-gray-600">
              基于AI算法的个性化学习路径推荐，优化学习顺序，加强薄弱环节，提高学习效果。
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
