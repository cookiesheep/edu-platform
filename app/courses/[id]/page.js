'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function CourseDetail() {
    const params = useParams();
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProgress, setUserProgress] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        async function fetchCourseData() {
            setLoading(true);

            // 获取课程信息
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (courseError) {
                console.error('Error fetching course:', courseError);
            } else {
                setCourse(courseData);
            }

            // 获取章节信息
            const { data: chaptersData, error: chaptersError } = await supabase
                .from('course_chapters')
                .select('*')
                .eq('course_id', courseId)
                .order('order', { ascending: true });

            if (chaptersError) {
                console.error('Error fetching chapters:', chaptersError);
            } else {
                setChapters(chaptersData);
            }

            // 获取用户进度
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: progressData, error: progressError } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('course_id', courseId)
                    .single();

                if (!progressError) {
                    setUserProgress(progressData);
                }
            }

            setLoading(false);
        }

        fetchCourseData();
    }, [courseId]);

    const handleEnroll = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // 重定向到登录页
            window.location.href = `/login?redirect=/courses/${courseId}`;
            return;
        }

        // 创建用户进度记录
        const { data, error } = await supabase
            .from('user_progress')
            .insert({
                user_id: session.user.id,
                course_id: courseId,
                progress_percentage: 0,
                completed_chapters: 0
            });

        if (error) {
            console.error('Error enrolling:', error);
        } else {
            // 刷新用户进度
            setUserProgress({
                user_id: session.user.id,
                course_id: courseId,
                progress_percentage: 0,
                completed_chapters: 0
            });
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (!course) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">课程未找到</h2>
                    <p className="mt-2 text-gray-600">抱歉，您请求的课程不存在。</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* 课程头部信息 */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                            <div className="flex items-center mb-2">
                <span className="text-sm bg-white/20 text-white py-1 px-3 rounded-full">
                  {course.level}
                </span>
                                <span className="text-sm bg-white/20 text-white py-1 px-3 rounded-full ml-2">
                  {course.subject}
                </span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                            <p className="text-lg mb-6">{course.description}</p>
                            <div className="flex items-center text-white/80 text-sm mb-6">
                                <div className="flex items-center mr-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span>{course.chapters} 章节</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span>{course.studentsEnrolled?.toLocaleString() || 0} 名学生</span>
                                </div>
                            </div>

                            {!userProgress ? (
                                <button
                                    onClick={handleEnroll}
                                    className="px-6 py-3 bg-white text-primary-700 font-medium rounded-md hover:bg-gray-100 transition duration-300"
                                >
                                    加入课程
                                </button>
                            ) : (
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <div className="text-sm mb-1">课程进度</div>
                                        <div className="w-48 bg-white/30 rounded-full h-2">
                                            <div
                                                className="bg-white h-2 rounded-full"
                                                style={{ width: `${userProgress.progress_percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = `/learn/${courseId}`}
                                        className="px-6 py-3 bg-white text-primary-700 font-medium rounded-md hover:bg-gray-100 transition duration-300"
                                    >
                                        继续学习
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="md:w-1/3">
                            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold mb-4">课程内容</h3>
                                <ul className="space-y-2">
                                    {chapters.slice(0, 3).map((chapter) => (
                                        <li key={chapter.id} className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{chapter.title}</span>
                                        </li>
                                    ))}
                                    {chapters.length > 3 && (
                                        <li className="text-white/70 text-sm">
                                            还有 {chapters.length - 3} 个章节...
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 标签页导航 */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        课程概览
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'content'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        课程内容
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'reviews'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        学生评价
                    </button>
                </nav>
            </div>

            {/* 标签页内容 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">课程概览</h2>
                        <p className="text-gray-600 mb-6">{course.description}</p>

                        <h3 className="text-xl font-bold mb-3">学习目标</h3>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>全面掌握{course.subject}的核心概念和理论</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>能够独立解决{course.subject}的典型问题</span>
                            </li>
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>培养{course.subject}学科的思维方式和分析能力</span>
                            </li>
                        </ul>

                        <h3 className="text-xl font-bold mb-3">适合人群</h3>
                        <p className="text-gray-600 mb-4">{course.level}学生，对{course.subject}有学习兴趣或需要提高学业成绩的同学。</p>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">课程内容</h2>
                        <div className="space-y-4">
                            {chapters.map((chapter, index) => (
                                <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="flex justify-between items-center p-4 bg-gray-50">
                                        <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full mr-3">
                        {index + 1}
                      </span>
                                            <h3 className="font-medium">{chapter.title}</h3>
                                        </div>
                                        {userProgress ? (
                                            <button className="text-primary-600 hover:text-primary-800">
                                                查看章节
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                        加入课程后可查看
                      </span>
                                        )}
                                    </div>
                                    <div className="p-4 text-gray-600 text-sm">
                                        {chapter.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">学生评价</h2>
                        <div className="flex items-center mb-6">
                            <div className="mr-4">
                                <div className="text-5xl font-bold text-gray-900">4.8</div>
                                <div className="flex text-yellow-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-500">共 124 条评价</div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center mb-1">
                                    <div className="text-sm w-10">5 星</div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                    <div className="text-sm w-10 text-right">85%</div>
                                </div>
                                <div className="flex items-center mb-1">
                                    <div className="text-sm w-10">4 星</div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                    <div className="text-sm w-10 text-right">10%</div>
                                </div>
                                <div className="flex items-center mb-1">
                                    <div className="text-sm w-10">3 星</div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '3%' }}></div>
                                    </div>
                                    <div className="text-sm w-10 text-right">3%</div>
                                </div>
                                <div className="flex items-center mb-1">
                                    <div className="text-sm w-10">2 星</div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '1%' }}></div>
                                    </div>
                                    <div className="text-sm w-10 text-right">1%</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-sm w-10">1 星</div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '1%' }}></div>
                                    </div>
                                    <div className="text-sm w-10 text-right">1%</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3 font-medium">
                                        ZS
                                    </div>
                                    <div>
                                        <div className="font-medium">张三</div>
                                        <div className="text-sm text-gray-500">2025-03-01</div>
                                    </div>
                                    <div className="ml-auto flex text-yellow-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    这门课程的内容非常清晰，老师讲解透彻，对我的学习很有帮助。特别是习题部分，难度适中，能够很好地检验学习成果。
                                </p>
                            </div>
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3 font-medium">
                                        LS
                                    </div>
                                    <div>
                                        <div className="font-medium">李四</div>
                                        <div className="text-sm text-gray-500">2025-02-15</div>
                                    </div>
                                    <div className="ml-auto flex text-yellow-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    AI生成的学习路径真的很棒，能够针对我的薄弱环节进行针对性练习。课程内容也很全面，强烈推荐给其他同学！
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}