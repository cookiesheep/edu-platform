'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Book, Clock, Users, Star, Filter } from 'lucide-react';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  // 大学课程模拟数据
  const mockCourses = [
    {
      id: 1,
      title: '高等数学 (上)',
      description: '覆盖极限、连续、微分学、积分学等核心内容，为理工科学生打下坚实的数学基础',
      imageUrl: '/course-images/calculus.jpg', // 使用本地图片
      level: '大一',
      subject: '数学',
      chapters: 16,
      studentsEnrolled: 5240,
      rating: 4.8,
      instructor: '张教授',
      tags: ['必修课', '理工科', '数学基础']
    },
    {
      id: 2,
      title: '大学物理 - 力学与热学',
      description: '牛顿力学、刚体力学、流体力学、热力学，以及相关物理实验与应用',
      imageUrl: '/course-images/physics.jpg',
      level: '大一',
      subject: '物理',
      chapters: 14,
      studentsEnrolled: 4158,
      rating: 4.7,
      instructor: '李教授',
      tags: ['必修课', '理工科', '实验课']
    },
    {
      id: 3,
      title: '数据结构与算法',
      description: '系统讲解常用数据结构与算法，包括数组、链表、树、图以及相关算法的分析与设计',
      imageUrl: '/course-images/data-structures.jpg',
      level: '大二',
      subject: '计算机',
      chapters: 18,
      studentsEnrolled: 3785,
      rating: 4.9,
      instructor: '王教授',
      tags: ['专业课', '计算机科学', '编程']
    },
    {
      id: 4,
      title: 'C语言程序设计',
      description: 'C语言基础语法、指针、内存管理、数据结构实现，以及实际工程中的应用',
      imageUrl: '/course-images/c-programming.jpg',
      level: '大一',
      subject: '计算机',
      chapters: 15,
      studentsEnrolled: 6312,
      rating: 4.6,
      instructor: '刘教授',
      tags: ['入门课', '编程语言', '实践课']
    },
    {
      id: 5,
      title: '线性代数',
      description: '向量空间、线性变换、矩阵理论及其在数学、物理、工程中的广泛应用',
      imageUrl: '/course-images/linear-algebra.jpg',
      level: '大一',
      subject: '数学',
      chapters: 12,
      studentsEnrolled: 4125,
      rating: 4.5,
      instructor: '黄教授',
      tags: ['必修课', '数学基础', '工程应用']
    },
    {
      id: 6,
      title: '计算机网络原理',
      description: '网络体系结构、TCP/IP协议族、网络安全、网络编程与应用开发',
      imageUrl: '/course-images/computer-networks.jpg',
      level: '大三',
      subject: '计算机',
      chapters: 14,
      studentsEnrolled: 2950,
      rating: 4.8,
      instructor: '陈教授',
      tags: ['专业课', '网络技术', '安全']
    },
    {
      id: 7,
      title: 'Python数据科学基础',
      description: '使用Python进行数据分析、可视化和机器学习，掌握NumPy、Pandas和Matplotlib等核心库',
      imageUrl: '/course-images/python-data-science.jpg',
      level: '大二',
      subject: '计算机',
      chapters: 16,
      studentsEnrolled: 4680,
      rating: 4.9,
      instructor: '郑教授',
      tags: ['选修课', '数据科学', '编程']
    },
    {
      id: 8,
      title: '微积分与数学分析',
      description: '深入探讨微积分原理，包括Riemann积分、多元函数微分学、级数理论等高级主题',
      imageUrl: '/course-images/mathematical-analysis.jpg',
      level: '大二',
      subject: '数学',
      chapters: 18,
      studentsEnrolled: 2840,
      rating: 4.7,
      instructor: '林教授',
      tags: ['进阶课', '数学理论', '理工科']
    },
    {
      id: 9,
      title: '数字电路与逻辑设计',
      description: '数字系统基本原理、组合逻辑电路、时序逻辑电路设计及FPGA实现',
      imageUrl: '/course-images/digital-circuits.jpg',
      level: '大二',
      subject: '电子工程',
      chapters: 13,
      studentsEnrolled: 2365,
      rating: 4.6,
      instructor: '杨教授',
      tags: ['专业课', '硬件设计', '实验课']
    },
    {
      id: 10,
      title: '概率论与数理统计',
      description: '概率论基础、随机变量、数理统计方法及其在工程、经济等领域的应用',
      imageUrl: '/course-images/probability.jpg',
      level: '大二',
      subject: '数学',
      chapters: 14,
      studentsEnrolled: 3870,
      rating: 4.5,
      instructor: '赵教授',
      tags: ['必修课', '统计理论', '应用数学']
    },
    {
      id: 11,
      title: '操作系统原理',
      description: '操作系统结构、进程管理、内存管理、文件系统及安全机制的设计与实现',
      imageUrl: '/course-images/operating-systems.jpg',
      level: '大三',
      subject: '计算机',
      chapters: 16,
      studentsEnrolled: 3150,
      rating: 4.8,
      instructor: '孙教授',
      tags: ['专业课', '系统原理', '编程实践']
    },
    {
      id: 12,
      title: '数据库系统',
      description: '关系数据库理论、SQL语言、数据库设计与优化、NoSQL数据库技术',
      imageUrl: '/course-images/database-systems.jpg',
      level: '大三',
      subject: '计算机',
      chapters: 15,
      studentsEnrolled: 3450,
      rating: 4.7,
      instructor: '钱教授',
      tags: ['专业课', '数据管理', '实用技术']
    }
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
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleCourseClick = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">探索课程</h1>
          <p className="text-gray-600 mt-2">浏览我们精心设计的大学课程，提升你的专业技能</p>
        </div>

        {/* 筛选器区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-medium">筛选课程</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="search" className="mb-2">搜索课程</Label>
              <Input
                  id="search"
                  placeholder="输入课程名、教授或关键词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="subject" className="mb-2">学科分类</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="选择学科" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学科</SelectItem>
                  <SelectItem value="数学">数学</SelectItem>
                  <SelectItem value="物理">物理</SelectItem>
                  <SelectItem value="计算机">计算机</SelectItem>
                  <SelectItem value="电子工程">电子工程</SelectItem>
                  <SelectItem value="经济管理">经济管理</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level" className="mb-2">学习阶段</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="选择阶段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部阶段</SelectItem>
                  <SelectItem value="大一">大一</SelectItem>
                  <SelectItem value="大二">大二</SelectItem>
                  <SelectItem value="大三">大三</SelectItem>
                  <SelectItem value="大四">大四</SelectItem>
                  <SelectItem value="研究生">研究生</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 课程卡片网格 */}
        {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        ) : (
            <>
              {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, visibleCount).map((course) => (
                        <Card
                            key={course.id}
                            className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
                            onClick={() => handleCourseClick(course.id)}
                        >
                          <div className="relative h-48 w-full overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-3 text-sm z-10 rounded-bl-lg">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 fill-current" />
                                <span>{course.rating}</span>
                              </div>
                            </div>
                            {/* 使用Next.js Image组件以获得更好的性能和图片展示 */}
                            {/* 注意：在实际项目中，您需要准备这些图片并放在public目录下 */}
                            {/* 这里使用了模拟的本地图片路径，实际使用时请替换为真实的图片 */}
                            <div className="relative w-full h-full">
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
                                {course.subject === '电子工程' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                )}
                              </div>
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-blue-100 text-blue-700 py-1 px-2 rounded-full">
                        {course.subject}
                      </span>
                              <span className="text-xs bg-purple-100 text-purple-700 py-1 px-2 rounded-full">
                        {course.level}
                      </span>
                              {course.tags.slice(0, 1).map((tag, index) => (
                                  <span key={index} className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                          {tag}
                        </span>
                              ))}
                            </div>

                            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                            <div className="text-sm text-gray-500 mb-3">
                              <span className="font-medium">{course.instructor}</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Book className="h-4 w-4 mr-1" />
                                <span>{course.chapters} 章节</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{course.studentsEnrolled.toLocaleString()} 学生</span>
                              </div>
                            </div>

                            <Button className="w-full">
                              查看详情
                            </Button>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-gray-900">未找到符合条件的课程</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                      请尝试调整筛选条件或搜索关键词，或者查看我们的全部课程列表。
                    </p>
                    <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSubject('all');
                          setSelectedLevel('all');
                        }}
                    >
                      重置筛选条件
                    </Button>
                  </div>
              )}

              {/* 加载更多按钮 */}
              {!loading && courses.length > visibleCount && (
                  <div className="flex justify-center mt-10">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        className="px-8"
                    >
                      加载更多课程
                    </Button>
                  </div>
              )}
            </>
        )}
      </div>
  );
}