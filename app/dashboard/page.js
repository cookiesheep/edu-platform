'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
      
      // 在真实应用中，这里会从Supabase获取数据
      // 现在使用模拟数据
      setCourseProgress([
        { id: 1, course: '高中数学', progress: 75, total_lessons: 40, completed_lessons: 30 },
        { id: 2, course: '高中物理', progress: 42, total_lessons: 35, completed_lessons: 15 },
        { id: 3, course: '高中化学', progress: 90, total_lessons: 30, completed_lessons: 27 },
      ]);
      
      setRecentActivities([
        { id: 1, type: '完成课程', course: '高中数学 - 函数', date: '2025-03-11T14:32:00Z' },
        { id: 2, type: '测试', course: '高中物理 - 力学', score: 85, date: '2025-03-10T09:15:00Z' },
        { id: 3, type: '作业', course: '高中化学 - 有机化学', status: '已提交', date: '2025-03-09T16:45:00Z' },
      ]);
    }
    
    getUser();
  }, [router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">欢迎回来，{user?.email?.split('@')[0] || '同学'}</h1>
        <p className="text-gray-600 mt-2">这是您的学习仪表盘，在这里可以查看学习进度和最近活动。</p>
      </div>
      
      {/* 总体进度卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">已完成课程</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-blue-600">2</span>
            <span className="text-gray-500 ml-2">/ 6 课程</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">总学习时间</h3>
          <div className="text-3xl font-bold text-blue-600">68<span className="text-xl">小时</span></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">平均分数</h3>
          <div className="text-3xl font-bold text-blue-600">82<span className="text-xl">分</span></div>
        </div>
      </div>
      
      {/* 课程进度 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">课程进度</h2>
        <div className="space-y-6">
          {courseProgress.map((course) => (
            <div key={course.id}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{course.course}</span>
                <span className="text-gray-600">{course.completed_lessons}/{course.total_lessons} 课时</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 最近活动 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">最近活动</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">详情</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.score ? `得分: ${activity.score}` : activity.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
