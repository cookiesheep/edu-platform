'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, TrendingUp,
  CheckCircle, AlertCircle, FileText
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SpotlightCard from '@/components/ui/SpotlightCard';
import ParallaxFloating from '@/components/ui/ParallaxFloating';

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

      try {
        // 从真实数据库获取用户学习进度
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select(`
            *,
            courses(id, title, subject, level)
          `)
          .eq('user_id', session.user.id)
          .order('last_accessed', { ascending: false });

        if (!progressError && progressData && progressData.length > 0) {
          // 获取每个课程的章节总数
          const progressWithChapters = await Promise.all(
            progressData.map(async (progress) => {
              const { count } = await supabase
                .from('course_chapters')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', progress.course_id);

              const colors = [
                'from-blue-500 to-cyan-400',
                'from-purple-500 to-pink-400',
                'from-emerald-500 to-teal-400',
                'from-orange-500 to-red-400',
                'from-indigo-500 to-purple-400'
              ];

              return {
                id: progress.id,
                course: progress.courses?.title || '未知课程',
                progress: progress.progress_percentage || 0,
                total_lessons: count || 0,
                completed_lessons: progress.completed_chapters || 0,
                color: colors[progressData.indexOf(progress) % colors.length]
              };
            })
          );

          setCourseProgress(progressWithChapters);
        } else {
          // 数据库中没有数据，使用模拟数据
          console.warn('数据库中没有学习进度数据，使用模拟数据');
          setCourseProgress([
            { id: 1, course: '高中数学', progress: 75, total_lessons: 40, completed_lessons: 30, color: 'from-blue-500 to-cyan-400' },
            { id: 2, course: '高中物理', progress: 42, total_lessons: 35, completed_lessons: 15, color: 'from-purple-500 to-pink-400' },
            { id: 3, course: '高中化学', progress: 90, total_lessons: 30, completed_lessons: 27, color: 'from-emerald-500 to-teal-400' },
          ]);
        }

        // 获取最近的测验记录作为活动
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_records')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!quizError && quizData && quizData.length > 0) {
          const activities = quizData.map((quiz, index) => {
            const icons = [CheckCircle, Award, FileText];
            const colors = ['text-emerald-400', 'text-amber-400', 'text-blue-400'];
            return {
              id: quiz.id,
              type: '测试',
              course: quiz.topic || '测验',
              score: quiz.score,
              date: quiz.created_at,
              icon: icons[index % icons.length],
              color: colors[index % colors.length]
            };
          });
          setRecentActivities(activities);
        } else {
          // 数据库中没有数据，使用模拟数据
          console.warn('数据库中没有测验记录，使用模拟数据');
          setRecentActivities([
            { id: 1, type: '完成课程', course: '高中数学 - 函数', date: '2025-03-11T14:32:00Z', icon: CheckCircle, color: 'text-emerald-400' },
            { id: 2, type: '测试', course: '高中物理 - 力学', score: 85, date: '2025-03-10T09:15:00Z', icon: Award, color: 'text-amber-400' },
            { id: 3, type: '作业', course: '高中化学 - 有机化学', status: '已提交', date: '2025-03-09T16:45:00Z', icon: FileText, color: 'text-blue-400' },
          ]);
        }
      } catch (error) {
        console.error('获取数据时出错:', error);
        // 如果出错，使用模拟数据
        setCourseProgress([
          { id: 1, course: '高中数学', progress: 75, total_lessons: 40, completed_lessons: 30, color: 'from-blue-500 to-cyan-400' },
          { id: 2, course: '高中物理', progress: 42, total_lessons: 35, completed_lessons: 15, color: 'from-purple-500 to-pink-400' },
          { id: 3, course: '高中化学', progress: 90, total_lessons: 30, completed_lessons: 27, color: 'from-emerald-500 to-teal-400' },
        ]);
        setRecentActivities([
          { id: 1, type: '完成课程', course: '高中数学 - 函数', date: '2025-03-11T14:32:00Z', icon: CheckCircle, color: 'text-emerald-400' },
          { id: 2, type: '测试', course: '高中物理 - 力学', score: 85, date: '2025-03-10T09:15:00Z', icon: Award, color: 'text-amber-400' },
          { id: 3, type: '作业', course: '高中化学 - 有机化学', status: '已提交', date: '2025-03-09T16:45:00Z', icon: FileText, color: 'text-blue-400' },
        ]);
      }
    }

    getUser();
  }, [router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#020617] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-transparent pt-20 pb-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

        <ParallaxFloating speed={-0.4} className="absolute top-20 right-20 z-0">
          <div className="w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </ParallaxFloating>

        <ParallaxFloating speed={0.6} className="absolute bottom-40 left-20 z-0">
          <div className="w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </ParallaxFloating>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 欢迎头部 */}
          <ScrollReveal>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                欢迎回来，
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {user?.email?.split('@')[0] || '同学'}
                </span>
              </h1>
              <p className="text-slate-400">这是您的学习仪表盘，在这里可以查看学习进度和最近活动。</p>
            </div>
          </ScrollReveal>

          {/* 总体进度卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ScrollReveal delay={0.1}>
              <SpotlightCard className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">已完成课程</h3>
                <div className="flex items-end relative z-10">
                  <span className="text-4xl font-bold text-white">2</span>
                  <span className="text-slate-500 ml-2 mb-1">/ 6 课程</span>
                </div>
                <div className="mt-4 w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SpotlightCard className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock className="w-24 h-24 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">总学习时间</h3>
                <div className="flex items-end relative z-10">
                  <span className="text-4xl font-bold text-white">68</span>
                  <span className="text-slate-500 ml-2 mb-1">小时</span>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>较上周增加 12%</span>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <SpotlightCard className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award className="w-24 h-24 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">平均分数</h3>
                <div className="flex items-end relative z-10">
                  <span className="text-4xl font-bold text-white">82</span>
                  <span className="text-slate-500 ml-2 mb-1">分</span>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>超越 75% 的同学</span>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 课程进度 */}
            <ScrollReveal delay={0.4} className="lg:col-span-2">
              <div className="glass-panel rounded-2xl border border-white/10 p-6 h-full">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
                  课程进度
                </h2>
                <div className="space-y-6">
                  {courseProgress.map((course) => (
                    <div key={course.id} className="group">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{course.course}</span>
                        <span className="text-slate-400 text-sm">{course.completed_lessons}/{course.total_lessons} 课时</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          className={`h-2.5 rounded-full bg-gradient-to-r ${course.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* 最近活动 */}
            <ScrollReveal delay={0.5}>
              <div className="glass-panel rounded-2xl border border-white/10 p-6 h-full">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                  最近活动
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`mt-1 ${activity.color}`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {activity.course}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-slate-400">
                            {activity.type}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.score && (
                          <p className="text-xs font-medium text-amber-400 mt-1">
                            得分: {activity.score}
                          </p>
                        )}
                        {activity.status && (
                          <p className="text-xs font-medium text-blue-400 mt-1">
                            {activity.status}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
