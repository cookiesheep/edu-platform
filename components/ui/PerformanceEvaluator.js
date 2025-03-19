'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    BarChart,
    Bar
} from 'recharts';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function PerformanceEvaluator({ userId, subject, period = 'month' }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        async function fetchPerformanceData() {
            setLoading(true);
            setError(null);

            try {
                // 在真实应用中，这里应该调用API获取实际的性能数据
                // 这里我们使用模拟数据进行演示

                // 模拟API延迟
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 生成模拟数据
                let mockData;

                if (subject === '数学') {
                    mockData = {
                        overall: {
                            currentScore: 85,
                            previousScore: 78,
                            improvement: 7,
                            rank: 12,
                            totalStudents: 120,
                            percentile: 90
                        },
                        skills: [
                            { name: '代数能力', score: 85, fullMark: 100 },
                            { name: '几何能力', score: 90, fullMark: 100 },
                            { name: '计算能力', score: 75, fullMark: 100 },
                            { name: '解题能力', score: 82, fullMark: 100 },
                            { name: '逻辑推理', score: 88, fullMark: 100 }
                        ],
                        topics: [
                            { name: '函数', mastery: 92 },
                            { name: '三角函数', mastery: 85 },
                            { name: '数列', mastery: 78 },
                            { name: '概率统计', mastery: 65 },
                            { name: '立体几何', mastery: 70 },
                            { name: '解析几何', mastery: 88 }
                        ],
                        progress: [
                            { month: '1月', score: 70 },
                            { month: '2月', score: 72 },
                            { month: '3月', score: 78 },
                            { month: '4月', score: 76 },
                            { month: '5月', score: 82 },
                            { month: '6月', score: 85 }
                        ],
                        weaknesses: [
                            { id: 1, topic: '概率统计', description: '在条件概率和贝叶斯定理的应用上需要改进' },
                            { id: 2, topic: '立体几何', description: '在空间想象和体积计算上有提升空间' }
                        ],
                        strengths: [
                            { id: 1, topic: '函数', description: '对函数概念和性质掌握得很好' },
                            { id: 2, topic: '解析几何', description: '能够熟练应用坐标系和方程解决几何问题' }
                        ],
                        recommendations: [
                            { id: 1, type: 'resource', title: '概率统计专项练习', link: '#' },
                            { id: 2, type: 'course', title: '立体几何强化课程', link: '#' },
                            { id: 3, type: 'practice', title: '每日数学题集', link: '#' }
                        ]
                    };
                } else if (subject === '物理') {
                    mockData = {
                        overall: {
                            currentScore: 82,
                            previousScore: 75,
                            improvement: 7,
                            rank: 15,
                            totalStudents: 120,
                            percentile: 87
                        },
                        skills: [
                            { name: '力学分析', score: 88, fullMark: 100 },
                            { name: '电磁学', score: 75, fullMark: 100 },
                            { name: '热学', score: 82, fullMark: 100 },
                            { name: '实验能力', score: 85, fullMark: 100 },
                            { name: '计算能力', score: 80, fullMark: 100 }
                        ],
                        topics: [
                            { name: '牛顿力学', mastery: 95 },
                            { name: '电磁学', mastery: 75 },
                            { name: '热力学', mastery: 82 },
                            { name: '光学', mastery: 78 },
                            { name: '近代物理', mastery: 65 }
                        ],
                        progress: [
                            { month: '1月', score: 68 },
                            { month: '2月', score: 70 },
                            { month: '3月', score: 73 },
                            { month: '4月', score: 76 },
                            { month: '5月', score: 79 },
                            { month: '6月', score: 82 }
                        ],
                        weaknesses: [
                            { id: 1, topic: '电磁学', description: '对电磁感应和电磁波理解不够深入' },
                            { id: 2, topic: '近代物理', description: '量子力学基础概念理解有困难' }
                        ],
                        strengths: [
                            { id: 1, topic: '牛顿力学', description: '力学分析能力很强，能够解决复杂的力学问题' },
                            { id: 2, topic: '热力学', description: '对热力学定律的理解和应用较好' }
                        ],
                        recommendations: [
                            { id: 1, type: 'resource', title: '电磁学精讲', link: '#' },
                            { id: 2, type: 'course', title: '近代物理入门', link: '#' },
                            { id: 3, type: 'practice', title: '物理实验模拟', link: '#' }
                        ]
                    };
                } else {
                    // 默认数据
                    mockData = {
                        overall: {
                            currentScore: 80,
                            previousScore: 75,
                            improvement: 5,
                            rank: 20,
                            totalStudents: 120,
                            percentile: 83
                        },
                        skills: [
                            { name: '基础知识', score: 85, fullMark: 100 },
                            { name: '应用能力', score: 80, fullMark: 100 },
                            { name: '分析能力', score: 75, fullMark: 100 },
                            { name: '表达能力', score: 78, fullMark: 100 },
                            { name: '创新能力', score: 70, fullMark: 100 }
                        ],
                        topics: [
                            { name: '主题一', mastery: 85 },
                            { name: '主题二', mastery: 75 },
                            { name: '主题三', mastery: 80 },
                            { name: '主题四', mastery: 70 },
                            { name: '主题五', mastery: 65 }
                        ],
                        progress: [
                            { month: '1月', score: 70 },
                            { month: '2月', score: 72 },
                            { month: '3月', score: 75 },
                            { month: '4月', score: 77 },
                            { month: '5月', score: 78 },
                            { month: '6月', score: 80 }
                        ],
                        weaknesses: [
                            { id: 1, topic: '主题四', description: '需要加强练习和理解' },
                            { id: 2, topic: '主题五', description: '基础较弱，需要重点复习' }
                        ],
                        strengths: [
                            { id: 1, topic: '主题一', description: '掌握得很好，可以进行提高训练' },
                            { id: 2, topic: '主题三', description: '理解深入，应用能力强' }
                        ],
                        recommendations: [
                            { id: 1, type: 'resource', title: '推荐资源一', link: '#' },
                            { id: 2, type: 'course', title: '推荐课程', link: '#' },
                            { id: 3, type: 'practice', title: '推荐练习', link: '#' }
                        ]
                    };
                }

                setPerformanceData(mockData);
            } catch (err) {
                console.error('Error fetching performance data:', err);
                setError('获取成绩数据时出错，请稍后再试。');
            } finally {
                setLoading(false);
            }
        }

        fetchPerformanceData();
    }, [userId, subject, period]);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    <div>
                        <h3 className="font-medium text-gray-900">正在分析学习成绩</h3>
                        <p className="text-sm text-gray-500">
                            我们正在评估您的学习情况，生成详细报告...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
                <p className="font-medium">获取成绩数据时出错</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    if (!performanceData) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">暂无成绩数据</h3>
                    <p className="mt-1 text-gray-500">当您完成更多课程和练习后，将会生成详细的成绩分析。</p>
                </div>
            </div>
        );
    }

    // 渲染成绩概览
    const renderOverview = () => {
        const { overall, skills } = performanceData;

        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">总评分</h4>
                        <div className="flex items-end">
                            <span className="text-3xl font-bold text-gray-900">{overall.currentScore}</span>
                            <span className="text-sm text-gray-500 ml-2">/ 100</span>

                            {overall.improvement > 0 && (
                                <span className="ml-auto flex items-center text-green-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +{overall.improvement}
                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">排名</h4>
                        <div className="flex items-end">
                            <span className="text-3xl font-bold text-gray-900">{overall.rank}</span>
                            <span className="text-sm text-gray-500 ml-2">/ {overall.totalStudents}</span>
                            <span className="ml-auto text-sm text-gray-600">前 {overall.percentile}%</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">学习进度</h4>
                        <div className="text-3xl font-bold text-gray-900">
                            {Math.round((performanceData.progress[performanceData.progress.length - 1].score - performanceData.progress[0].score) / performanceData.progress[0].score * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">较起始水平</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="font-medium text-gray-900 mb-4">能力雷达图</h4>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar
                                        name="能力水平"
                                        dataKey="score"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="font-medium text-gray-900 mb-4">学习进度</h4>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={performanceData.progress}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        name="分数"
                                        stroke="#6366f1"
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="font-medium text-gray-900 mb-4">优势</h4>
                        <div className="space-y-4">
                            {performanceData.strengths.map(strength => (
                                <div key={strength.id} className="bg-green-50 p-4 rounded-md">
                                    <h5 className="font-medium text-green-800 mb-1">{strength.topic}</h5>
                                    <p className="text-sm text-green-700">{strength.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="font-medium text-gray-900 mb-4">需要提高</h4>
                        <div className="space-y-4">
                            {performanceData.weaknesses.map(weakness => (
                                <div key={weakness.id} className="bg-red-50 p-4 rounded-md">
                                    <h5 className="font-medium text-red-800 mb-1">{weakness.topic}</h5>
                                    <p className="text-sm text-red-700">{weakness.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 渲染主题掌握度
    const renderTopics = () => {
        return (
            <div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h4 className="font-medium text-gray-900 mb-4">主题掌握度</h4>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={performanceData.topics}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="mastery"
                                    name="掌握度"
                                    fill="#6366f1"
                                    radius={[0, 4, 4, 0]}
                                    label={{ position: 'right', formatter: (value) => `${value}%` }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="font-medium text-gray-900 mb-4">强项主题</h4>
                        <div className="space-y-2">
                            {performanceData.topics
                                .sort((a, b) => b.mastery - a.mastery)
                                .slice(0, 3)
                                .map((topic, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border-b border-gray-100">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3 font-medium">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{topic.name}</span>
                                        </div>
                                        <div className="text-green-600 font-medium">{topic.mastery}%</div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h4 className="font-medium text-gray-900 mb-4">待提高主题</h4>
                        <div className="space-y-2">
                            {performanceData.topics
                                .sort((a, b) => a.mastery - b.mastery)
                                .slice(0, 3)
                                .map((topic, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border-b border-gray-100">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-3 font-medium">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{topic.name}</span>
                                        </div>
                                        <div className="text-red-600 font-medium">{topic.mastery}%</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 渲染学习建议
    const renderRecommendations = () => {
        return (
            <div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">AI 学习建议</h4>
                            <div className="space-y-4 text-gray-700">
                                <p>根据您的学习数据分析，我们为您提供以下个性化建议：</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    {performanceData.weaknesses.map(weakness => (
                                        <li key={weakness.id}>
                                            加强<strong>{weakness.topic}</strong>的学习: {weakness.description}
                                        </li>
                                    ))}
                                    <li>继续保持您在<strong>{performanceData.strengths[0]?.topic}</strong>方面的优势</li>
                                    <li>每天坚持学习，保持稳定的学习节奏</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-medium text-gray-900 mb-4">推荐资源</h4>
                    <div className="space-y-4">
                        {performanceData.recommendations.map(rec => (
                            <div key={rec.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <div className="flex items-start">
                                    {rec.type === 'resource' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    )}

                                    {rec.type === 'course' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                    )}

                                    {rec.type === 'practice' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    )}

                                    <div>
                                        <a href={rec.link} className="font-medium text-primary-600 hover:text-primary-800">
                                            {rec.title}
                                        </a>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {rec.type === 'resource' && '学习资源'}
                                            {rec.type === 'course' && '在线课程'}
                                            {rec.type === 'practice' && '练习题集'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-600 p-4 text-white">
                <h3 className="font-bold text-lg">{subject || '学习'} 成绩评估</h3>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-6 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        概览
                    </button>
                    <button
                        onClick={() => setActiveTab('topics')}
                        className={`py-4 px-6 font-medium text-sm ${
                            activeTab === 'topics'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        主题掌握
                    </button>
                    <button
                        onClick={() => setActiveTab('recommendations')}
                        className={`py-4 px-6 font-medium text-sm ${
                            activeTab === 'recommendations'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        学习建议
                    </button>
                </nav>
            </div>

            <div className="p-6">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'topics' && renderTopics()}
                {activeTab === 'recommendations' && renderRecommendations()}
            </div>
        </div>
    );
}