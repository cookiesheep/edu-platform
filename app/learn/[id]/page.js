'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LearnPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userProgress, setUserProgress] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 获取用户信息
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(`/login?redirect=/learn/${courseId}`);
                return;
            }
            setUser(session.user);

            // 获取课程信息
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            let finalCourseData = courseData;
            if (courseError || !courseData) {
                // 数据库中没有数据，使用模拟数据
                console.warn('数据库中没有课程数据，使用模拟数据');
                finalCourseData = {
                    id: courseId,
                    title: '示例课程',
                    description: '这是一个示例课程，用于演示学习功能',
                    subject: '通用',
                    level: '中级',
                    image_url: null
                };
            }
            setCourse(finalCourseData);

            // 获取章节信息
            const { data: chaptersData, error: chaptersError } = await supabase
                .from('course_chapters')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });

            let finalChaptersData = chaptersData || [];
            if (chaptersError || !chaptersData || chaptersData.length === 0) {
                // 数据库中没有数据，使用模拟数据
                console.warn('数据库中没有章节数据，使用模拟数据');
                finalChaptersData = [
                    {
                        id: '1',
                        course_id: courseId,
                        title: '第一章：课程介绍',
                        content: '<h2>欢迎学习本课程</h2><p>这是第一章的内容，介绍课程的基本信息和学习目标。</p><p>在本章中，您将学习到：</p><ul><li>课程概述</li><li>学习目标</li><li>课程结构</li></ul>',
                        order_index: 1
                    },
                    {
                        id: '2',
                        course_id: courseId,
                        title: '第二章：基础知识',
                        content: '<h2>基础知识</h2><p>这是第二章的内容，讲解课程所需的基础知识。</p><p>在本章中，您将学习到：</p><ul><li>基础概念</li><li>核心理论</li><li>实践方法</li></ul>',
                        order_index: 2
                    },
                    {
                        id: '3',
                        course_id: courseId,
                        title: '第三章：进阶内容',
                        content: '<h2>进阶内容</h2><p>这是第三章的内容，深入讲解进阶知识点。</p><p>在本章中，您将学习到：</p><ul><li>高级技巧</li><li>实战案例</li><li>最佳实践</li></ul>',
                        order_index: 3
                    }
                ];
            }
            setChapters(finalChaptersData);

            // 获取用户进度
            const { data: progressData, error: progressError } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('course_id', courseId)
                .single();

            if (!progressError && progressData) {
                setUserProgress(progressData);

                // 确定当前章节
                if (progressData.completed_chapters < finalChaptersData.length) {
                    setCurrentChapter(finalChaptersData[progressData.completed_chapters]);
                } else {
                    setCurrentChapter(finalChaptersData[0]);
                }
            } else {
                // 如果没有进度记录，使用默认值（不创建记录，避免数据库错误）
                const defaultProgress = {
                    progress_percentage: 0,
                    completed_chapters: 0
                };
                setUserProgress(defaultProgress);
                setCurrentChapter(finalChaptersData[0]);
            }

            setLoading(false);
        }

        fetchData();
    }, [courseId, router]);

    const updateProgress = async (chapterIndex) => {
        if (!user || !course) return;

        const percentage = ((chapterIndex + 1) / chapters.length) * 100;

        const { error } = await supabase
            .from('user_progress')
            .update({
                progress_percentage: percentage,
                completed_chapters: chapterIndex + 1,
                last_accessed: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('course_id', courseId);

        if (error) {
            console.error('Error updating progress:', error);
        } else {
            setUserProgress({
                ...userProgress,
                progress_percentage: percentage,
                completed_chapters: chapterIndex + 1
            });
        }
    };

    const handleChapterClick = (chapter) => {
        setCurrentChapter(chapter);
        setSidebarOpen(false);
    };

    const handleComplete = async () => {
        if (!currentChapter) return;

        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        if (currentIndex < chapters.length - 1) {
            // 更新进度
            if ((currentIndex + 1) > (userProgress?.completed_chapters || 0)) {
                await updateProgress(currentIndex);
            }

            // 前往下一章
            setCurrentChapter(chapters[currentIndex + 1]);
        } else {
            // 已完成所有章节
            await updateProgress(chapters.length - 1);

            // 可以添加课程完成提示或重定向
            alert('恭喜！您已完成本课程的学习！');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!course || !currentChapter) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">课程未找到</h2>
                <p className="mt-2 text-gray-600">抱歉，您请求的课程不存在。</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* 侧边栏 - 课程章节列表 */}
            <div
                className={`bg-white w-80 border-r border-gray-200 flex-shrink-0 fixed inset-y-0 left-0 z-30 lg:static lg:block lg:translate-x-0 transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
                    <button
                        className="ml-auto lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="h-full overflow-y-auto pb-20">
                    <div className="px-6 py-4">
                        <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">课程进度</div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary-600 h-2.5 rounded-full"
                                    style={{ width: `${userProgress?.progress_percentage || 0}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {userProgress?.completed_chapters || 0}/{chapters.length} 章节完成
                            </div>
                        </div>
                        <div className="space-y-1">
                            {chapters.map((chapter, index) => {
                                const isCompleted = (userProgress?.completed_chapters || 0) > index;
                                const isCurrent = currentChapter.id === chapter.id;

                                return (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter)}
                                        className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                                            isCurrent
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium ${
                                            isCompleted
                                                ? 'bg-green-100 text-green-700'
                                                : isCurrent
                                                    ? 'bg-primary-100 text-primary-700'
                                                    : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {isCompleted ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-medium ${isCurrent ? 'text-primary-700' : 'text-gray-700'}`}>
                                                {chapter.title}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* 顶部导航 */}
                <header className="bg-white shadow-sm z-20">
                    <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                        <button
                            className="lg:hidden text-gray-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center flex-1 justify-center lg:justify-start">
                            <h1 className="text-lg font-bold text-gray-900 truncate">
                                {currentChapter.title}
                            </h1>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* 内容区 */}
                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="prose prose-primary max-w-none">
                            <h2>{currentChapter.title}</h2>
                            <p className="text-gray-500 mb-6">{currentChapter.description}</p>
                            <div dangerouslySetInnerHTML={{ __html: currentChapter.content || '<p>此章节内容正在准备中...</p>' }} />
                        </div>

                        <div className="mt-10 flex justify-between">
                            <button
                                onClick={() => {
                                    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
                                    if (currentIndex > 0) {
                                        setCurrentChapter(chapters[currentIndex - 1]);
                                    }
                                }}
                                disabled={chapters.findIndex(c => c.id === currentChapter.id) === 0}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                上一章
                            </button>
                            <button
                                onClick={handleComplete}
                                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                            >
                                {chapters.findIndex(c => c.id === currentChapter.id) === chapters.length - 1 ? '完成课程' : '完成并继续'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}