'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function AnalyticsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('month');
    const [subjectFilter, setSubjectFilter] = useState('all');

    // 学习数据
    const [quizData, setQuizData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [statsData, setStatsData] = useState({
        totalQuizzes: 0,
        averageScore: 0,
        totalHours: 0,
        completedCourses: 0,
        strongestSubject: '',
        weakestSubject: ''
    });

    // 科目选项
    const subjectOptions = ['all', '数学', '物理', '化学', '生物', '历史', '地理', '政治', '英语', '语文'];

    // 饼图颜色
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // 获取用户会话
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (!session) {
                    router.push('/login?redirect=/analytics');
                    return;
                }

                setUser(session.user);

                // 获取测验数据
                const { data: quizzes, error: quizError } = await supabase
                    .from('quiz_attempts')
                    .select('*, courses(subject)')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (quizError) throw quizError;

                // 获取进度数据
                const { data: progress, error: progressError } = await supabase
                    .from('user_progress')
                    .select('*, courses(*)')
                    .eq('user_id', session.user.id);

                if (progressError) throw progressError;

                // 获取课程数据
                const { data: courses, error: coursesError } = await supabase
                    .from('courses')
                    .select('*');

                if (coursesError) throw coursesError;

                // 处理数据
                setQuizData(quizzes || []);
                setProgressData(progress || []);
                setCourseData(courses || []);

                // 计算统计数据
                if (quizzes) {
                    // 计算平均分
                    const totalScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
                    const avgScore = quizzes.length > 0 ? totalScore / quizzes.length : 0;

                    // 计算完成的课程
                    const completedCourses = progress ? progress.filter(p => p.progress_percentage >= 100).length : 0;

                    // 计算总学习时间（模拟数据，实际应该从用户活动记录中获取）
                    const totalHours = quizzes.length * 0.5 + (progress ? progress.reduce((sum, p) => sum + p.progress_percentage / 20, 0) : 0);

                    // 计算强弱学科
                    const subjectScores = {};
                    quizzes.forEach(quiz => {
                        const subject = quiz.courses?.subject || '未知';
                        if (!subjectScores[subject]) {
                            subjectScores[subject] = { total: 0, count: 0 };
                        }
                        subjectScores[subject].total += quiz.score;
                        subjectScores[subject].count += 1;
                    });

                    let strongestSubject = '';
                    let weakestSubject = '';
                    let highestAvg = 0;
                    let lowestAvg = 100;

                    Object.entries(subjectScores).forEach(([subject, data]) => {
                        const avg = data.total / data.count;
                        if (avg > highestAvg) {
                            highestAvg = avg;
                            strongestSubject = subject;
                        }
                        if (avg < lowestAvg) {
                            lowestAvg = avg;
                            weakestSubject = subject;
                        }
                    });

                    setStatsData({
                        totalQuizzes: quizzes.length,
                        averageScore: avgScore.toFixed(1),
                        totalHours: totalHours.toFixed(1),
                        completedCourses,
                        strongestSubject,
                        weakestSubject
                    });
                }

            } catch (error) {
                console.error('获取学习数据时出错:', error);
                setError('加载学习数据失败。请稍后再试。');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [router]);

    // 根据时间范围和学科筛选测验数据
    const getFilteredQuizData = () => {
        const now = new Date();
        let timeLimit;

        switch (timeframe) {
            case 'week':
                timeLimit = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                timeLimit = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                timeLimit = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                timeLimit = new Date(0); // 无时间限制
        }

        return quizData.filter(quiz => {
            const quizDate = new Date(quiz.created_at);
            const subjectMatch = subjectFilter === 'all' || quiz.courses?.subject === subjectFilter;

            return quizDate >= timeLimit && subjectMatch;
        });
    };

    // 准备图表数据
    const prepareScoreChartData = () => {
        const filteredData = getFilteredQuizData();

        // 按日期分组并计算平均分
        const groupedData = filteredData.reduce((result, quiz) => {
            const date = new Date(quiz.created_at).toLocaleDateString();

            if (!result[date]) {
                result[date] = { date, scores: [], average: 0 };
            }

            result[date].scores.push(quiz.score);
            result[date].average = result[date].scores.reduce((a, b) => a + b, 0) / result[date].scores.length;

            return result;
        }, {});

        // 转换为数组并排序
        return Object.values(groupedData)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(item => ({
                date: item.date,
                score: parseFloat(item.average.toFixed(1))
            }));
    };

    // 准备学科分布图表数据
    const prepareSubjectDistributionData = () => {
        const subjects = {};

        quizData.forEach(quiz => {
            const subject = quiz.courses?.subject || '未知';

            if (!subjects[subject]) {
                subjects[subject] = 0;
            }

            subjects[subject]++;
        });

        return Object.entries(subjects).map(([name, value]) => ({ name, value }));
    };

    // 准备课程进度图表数据
    const prepareCourseProgressData = () => {
        return progressData
            .filter(p => p.courses) // 确保有课程数据
            .map(p => ({
                name: p.courses.title.length > 15 ? p.courses.title.substring(0, 15) + '...' : p.courses.title,
                progress: p.progress_percentage
            }))
            .sort((a, b) => b.progress - a.progress) // 按进度降序排序
            .slice(0, 5); // 只取前5个
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

    // 准备图表数据
    const scoreChartData = prepareScoreChartData();
    const subjectDistributionData = prepareSubjectDistributionData();
    const courseProgressData = prepareCourseProgressData();

    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">学习分析</h1>
                <p className="text-gray-600 mt-2">查看您的学习进度和表现</p>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            ) : (
                <>
                    {/* 筛选器 */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                                    时间范围
                                </label>
                                <select
                                    id="timeframe"
                                    value={timeframe}
                                    onChange={(e) => setTimeframe(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="week">最近一周</option>
                                    <option value="month">最近一个月</option>
                                    <option value="year">最近一年</option>
                                    <option value="all">全部时间</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    科目
                                </label>
                                <select
                                    id="subject"
                                    value={subjectFilter}
                                    onChange={(e) => setSubjectFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="all">所有科目</option>
                                    {subjectOptions.slice(1).map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {quizData.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
                            <p>暂无学习数据。完成一些测验和课程后再来查看您的学习分析。</p>
                        </div>
                    ) : (
                        <>
                            {/* 统计卡片 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center">
                                        <div className="rounded-full p-3 bg-blue-100 text-blue-600 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">已完成测验</p>
                                            <p className="text-2xl font-bold">{statsData.totalQuizzes}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center">
                                        <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">平均分数</p>
                                            <p className="text-2xl font-bold">{statsData.averageScore}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center">
                                        <div className="rounded-full p-3 bg-purple-100 text-purple-600 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">学习时长</p>
                                            <p className="text-2xl font-bold">{statsData.totalHours} 小时</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center">
                                        <div className="rounded-full p-3 bg-yellow-100 text-yellow-600 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">已完成课程</p>
                                            <p className="text-2xl font-bold">{statsData.completedCourses}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 强弱分析 */}
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                <h2 className="text-xl font-bold mb-4">学科强弱分析</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="font-bold text-green-800 mb-2">强项学科</h3>
                                        <p className="text-2xl font-bold text-green-600">{statsData.strongestSubject || '暂无数据'}</p>
                                        <p className="text-sm text-green-700 mt-1">继续保持，您在这个学科上表现优秀！</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <h3 className="font-bold text-red-800 mb-2">待提高学科</h3>
                                        <p className="text-2xl font-bold text-red-600">{statsData.weakestSubject || '暂无数据'}</p>
                                        <p className="text-sm text-red-700 mt-1">多花些时间在这个学科上，您可以取得很大进步！</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* 分数趋势图 */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-bold mb-4">分数趋势</h2>
                                    <div className="h-80">
                                        {scoreChartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={scoreChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis domain={[0, 100]} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="score"
                                                        stroke="#8884d8"
                                                        activeDot={{ r: 8 }}
                                                        name="平均分数"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-500">
                                                没有符合筛选条件的数据
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 学科分布图 */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-bold mb-4">学科分布</h2>
                                    <div className="h-80">
                                        {subjectDistributionData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={subjectDistributionData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        nameKey="name"
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {subjectDistributionData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => [`${value} 次测验`, '数量']} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-500">
                                                暂无学科分布数据
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 课程进度图 */}
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                <h2 className="text-xl font-bold mb-4">课程进度</h2>
                                <div className="h-80">
                                    {courseProgressData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={courseProgressData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={150} />
                                                <Tooltip formatter={(value) => [`${value}%`, '完成度']} />
                                                <Legend />
                                                <Bar dataKey="progress" name="完成百分比" fill="#82ca9d" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500">
                                            暂无课程进度数据
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </MainLayout>
    );
}