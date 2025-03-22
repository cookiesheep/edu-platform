'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id;

    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // 获取课程数据
    useEffect(() => {
        async function fetchCourseData() {
            try {
                setLoading(true);
                setError(null);

                // 获取用户会话
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) {
                    console.error('Error fetching session:', sessionError);
                    throw sessionError;
                }

                if (session) {
                    setUser(session.user);
                }

                // 获取课程详情
                console.log('Fetching course with ID:', courseId);
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', courseId)
                    .single();

                if (courseError) {
                    console.error('Error fetching course:', courseError);
                    throw new Error(`Error fetching course: ${JSON.stringify(courseError)}`);
                }

                setCourse(courseData);

                // 获取章节列表
                console.log('Fetching chapters for course ID:', courseId);
                const { data: chaptersData, error: chaptersError } = await supabase
                    .from('course_chapters')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('order', { ascending: true });

                if (chaptersError) {
                    console.error('Error fetching chapters:', chaptersError);
                    throw new Error(`Error fetching chapters: ${JSON.stringify(chaptersError)}`);
                }

                setChapters(chaptersData || []);

                // 如果用户已登录，获取用户进度
                if (session) {
                    const { data: progressData, error: progressError } = await supabase
                        .from('user_progress')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .eq('course_id', courseId)
                        .single();

                    if (progressError && progressError.code !== 'PGRST116') { // PGRST116 表示没有找到记录
                        console.error('Error fetching user progress:', progressError);
                    } else if (progressData) {
                        setUserProgress(progressData);
                    }
                }
            } catch (err) {
                console.error('Error in fetchCourseData:', err);
                setError(err.message || 'Failed to load course data');
            } finally {
                setLoading(false);
            }
        }

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    // 处理开始或继续学习
    const handleStartLearning = async () => {
        if (!user) {
            // 如果用户未登录，重定向到登录页面
            window.location.href = `/login?redirect=/courses/${courseId}`;
            return;
        }

        try {
            // 如果没有进度记录，创建一个新的
            if (!userProgress) {
                const { error } = await supabase
                    .from('user_progress')
                    .insert({
                        user_id: user.id,
                        course_id: courseId,
                        progress_percentage: 0,
                        completed_chapters: 0,
                        last_accessed: new Date().toISOString()
                    });

                if (error) throw error;
            } else {
                // 更新最后访问时间
                await supabase
                    .from('user_progress')
                    .update({ last_accessed: new Date().toISOString() })
                    .eq('id', userProgress.id);
            }

            // 重定向到第一个章节或上次学习的章节
            if (chapters.length > 0) {
                // 如果有进度，找到第一个未完成的章节
                if (userProgress && userProgress.completed_chapters > 0) {
                    const nextChapterIndex = Math.min(userProgress.completed_chapters, chapters.length - 1);
                    window.location.href = `/learn/${courseId}/${chapters[nextChapterIndex].id}`;
                } else {
                    // 否则从第一章开始
                    window.location.href = `/learn/${courseId}/${chapters[0].id}`;
                }
            }
        } catch (err) {
            console.error('Error starting course:', err);
            setError('无法开始课程学习，请稍后再试');
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <p className="font-bold">加载失败</p>
                    <p>{error}</p>
                    <p className="mt-2">技术详情: 尝试加载课程 ID: {courseId}</p>
                </div>
                <div>
                    <Link href="/courses" className="text-primary-600 hover:underline">
                        ← 返回课程列表
                    </Link>
                </div>
            </MainLayout>
        );
    }

    if (!course) {
        return (
            <MainLayout>
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
                    <p className="font-bold">未找到课程</p>
                    <p>找不到 ID 为 {courseId} 的课程</p>
                </div>
                <div>
                    <Link href="/courses" className="text-primary-600 hover:underline">
                        ← 返回课程列表
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-4">
                <Link href="/courses" className="text-primary-600 hover:underline">
                    ← 返回课程列表
                </Link>
            </div>

            {/* 课程头部 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="md:flex">
                    {/* 课程图片 */}
                    <div className="md:w-1/3 bg-gray-200 md:h-auto h-48">
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
                    </div>

                    {/* 课程信息 */}
                    <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {course.subject}
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                        {course.level}
                                    </span>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        {course.chapters} 章节
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleStartLearning}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                {userProgress ? '继续学习' : '开始学习'}
                            </button>
                        </div>

                        <p className="text-gray-700 mb-4">{course.description || '暂无课程描述'}</p>

                        {/* 学习进度 */}
                        {userProgress && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-1">学习进度: {userProgress.progress_percentage}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-primary-600 h-2.5 rounded-full"
                                        style={{ width: `${userProgress.progress_percentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    最后学习时间: {new Date(userProgress.last_accessed).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 章节列表 */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">课程章节</h2>

                {chapters.length > 0 ? (
                    <div className="space-y-4">
                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter.id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            第 {index + 1} 章: {chapter.title}
                                        </h3>
                                        <p className="text-gray-600">{chapter.description || '暂无章节描述'}</p>
                                    </div>

                                    <button
                                        onClick={() => window.location.href = `/learn/${courseId}/${chapter.id}`}
                                        className="px-3 py-1 border border-primary-500 text-primary-600 rounded hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        查看
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
                        <p>此课程暂无章节内容</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}