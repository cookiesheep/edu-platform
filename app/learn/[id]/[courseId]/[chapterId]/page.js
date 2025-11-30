'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';

export default function ChapterLearningPage() {
    const params = useParams();
    const router = useRouter();
    const { courseId, chapterId } = params;

    const [course, setCourse] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // 获取用户会话
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                if (!session) {
                    router.push(`/login?redirect=/learn/${courseId}/${chapterId}`);
                    return;
                }

                setUser(session.user);

                // 获取课程信息
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', courseId)
                    .single();

                if (courseError) throw courseError;
                setCourse(courseData);

                // 获取当前章节信息
                const { data: chapterData, error: chapterError } = await supabase
                    .from('course_chapters')
                    .select('*')
                    .eq('id', chapterId)
                    .single();

                if (chapterError) throw chapterError;
                setChapter(chapterData);

                // 获取所有章节信息
                const { data: chaptersData, error: chaptersError } = await supabase
                    .from('course_chapters')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('order', { ascending: true });

                if (chaptersError) throw chaptersError;
                setChapters(chaptersData || []);

                // 设置当前章节索引
                const index = chaptersData.findIndex(ch => ch.id === chapterId);
                if (index !== -1) {
                    setCurrentIndex(index);
                }

                // 获取用户进度
                const { data: progressData, error: progressError } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('course_id', courseId)
                    .single();

                if (progressError && progressError.code !== 'PGRST116') {
                    throw progressError;
                }

                // 如果没有进度记录，创建一个新的
                if (!progressData) {
                    const { data: newProgress, error: createError } = await supabase
                        .from('user_progress')
                        .insert({
                            user_id: session.user.id,
                            course_id: courseId,
                            progress_percentage: 0,
                            completed_chapters: 0,
                            last_accessed: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (createError) throw createError;
                    setProgress(newProgress);
                } else {
                    setProgress(progressData);

                    // 更新最后访问时间
                    await supabase
                        .from('user_progress')
                        .update({ last_accessed: new Date().toISOString() })
                        .eq('id', progressData.id);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load chapter data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [courseId, chapterId, router]);

    // 完成章节
    const handleCompleteChapter = async () => {
        if (!user || !progress) return;

        try {
            // 计算新的完成章节数和进度百分比
            const completedChapters = Math.max(currentIndex + 1, progress.completed_chapters);
            const progressPercentage = Math.round((completedChapters / chapters.length) * 100);

            // 更新用户进度
            const { error } = await supabase
                .from('user_progress')
                .update({
                    completed_chapters: completedChapters,
                    progress_percentage: progressPercentage,
                    last_accessed: new Date().toISOString()
                })
                .eq('id', progress.id);

            if (error) throw error;

            // 更新本地状态
            setProgress({
                ...progress,
                completed_chapters: completedChapters,
                progress_percentage: progressPercentage
            });

            // 如果有下一章，导航到下一章
            if (currentIndex < chapters.length - 1) {
                router.push(`/learn/${courseId}/${chapters[currentIndex + 1].id}`);
            } else {
                // 否则返回课程详情页
                router.push(`/courses/${courseId}`);
            }

        } catch (err) {
            console.error('Error completing chapter:', err);
            setError('无法更新进度，请稍后再试');
        }
    };

    // 导航到下一章或上一章
    const navigateToChapter = (index) => {
        if (index >= 0 && index < chapters.length) {
            router.push(`/learn/${courseId}/${chapters[index].id}`);
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
                </div>
                <div>
                    <Link href={`/courses/${courseId}`} className="text-primary-600 hover:underline">
                        ← 返回课程
                    </Link>
                </div>
            </MainLayout>
        );
    }

    if (!course || !chapter) {
        return (
            <MainLayout>
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
                    <p className="font-bold">未找到内容</p>
                    <p>找不到请求的课程或章节</p>
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
            <div className="mb-4 flex justify-between items-center">
                <Link href={`/courses/${courseId}`} className="text-primary-600 hover:underline">
                    ← 返回课程
                </Link>

                {progress && (
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">
                            进度: {progress.progress_percentage}%
                        </span>
                        <div className="w-40 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${progress.progress_percentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* 章节导航 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-gray-600">
                            第 {currentIndex + 1} 章 / 共 {chapters.length} 章
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => navigateToChapter(currentIndex - 1)}
                            disabled={currentIndex === 0}
                            className="px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            上一章
                        </button>
                        <button
                            onClick={() => navigateToChapter(currentIndex + 1)}
                            disabled={currentIndex === chapters.length - 1}
                            className="px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            下一章
                        </button>
                    </div>
                </div>
            </div>

            {/* 章节内容 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
                {chapter.description && (
                    <p className="text-gray-700 italic mb-4">{chapter.description}</p>
                )}

                <div className="prose max-w-none">
                    {chapter.content ? (
                        <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
                    ) : (
                        <p>本章节暂无内容</p>
                    )}
                </div>
            </div>

            {/* 章节导航和完成按钮 */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => navigateToChapter(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        上一章
                    </button>
                    <button
                        onClick={() => navigateToChapter(currentIndex + 1)}
                        disabled={currentIndex === chapters.length - 1}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        下一章
                    </button>
                </div>

                <button
                    onClick={handleCompleteChapter}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                    {currentIndex < chapters.length - 1 ? '完成并继续' : '完成课程'}
                </button>
            </div>
        </MainLayout>
    );
}