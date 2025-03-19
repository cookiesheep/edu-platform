'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell
} from 'recharts';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function AnalyticsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [selectedSubject, setSelectedSubject] = useState('all');

    // Sample data - in a real application, this would come from your API
    const [learningTimeData, setLearningTimeData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [subjectDistribution, setSubjectDistribution] = useState([]);
    const [strengthWeakness, setStrengthWeakness] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Get user session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login?redirect=/analytics');
                return;
            }
            setUser(session.user);

            // In a real app, fetch data from the API
            // For now, we'll use mock data

            // Mock learning time data
            const mockLearningTime = [
                { day: '周一', hours: 2.5 },
                { day: '周二', hours: 1.8 },
                { day: '周三', hours: 3.2 },
                { day: '周四', hours: 2.1 },
                { day: '周五', hours: 1.5 },
                { day: '周六', hours: 4.0 },
                { day: '周日', hours: 3.7 }
            ];
            setLearningTimeData(mockLearningTime);

            // Mock performance data
            const mockPerformance = [
                { subject: '数学', score: 85 },
                { subject: '物理', score: 78 },
                { subject: '化学', score: 92 },
                { subject: '英语', score: 65 },
                { subject: '生物', score: 73 }
            ];
            setPerformanceData(mockPerformance);

            // Mock subject distribution
            const mockDistribution = [
                { name: '数学', value: 35 },
                { name: '物理', value: 25 },
                { name: '化学', value: 20 },
                { name: '英语', value: 15 },
                { name: '其他', value: 5 }
            ];
            setSubjectDistribution(mockDistribution);

            // Mock strength/weakness data
            const mockStrengthWeakness = [
                { name: '代数', score: 92, status: 'strength' },
                { name: '几何', score: 85, status: 'strength' },
                { name: '统计', score: 78, status: 'neutral' },
                { name: '微积分', score: 65, status: 'weakness' },
                { name: '三角函数', score: 60, status: 'weakness' }
            ];
            setStrengthWeakness(mockStrengthWeakness);

            setLoading(false);
        }

        fetchData();
    }, [router]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">学习分析</h1>
                <p className="text-gray-600 mt-2">跟踪您的学习进度和表现，发现改进空间</p>
            </div>

            {/* Period & Subject Selector */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">时间段</label>
                        <select
                            id="period"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="week">本周</option>
                            <option value="month">本月</option>
                            <option value="quarter">本季度</option>
                            <option value="year">本年</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">科目</label>
                        <select
                            id="subject"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">全部科目</option>
                            <option value="math">数学</option>
                            <option value="physics">物理</option>
                            <option value="chemistry">化学</option>
                            <option value="english">英语</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Learning Time */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">学习时间统计</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={learningTimeData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis label={{ value: '小时', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="hours" stroke="#6366f1" activeDot={{ r: 8 }} name="学习时间" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Performance by Subject */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">科目表现</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={performanceData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" name="分数" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">学习时间分布</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subjectDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {subjectDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">强项与弱项</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-medium mb-4">强项</h3>
                        <div className="space-y-4">
                            {strengthWeakness
                                .filter(item => item.status === 'strength')
                                .map((item, index) => (
                                    <div key={index} className="bg-green-50 p-4 rounded-md">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-green-800">{item.name}</span>
                                            <span className="font-bold text-green-800">{item.score}分</span>
                                        </div>
                                        <div className="w-full bg-green-200 rounded-full h-2.5">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full"
                                                style={{ width: `${item.score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">需提高</h3>
                        <div className="space-y-4">
                            {strengthWeakness
                                .filter(item => item.status === 'weakness')
                                .map((item, index) => (
                                    <div key={index} className="bg-red-50 p-4 rounded-md">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-red-800">{item.name}</span>
                                            <span className="font-bold text-red-800">{item.score}分</span>
                                        </div>
                                        <div className="w-full bg-red-200 rounded-full h-2.5">
                                            <div
                                                className="bg-red-600 h-2.5 rounded-full"
                                                style={{ width: `${item.score}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>建议: 多做 {item.name} 相关的练习，重点关注基础概念</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">AI 学习建议</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>根据你的学习数据分析，我们有以下建议：</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>你在<strong>代数</strong>和<strong>几何</strong>方面表现出色，可以尝试更具挑战性的题目</li>
                                <li>建议增加<strong>微积分</strong>和<strong>三角函数</strong>的学习时间，并关注基础概念</li>
                                <li>你的学习时间主要集中在周末，建议平均分配到每天，提高学习效率</li>
                                <li>英语是你相对薄弱的科目，可以每天花30分钟进行词汇和语法练习</li>
                            </ul>
                            <p className="bg-primary-50 p-4 rounded-md mt-4 text-primary-800">
                                <strong>个性化学习路径：</strong> 基于你的表现，系统已为你生成个性化的学习路径，重点关注薄弱环节，同时保持强项。查看<a href="#" className="font-medium text-primary-600 hover:text-primary-800">详细学习计划</a>。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}