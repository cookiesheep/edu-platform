'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';

// 外部视频课程供应商
const VIDEO_PROVIDERS = [
  {
    id: 'coursera',
    name: 'Coursera',
    courses: [
      {
        id: 'coursera-1',
        title: '机器学习',
        instructor: 'Andrew Ng',
        level: '大学',
        thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera.s3.amazonaws.com/topics/ml/large-icon.png',
        url: 'https://www.coursera.org/learn/machine-learning'
      },
      {
        id: 'coursera-2',
        title: '数据科学概论',
        instructor: 'Johns Hopkins University',
        level: '大学',
        thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/08/33f720502a11e59e72391aa537f5c9/jhudatascience_thumbnail_1x1.png',
        url: 'https://www.coursera.org/learn/data-scientists-tools'
      }
    ]
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩',
    courses: [
      {
        id: 'bilibili-1',
        title: '高中数学知识点精讲',
        instructor: '一数',
        level: '高中',
        thumbnail: 'https://i0.hdslb.com/bfs/archive/b30bbe9da0fe3cde566066c263210c8ed8576c32.jpg',
        url: 'https://www.bilibili.com/video/BV1bW411n7fY'
      },
      {
        id: 'bilibili-2',
        title: '高中物理全套教程',
        instructor: '杨浩',
        level: '高中',
        thumbnail: 'https://i0.hdslb.com/bfs/archive/59c5fa06f1868030feba5c758c11b5e0d2f5a9c8.jpg',
        url: 'https://www.bilibili.com/video/BV1Dt411r7TZ'
      }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    courses: [
      {
        id: 'youtube-1',
        title: 'Learn Python - Full Course for Beginners',
        instructor: 'freeCodeCamp.org',
        level: '初级',
        thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=rfscVS0vtbw'
      },
      {
        id: 'youtube-2',
        title: 'Calculus 1 - Full College Course',
        instructor: 'freeCodeCamp.org',
        level: '大学',
        thumbnail: 'https://i.ytimg.com/vi/HfACrKJ_Y2w/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=HfACrKJ_Y2w'
      }
    ]
  }
];

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [externalCourses, setExternalCourses] = useState([]);
  const [filter, setFilter] = useState({ subject: '', level: '' });

  // 筛选选项
  const subjects = ['全部', '数学', '物理', '化学', '生物', '历史', '地理', '政治', '英语', '语文'];
  const levels = ['全部', '小学', '初中', '高中', '大学', '研究生'];

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);

        // 从 Supabase 获取平台课程
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
          console.error('获取课程时出错:', error);
        } else {
          setCourses(data || []);
        }

        // 设置外部课程
        const allExternalCourses = VIDEO_PROVIDERS.flatMap(provider =>
            provider.courses.map(course => ({
              ...course,
              provider: provider.name
            }))
        );
        setExternalCourses(allExternalCourses);

      } catch (error) {
        console.error('获取课程数据时出错:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // 筛选课程
  const filteredPlatformCourses = courses.filter(course => {
    return (filter.subject === '' || filter.subject === '全部' || course.subject === filter.subject) &&
        (filter.level === '' || filter.level === '全部' || course.level === filter.level);
  });

  const filteredExternalCourses = externalCourses.filter(course => {
    return (filter.level === '' || filter.level === '全部' || course.level === filter.level);
  });

  return (
      <MainLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">课程中心</h1>
          <p className="text-gray-600 mt-2">探索我们的课程和外部学习资源</p>
        </div>

        {/* 筛选器 */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                科目
              </label>
              <select
                  id="subject"
                  value={filter.subject}
                  onChange={(e) => setFilter(prev => ({ ...prev, subject: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                级别
              </label>
              <select
                  id="level"
                  value={filter.level}
                  onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        ) : (
            <div className="space-y-8">
              {/* 平台课程 */}
              {filteredPlatformCourses.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">平台课程</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPlatformCourses.map(course => (
                          <Link
                              href={`/courses/${course.id}`}
                              key={course.id}
                              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="h-40 bg-gray-200 relative">
                              {course.image_url ? (
                                  <img
                                      src={course.image_url}
                                      alt={course.title}
                                      className="w-full h-full object-cover"
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                  </div>
                              )}
                              <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                {course.level}
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{course.subject}</p>
                              <p className="text-gray-500 text-sm line-clamp-2">{course.description || '暂无描述'}</p>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">{course.chapters} 章节</span>
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    平台课程
                                                </span>
                              </div>
                            </div>
                          </Link>
                      ))}
                    </div>
                  </div>
              )}

              {/* 外部课程 */}
              {VIDEO_PROVIDERS.map(provider => {
                const filteredCourses = provider.courses.filter(course =>
                    filter.level === '' || filter.level === '全部' || course.level === filter.level
                );

                if (filteredCourses.length === 0) return null;

                return (
                    <div key={provider.id}>
                      <h2 className="text-2xl font-bold mb-4">{provider.name} 课程</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={course.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <div className="h-40 bg-gray-200 relative">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  {course.level}
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">讲师: {course.instructor}</p>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-sm text-gray-500">外部资源</span>
                                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {provider.name}
                                                    </span>
                                </div>
                              </div>
                            </a>
                        ))}
                      </div>
                    </div>
                );
              })}

              {filteredPlatformCourses.length === 0 && filteredExternalCourses.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                    <p>没有找到符合当前筛选条件的课程。请尝试调整筛选条件。</p>
                  </div>
              )}
            </div>
        )}
      </MainLayout>
  );
}