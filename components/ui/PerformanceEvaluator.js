import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { fetchAssessment } from '@/lib/api';

// 线性图表组件
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const PerformanceEvaluator = ({ subjectId, period = 'month' }) => {
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser(); // 获取当前登录用户

    useEffect(() => {
        // 如果用户已登录且有科目ID，获取评估
        if (user && subjectId) {
            const loadAssessment = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const result = await fetchAssessment(user.id, subjectId, period);
                    setAssessment(result.assessment);
                } catch (err) {
                    console.error('获取成绩评估时出错:', err);
                    setError('无法加载成绩评估。请稍后再试。');
                } finally {
                    setLoading(false);
                }
            };

            loadAssessment();
        }
    }, [user, subjectId, period]);

    // 加载状态
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        );
    }

    // 无数据状态
    if (!assessment) {
        return (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <p>暂无评估数据。请继续学习和完成测验，以获取成绩评估。</p>
            </div>
        );
    }

    // 渲染评估结果
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 总体评估 */}
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold mb-4">总体表现</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">总分</p>
                        <p className="text-3xl font-bold">{assessment.overall.score}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">进步</p>
                        <p className="text-3xl font-bold">{assessment.overall.improvement > 0 ? '+' : ''}{assessment.overall.improvement}%</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">排名</p>
                        <p className="text-3xl font-bold">{assessment.overall.rank}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">百分位</p>
                        <p className="text-3xl font-bold">{assessment.overall.percentile}%</p>
                    </div>
                </div>
            </div>

            {/* 技能评估 */}
            {assessment.skills && assessment.skills.length > 0 && (
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold mb-4">技能评估</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={assessment.skills}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    name="分数"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* 主题掌握度 */}
            {assessment.topics && assessment.topics.length > 0 && (
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold mb-4">主题掌握度</h2>
                    <div className="space-y-4">
                        {assessment.topics.map((topic, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">{topic.name}</span>
                                    <span>{topic.mastery}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${topic.mastery}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 优势和劣势 */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 优势 */}
                {assessment.strengths && assessment.strengths.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-green-600">优势</h2>
                        <ul className="space-y-2">
                            {assessment.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="bg-green-100 text-green-800 p-1 rounded mr-2">✓</span>
                                    <div>
                                        <p className="font-bold">{strength.topic}</p>
                                        <p className="text-sm text-gray-600">{strength.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 劣势 */}
                {assessment.weaknesses && assessment.weaknesses.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-red-600">需要改进的地方</h2>
                        <ul className="space-y-2">
                            {assessment.weaknesses.map((weakness, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="bg-red-100 text-red-800 p-1 rounded mr-2">!</span>
                                    <div>
                                        <p className="font-bold">{weakness.topic}</p>
                                        <p className="text-sm text-gray-600">{weakness.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 学习建议 */}
            {assessment.recommendations && assessment.recommendations.length > 0 && (
                <div className="p-6 bg-gray-50">
                    <h2 className="text-xl font-bold mb-4">学习建议</h2>
                    <ul className="space-y-4">
                        {assessment.recommendations.map((recommendation, index) => (
                            <li key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        {recommendation.type === 'resource' ? '📚' : '✏️'}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-bold">{recommendation.title}</h3>
                                        {recommendation.link && (
                                            <a
                                                href={recommendation.link}
                                                className="text-blue-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                查看资源
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PerformanceEvaluator;