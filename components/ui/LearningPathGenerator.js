import React, { useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { generateLearningPath } from '@/lib/api';

// 科目选项，可根据您的需求修改
const SUBJECTS = [
    { id: 'math', name: '数学' },
    { id: 'physics', name: '物理' },
    { id: 'chemistry', name: '化学' },
    { id: 'biology', name: '生物' },
    { id: 'chinese', name: '语文' },
    { id: 'english', name: '英语' },
];

// 当前水平选项
const LEVELS = [
    { id: 'elementary', name: '小学' },
    { id: 'junior_high', name: '初中' },
    { id: 'high_school_1', name: '高中一年级' },
    { id: 'high_school_2', name: '高中二年级' },
    { id: 'high_school_3', name: '高中三年级' },
];

const LearningPathGenerator = () => {
    const user = useUser(); // 获取当前登录用户
    const supabase = useSupabaseClient(); // Supabase客户端实例

    // 状态变量
    const [subject, setSubject] = useState('');
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');
    const [currentLevel, setCurrentLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [learningPath, setLearningPath] = useState(null);

    // 处理生成学习路径
    const handleGeneratePath = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('请先登录后再生成学习路径');
            return;
        }

        if (!subject || !goal) {
            setError('请填写科目和学习目标');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setLearningPath(null);

            // 调用API生成学习路径
            const response = await generateLearningPath(
                user.id,
                subject,
                goal,
                deadline,
                currentLevel
            );

            setLearningPath(response.learningPath);
        } catch (err) {
            console.error('生成学习路径时出错:', err);
            setError('生成学习路径失败。请稍后再试。');
        } finally {
            setLoading(false);
        }
    };

    // 获取今天的日期（用于日期选择器的min属性）
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {!learningPath ? (
                // 学习路径生成表单
                <form onSubmit={handleGeneratePath} className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">生成个性化学习路径</h2>

                    {/* 科目选择 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            科目
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">选择科目</option>
                            {SUBJECTS.map((subj) => (
                                <option key={subj.id} value={subj.id}>
                                    {subj.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 学习目标 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            学习目标
                        </label>
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="例如: 提高高考数学成绩到120分"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* 截止日期 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            目标截止日期 (可选)
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            min={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 当前水平 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            当前学习水平 (可选)
                        </label>
                        <select
                            value={currentLevel}
                            onChange={(e) => setCurrentLevel(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">选择当前水平</option>
                            {LEVELS.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 错误提示 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* 提交按钮 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? '正在生成...' : '生成学习路径'}
                    </button>
                </form>
            ) : (
                // 学习路径显示
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {SUBJECTS.find(s => s.id === subject)?.name || '科目'} 学习路径
                        </h2>
                        <button
                            onClick={() => setLearningPath(null)}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            重新设置
                        </button>
                    </div>

                    {/* 学习路径概览 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">概览</h3>
                        <p><span className="font-medium">科目:</span> {learningPath.subject}</p>
                        {learningPath.estimatedCompletionDays && (
                            <p><span className="font-medium">预计完成时间:</span> {learningPath.estimatedCompletionDays} 天</p>
                        )}
                    </div>

                    {/* 强项和弱项 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 强项 */}
                        {learningPath.strengths && learningPath.strengths.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-green-700">强项</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {learningPath.strengths.map((strength, index) => (
                                        <li key={index}>{strength}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 弱项 */}
                        {learningPath.weakAreas && learningPath.weakAreas.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-red-700">薄弱环节</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {learningPath.weakAreas.map((weakness, index) => (
                                        <li key={index}>{weakness}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* 推荐主题 */}
                    {learningPath.recommendedTopics && learningPath.recommendedTopics.length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">推荐学习主题</h3>
                            <div className="space-y-4">
                                {learningPath.recommendedTopics.map((topic, index) => (
                                    <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                                        <div className="flex justify-between">
                                            <h4 className="font-bold">{topic.name}</h4>
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                topic.priority === 'high'
                                                    ? 'bg-red-100 text-red-800'
                                                    : topic.priority === 'medium'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                            }`}>
                        {topic.priority === 'high'
                            ? '高优先级'
                            : topic.priority === 'medium'
                                ? '中优先级'
                                : '低优先级'}
                      </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            预计学习时间: {topic.estimatedHours} 小时
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 推荐资源 */}
                    {learningPath.recommendedResources && learningPath.recommendedResources.length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">推荐学习资源</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {learningPath.recommendedResources.map((resource, index) => (
                                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                {resource.type === 'practice' ? '📝' :
                                                    resource.type === 'video' ? '🎬' :
                                                        resource.type === 'book' ? '📚' : '🔗'}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-bold">{resource.title}</h4>
                                                <p className="text-sm text-gray-500">{
                                                    resource.type === 'practice' ? '练习' :
                                                        resource.type === 'video' ? '视频' :
                                                            resource.type === 'book' ? '书籍' : '资源'
                                                }</p>
                                                {resource.link && (
                                                    <a
                                                        href={resource.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                                                    >
                                                        查看资源
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 保存按钮 */}
                    <button
                        onClick={() => {
                            // 这里可以添加保存到个人收藏的逻辑
                            alert('学习路径已保存！');
                        }}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        保存学习路径
                    </button>
                </div>
            )}
        </div>
    );
};

export default LearningPathGenerator;