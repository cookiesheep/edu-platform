'use client';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // 模拟数据
  const mockCourses = [
    {
      id: 1,
      title: '高中数学 - 必修1',
      description: '包含函数、指数与对数、三角函数等核心内容',
      imageUrl: 'https://source.unsplash.com/random/300x200?math',
      level: '高中',
      subject: '数学',
      chapters: 12,
      studentsEnrolled: 3240,
    },
    {
      id: 2,
      title: '高中物理 - 力学基础',
      description: '牛顿运动定律、功和能、动量等基础物理概念',
      imageUrl: 'https://source.unsplash.com/random/300x200?physics',
      level: '高中',
      subject: '物理',
      chapters: 8,
      studentsEnrolled: 2158,
    },
    {
      id: 3,
      title: '高中化学 - 有机化学',
      description: '烃类化合物、官能团、有机反应等核心知识点',
      imageUrl: 'https://source.unsplash.com/random/300x200?chemistry',
      level: '高中',
      subject: '化学',
      chapters: 10,
      studentsEnrolled: 1985,
    },
    {
      id: 4,
      title: '初中数学 - 代数入门',
      description: '基础代数概念、一元一次方程、二元一次方程组等',
      imageUrl: 'https://source.unsplash.com/random/300x200?algebra',
      level: '初中',
      subject: '数学',
      chapters: 14,
      studentsEnrolled: 4562,
    },
  ];

  // 使用模拟数据代替API调用
  const fetchCourses = () => {
    setLoading(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      // 过滤数据
      const filteredData = mockCourses.filter(course => {
        // 搜索词过滤
        const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 科目过滤
        const subjectMatch = selectedSubject === 'all' || course.subject === selectedSubject;
        
        // 等级过滤
        const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
        
        return searchMatch && subjectMatch && levelMatch;
      });
      
      setCourses(filteredData);
      setLoading(false);
    }, 500); // 500ms的延迟模拟网络请求
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedSubject, selectedLevel]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">所有课程</h1>
        <p className="text-gray-600 mt-2">浏览我们提供的全部课程，开始您的学习之旅</p>
      </div>
      
      {/* 筛选器区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">搜索课程</label>
            <input
              type="text"
              id="search"
              placeholder="输入关键词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">科目</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部科目</option>
              <option value="数学">数学</option>
              <option value="物理">物理</option>
              <option value="化学">化学</option>
              <option value="英语">英语</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">学习阶段</label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部阶段</option>
              <option value="小学">小学</option>
              <option value="初中">初中</option>
              <option value="高中">高中</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 课程卡片网格 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
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
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{course.chapters} 章节</span>
                    <span>{course.studentsEnrolled.toLocaleString()} 名学生</span>
                  </div>
                  <Link href={`/courses/${course.id}`} className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    查看详情
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">未找到符合条件的课程</h3>
              <p className="mt-1 text-gray-500">请尝试调整筛选条件或搜索关键词。</p>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}
