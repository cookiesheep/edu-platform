'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function LearningPathGenerator({ userId, subject }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [learningPath, setLearningPath] = useState(null);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // 在实际应用中，这个函数会调用后端API来生成学习路径
    // 这里我们使用模拟数据来演示UI
    const generateLearningPath = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock data based on subject
            let mockPath;

            if (subject === '数学') {
                mockPath = {
                    subject: '数学',
                    level: '高中',
                    weakAreas: ['三角函数', '微积分'],
                    strengths: ['代数', '几何'],
                    recommendedTopics: [
                        { id: 1, name: '三角函数基础', priority: 'high', status: 'not_started', estimatedHours: 3 },
                        { id: 2, name: '三角恒等变换', priority: 'high', status: 'not_started', estimatedHours: 2 },
                        { id: 3, name: '导数概念', priority: 'medium', status: 'not_started', estimatedHours: 4 },
                        { id: 4, name: '导数应用', priority: 'medium', status: 'not_started', estimatedHours: 3 },
                        { id: 5, name: '几何证明进阶', priority: 'low', status: 'not_started', estimatedHours: 2 }
                    ],
                    recommendedResources: [
                        { id: 1, title: '三角函数专题讲解', type: 'video', link: '#' },
                        { id: 2, title: '微积分入门课程', type: 'course', link: '#' },
                        { id: 3, title: '数学竞赛题集', type: 'practice', link: '#' }
                    ],
                    estimatedCompletionDays: 14
                };
            } else if (subject === '物理') {
                mockPath = {
                    subject: '物理',
                    level: '高中',
                    weakAreas: ['电磁学', '量子力学'],
                    strengths: ['力学', '热学'],
                    recommendedTopics: [
                        { id: 1, name: '电场与电势', priority: 'high', status: 'not_started', estimatedHours: 4 },
                        { id: 2, name: '磁场与电流', priority: 'high', status: 'not_started', estimatedHours: 3 },
                        { id: 3, name: '量子力学初步', priority: 'medium', status: 'not_started', estimatedHours: 5 },
                        { id: 4, name: '力学综合应用', priority: 'low', status: 'not_started', estimatedHours: 2 }
                    ],
                    recommendedResources: [
                        { id: 1, title: '电磁学详解', type: 'video', link: '#' },
                        { id: 2, title: '物理实验指南', type: 'resource', link: '#' },
                        { id: 3, title: '高考物理模拟题', type: 'practice', link: '#' }
                    ],
                    estimatedCompletionDays: 12
                };
            } else {
                mockPath = {
                    subject: subject || '综合',
                    level: '高中',
                    weakAreas: ['需要更多数据'],
                    strengths: ['需要更多数据'],
                    recommendedTopics: [
                        { id: 1, name: '基础知识巩固', priority: 'high', status: 'not_started', estimatedHours: 3 },
                        { id: 2, name: '进阶概念学习', priority: 'medium', status: 'not_started', estimatedHours: 4 },
                        { id: 3, name: '综合能力提升', priority: 'medium', status: 'not_started', estimatedHours: 5 }
                    ],
                    recommendedResources: [
                        { id: 1, title: '学科基础教程', type: 'course', link: '#' },
                        { id: 2, title: '重点习题精讲', type: 'video', link: '#' }
                    ],
                    estimatedCompletionDays: 10
                };
            }

            setLearningPath(mockPath);
        } catch (err) {
            console.error('Error generating learning path:', err);
            setError('生成学习路径时出错，请稍后再试。');
        } finally {
            setIsGenerating(false);
        }
    };

    // 自动生成学习路径（只在组件第一次加载时）
    useEffect(() => {
        if (userId && subject && !learningPath && !isGenerating) {
            generateLearningPath();
        }
    }, [userId, subject]);

    const markTopicAsStarted = (topicId) => {
        setLearningPath(prev => ({
            ...prev,
            recommendedTopics: prev.recommendedTopics.map(topic =>
                topic.id === topicId ? { ...topic, status: 'in_progress' } : topic
            )
        }));
    };

    const markTopicAsCompleted = (topicId) => {
        setLearningPath(prev => ({
            ...prev,
            recommendedTopics: prev.recommendedTopics.map(topic =>
                topic.id === topicId ? { ...topic, status: 'completed' } : topic
            )
        }));
    };

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
                <p className="font-medium">生成学习路径时出错</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                    onClick={generateLearningPath}
                    className="mt-2 text-sm text-red-800 font-medium underline"
                >
                    重试
                </button>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    <div>
                        <h3 className="font-medium text-gray-900">正在生成个性化学习路径</h3>
                        <p className="text-sm text-gray-500">
                            我们的AI正在分析您的学习数据，生成最适合您的学习计划...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!learningPath) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">还没有学习路径</h3>
                    <p className="mt-1 text-gray-500">生成个性化学习路径，帮助您更高效地学习。</p>
                    <button
                        onClick={generateLearningPath}
                        className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                        生成学习路径
                    </button>
                </div>
            </div>
        );
    }

    // 已生成学习路径，显示结果
    // 计算进度
    const totalTopics = learningPath.recommendedTopics.length;
    const completedTopics = learningPath.recommendedTopics.filter(topic => topic.status === 'completed').length;
    const inProgressTopics = learningPath.recommendedTopics.filter(topic => topic.status === 'in_progress').length;
    const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-600 p-4 text-white">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{learningPath.subject} 个性化学习路径</h3>
                    <button
                        onClick={() => generateLearningPath()}
                        className="text-white text-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        重新生成
                    </button>
                </div>
            </div>

            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-2 mb-2">
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            级别: {learningPath.level}
          </span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            预计完成: {learningPath.estimatedCompletionDays}天
          </span>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">学习进度</span>
                        <span className="font-medium">{completedTopics}/{totalTopics} 主题</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">学习分析</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">需要提高的领域</h5>
                        <ul className="space-y-1">
                            {learningPath.weakAreas.map((area, index) => (
                                <li key={index} className="text-sm flex items-center text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">擅长的领域</h5>
                        <ul className="space-y-1">
                            {learningPath.strengths.map((strength, index) => (
                                <li key={index} className="text-sm flex items-center text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">推荐学习主题</h4>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                    >
                        {expanded ? '收起' : '显示全部'}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${
                            expanded ? 'transform rotate-180' : ''
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    {learningPath.recommendedTopics
                        .slice(0, expanded ? learningPath.recommendedTopics.length : 3)
                        .map(topic => {
                            // Determine the status styles
                            let statusBg, statusText, statusIcon;
                            if (topic.status === 'completed') {
                                statusBg = 'bg-green-100';
                                statusText = '已完成';
                                statusIcon = (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                );
                            } else if (topic.status === 'in_progress') {
                                statusBg = 'bg-blue-100';
                                statusText = '进行中';
                                statusIcon = (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                );
                            } else {
                                statusBg = 'bg-gray-100';
                                statusText = '未开始';
                                statusIcon = (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                );
                            }

                            // Determine priority styles
                            let priorityColor;
                            if (topic.priority === 'high') {
                                priorityColor = 'text-red-600';
                            } else if (topic.priority === 'medium') {
                                priorityColor = 'text-yellow-600';
                            } else {
                                priorityColor = 'text-green-600';
                            }

                            return (
                                <div key={topic.id} className="bg-gray-50 rounded-md p-3 border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center">
                                                <h5 className="font-medium text-gray-800">{topic.name}</h5>
                                                <span className={`ml-2 text-xs ${priorityColor}`}>
                          {topic.priority === 'high' ? '高优先级' : topic.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                                            </div>
                                            <p className="text-sm text-gray-500">预计学习时间: {topic.estimatedHours} 小时</p>
                                        </div>
                                        <div className={`flex items-center ${statusBg} px-2 py-1 rounded-full`}>
                                            {statusIcon}
                                            <span className="text-xs ml-1">{statusText}</span>
                                        </div>
                                    </div>

                                    <div className="flex mt-2 space-x-2">
                                        {topic.status === 'not_started' && (
                                            <button
                                                onClick={() => markTopicAsStarted(topic.id)}
                                                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                开始学习
                                            </button>
                                        )}

                                        {topic.status === 'in_progress' && (
                                            <button
                                                onClick={() => markTopicAsCompleted(topic.id)}
                                                className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                标记为已完成
                                            </button>
                                        )}

                                        <button
                                            className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                        >
                                            查看详情
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {!expanded && learningPath.recommendedTopics.length > 3 && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="w-full mt-3 text-center text-sm text-primary-600 hover:text-primary-800"
                    >
                        查看全部 {learningPath.recommendedTopics.length} 个主题
                    </button>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">推荐资源</h4>
                <div className="space-y-2">
                    {learningPath.recommendedResources.map(resource => (
                        <div key={resource.id} className="flex items-center text-sm">
                            {resource.type === 'video' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}

                            {resource.type === 'course' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            )}

                            {resource.type === 'practice' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            )}

                            {resource.type === 'resource' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            )}

                            <a href={resource.link} className="text-primary-600 hover:text-primary-800">
                                {resource.title}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}