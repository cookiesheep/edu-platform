'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Search, Filter, Star, Clock, Users, Play, BookOpen, 
    TrendingUp, Award, Heart, ExternalLink, Tag
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');

    // 真实课程数据 - 来自B站和慕课网
    const courses = [
        {
            id: 1,
            title: '2024年Python零基础入门到精通教程',
            instructor: '黑马程序员',
            platform: 'B站',
            university: '传智教育',
            rating: 4.9,
            studentsEnrolled: 125600,
            duration: '52小时',
            lessons: 156,
            price: 0, // 免费
            level: '初级',
            category: 'programming',
            tags: ['Python', '零基础', '实战项目', '爬虫'],
            description: '从Python基础语法到项目实战，包含网络爬虫、数据分析等实用技能，适合零基础学员学习。',
            image: '/api/placeholder/400/240',
            url: 'https://www.bilibili.com/video/BV1qW4y1a7fU',
            completionRate: 92,
            lastUpdated: '2024-01-15',
            features: ['提供源码', '答疑服务', '实战项目', '就业指导']
        },
        {
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
            image: '/api/placeholder/400/240',
            url: 'https://www.bilibili.com/video/BV1Kt411w7MP',
            completionRate: 87,
            lastUpdated: '2024-02-10',
            features: ['视频高清', '项目实战', '技术答疑', '学习群']
        },
        {
            id: 3,
            title: '机器学习基础与实战应用',
            instructor: '李宏毅',
            platform: 'B站',
            university: '台湾大学',
            rating: 4.9,
            studentsEnrolled: 76500,
            duration: '68小时',
            lessons: 124,
            price: 0,
            level: '高级',
            category: 'ai',
            tags: ['机器学习', '深度学习', '神经网络', 'TensorFlow'],
            description: '台大李宏毅教授的机器学习课程，从基础理论到实战应用，内容深入浅出。',
            image: '/api/placeholder/400/240',
            url: 'https://www.bilibili.com/video/BV1Wv411h7kN',
            completionRate: 78,
            lastUpdated: '2024-01-20',
            features: ['大学级别', '理论扎实', '案例丰富', '作业练习']
        },
        {
            id: 4,
            title: 'React18+TypeScript企业级项目实战',
            instructor: '尚硅谷',
            platform: 'B站',
            university: '尚硅谷教育',
            rating: 4.8,
            studentsEnrolled: 54200,
            duration: '45小时',
            lessons: 89,
            price: 0,
            level: '中级',
            category: 'programming',
            tags: ['React', 'TypeScript', '企业项目', 'Hooks'],
            description: '最新React18特性详解，结合TypeScript开发企业级项目，包含完整的前端解决方案。',
            image: '/api/placeholder/400/240',
            url: 'https://www.bilibili.com/video/BV1ZB4y1Z7o8',
            completionRate: 85,
            lastUpdated: '2024-03-05',
            features: ['最新技术', '企业项目', '代码规范', '部署上线']
        },
        {
            id: 5,
            title: '数据结构与算法（C++版）',
            instructor: '邓俊辉',
            platform: '中国大学MOOC',
            university: '清华大学',
            rating: 4.9,
            studentsEnrolled: 234500,
            duration: '64小时',
            lessons: 168,
            price: 199,
            level: '中级',
            category: 'computer-science',
            tags: ['数据结构', '算法', 'C++', '清华'],
            description: '清华大学邓俊辉教授主讲，系统讲解数据结构与算法的核心概念和实现方法。',
            image: '/api/placeholder/400/240',
            url: 'https://www.icourse163.org/course/THU-1002654005',
            completionRate: 72,
            lastUpdated: '2024-02-28',
            features: ['清华名师', '系统完整', '理论实践', '认证证书']
        },
        {
            id: 6,
            title: '深度学习与PyTorch实战',
            instructor: '小土堆',
            platform: 'B站',
            university: '个人UP主',
            rating: 4.8,
            studentsEnrolled: 45800,
            duration: '38小时',
            lessons: 76,
            price: 0,
            level: '高级',
            category: 'ai',
            tags: ['深度学习', 'PyTorch', '神经网络', 'CV'],
            description: 'PyTorch深度学习框架从入门到实战，包含计算机视觉、自然语言处理等应用。',
            image: '/api/placeholder/400/240',
            url: 'https://www.bilibili.com/video/BV1hE411t7RN',
            completionRate: 81,
            lastUpdated: '2024-01-30',
            features: ['实战导向', '代码详解', '项目练习', '社群支持']
        },
        {
            id: 7,
            title: '微积分（上）',
            instructor: '张筑生',
            platform: '中国大学MOOC',
            university: '北京大学',
            rating: 4.9,
            studentsEnrolled: 156700,
            duration: '56小时',
            lessons: 142,
            price: 299,
            level: '中级',
            category: 'mathematics',
            tags: ['微积分', '高等数学', '北大', '基础理论'],
            description: '北京大学数学科学学院张筑生教授主讲，系统讲解微积分的基本概念和方法。',
            image: '/api/placeholder/400/240',
            url: 'https://www.icourse163.org/course/PKU-1002014005',
            completionRate: 68,
            lastUpdated: '2024-03-01',
            features: ['北大名师', '理论严谨', '习题丰富', '学分认证']
        },
        {
            id: 8,
            title: 'Node.js+Express+MongoDB全栈开发',
            instructor: 'Coding十三',
            platform: 'B站',
            university: '个人UP主',
            rating: 4.7,
            studentsEnrolled: 32100,
            duration: '35小时',
            lessons: 72,
            price: 0,
            level: '中级',
            category: 'programming',
            tags: ['Node.js', 'Express', 'MongoDB', '全栈'],
            description: '从零开始学习Node.js后端开发，包含Express框架、MongoDB数据库等技术栈。',
            image: '/api/placeholder/400/240',
            url: 'https://www.bilibili.com/video/BV1a34y167AZ',
            completionRate: 79,
            lastUpdated: '2024-02-15',
            features: ['全栈技术', '项目实战', '部署上线', '源码提供']
        },
        {
            id: 9,
            title: '大学物理（力学）',
            instructor: '钟锡华',
            platform: '中国大学MOOC',
            university: '北京大学',
            rating: 4.8,
            studentsEnrolled: 89400,
            duration: '48小时',
            lessons: 96,
            price: 199,
            level: '中级',
            category: 'physics',
            tags: ['大学物理', '力学', '北大', '理论物理'],
            description: '北京大学物理学院钟锡华教授主讲，深入浅出地讲解大学物理力学部分。',
            image: '/api/placeholder/400/240',
            url: 'https://www.icourse163.org/course/PKU-1003645005',
            completionRate: 74,
            lastUpdated: '2024-02-20',
            features: ['北大教授', '实验演示', '习题讲解', '期末考试']
        }
    ];

    // 分类选项
    const categories = [
        { value: 'all', label: '全部课程', count: courses.length },
        { value: 'programming', label: '编程开发', count: courses.filter(c => c.category === 'programming').length },
        { value: 'ai', label: '人工智能', count: courses.filter(c => c.category === 'ai').length },
        { value: 'mathematics', label: '数学', count: courses.filter(c => c.category === 'mathematics').length },
        { value: 'physics', label: '物理', count: courses.filter(c => c.category === 'physics').length },
        { value: 'computer-science', label: '计算机科学', count: courses.filter(c => c.category === 'computer-science').length }
    ];

    // 过滤课程
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
        const matchesPrice = selectedPrice === 'all' || 
                           (selectedPrice === 'free' && course.price === 0) ||
                           (selectedPrice === 'paid' && course.price > 0);
        
        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    // 课程卡片组件
    const CourseCard = ({ course, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
        >
            {/* 课程封面 */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-3 opacity-90" />
                        <div className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                            {course.platform}
            </div>
          </div>
        </div>

                {/* 平台标识 */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {course.duration}
            </div>
                
                {/* 价格标签 */}
                <div className="absolute top-3 right-3">
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

                {/* 课程等级 */}
                <div className="absolute bottom-3 left-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        course.level === '初级' ? 'bg-green-500/80 text-white' :
                        course.level === '中级' ? 'bg-yellow-500/80 text-white' :
                        'bg-red-500/80 text-white'
                    }`}>
                                {course.level}
                                                </span>
                              </div>
                            </div>

            <div className="p-6">
                {/* 课程标题 */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {course.title}
                </h3>

                {/* 讲师和平台信息 */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1.5 text-blue-500" />
                        <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1.5 text-purple-500" />
                        <span>{course.university}</span>
                    </div>
                  </div>

                {/* 课程描述 */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center"
                        >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                        </span>
                    ))}
                    {course.tags.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{course.tags.length - 3}
                        </span>
                    )}
                </div>

                {/* 课程统计 */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1.5 text-blue-500" />
                        <span>{course.studentsEnrolled.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 mr-1.5 text-yellow-500" />
                        <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1.5 text-green-500" />
                        <span>{course.lessons}节课</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-1.5 text-purple-500" />
                        <span>{course.completionRate}%完成</span>
                    </div>
                </div>

                {/* 课程特色 */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {course.features.slice(0, 2).map((feature, idx) => (
                        <span 
                            key={idx}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-3">
                    <motion.a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2.5 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            前往学习
                        </div>
                    </motion.a>
                    <motion.button
                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Heart className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                {/* 页面头部 */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                📚 精品课程库
                            </h1>
                            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                                汇聚B站、慕课等优质平台的热门课程，助您快速提升专业技能
                            </p>
                            
                            {/* 搜索框 */}
                            <div className="max-w-2xl mx-auto relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="搜索课程、讲师或技术栈..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none text-lg shadow-xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 过滤器和内容 */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* 侧边栏过滤器 */}
                        <div className="lg:w-64 space-y-6">
                            {/* 分类过滤 */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-blue-500" />
                                    课程分类
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.value}
                                            onClick={() => setSelectedCategory(category.value)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                selectedCategory === category.value
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{category.label}</span>
                                                <span className="text-sm text-gray-500">({category.count})</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                              </div>

                            {/* 难度等级 */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">难度等级</h3>
                                <div className="space-y-2">
                                    {['all', '初级', '中级', '高级'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedLevel(level)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                selectedLevel === level
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {level === 'all' ? '全部等级' : level}
                                        </button>
                                    ))}
                                </div>
                              </div>

                            {/* 价格筛选 */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">价格</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: '全部价格' },
                                        { value: 'free', label: '免费课程' },
                                        { value: 'paid', label: '付费课程' }
                                    ].map((price) => (
                                        <button
                                            key={price.value}
                                            onClick={() => setSelectedPrice(price.value)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                selectedPrice === price.value
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {price.label}
                                        </button>
                        ))}
                      </div>
                    </div>
                        </div>

                        {/* 课程列表 */}
                        <div className="flex-1">
                            {/* 结果统计 */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-gray-600">
                                    找到 <span className="font-bold text-gray-900">{filteredCourses.length}</span> 门课程
                                </div>
                                <div className="text-sm text-gray-500">
                                    来自 B站、中国大学MOOC 等优质平台
                                </div>
                            </div>

                            {/* 课程网格 */}
                            {filteredCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCourses.map((course, index) => (
                                        <CourseCard key={course.id} course={course} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到相关课程</h3>
                                    <p className="text-gray-500 mb-6">尝试调整搜索条件或浏览其他分类</p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('all');
                                            setSelectedLevel('all');
                                            setSelectedPrice('all');
                                        }}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        重置筛选条件
                                    </button>
                  </div>
              )}
                        </div>
                    </div>
                </section>
            </div>
      </MainLayout>
  );
}