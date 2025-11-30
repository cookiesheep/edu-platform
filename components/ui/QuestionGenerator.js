import React, { useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { generateQuestions, submitQuizAttempt } from '@/lib/api';

// 科目选项，可根据您的需求修改
const SUBJECTS = [
    { id: 'math', name: '数学' },
    { id: 'physics', name: '物理' },
    { id: 'chemistry', name: '化学' },
    { id: 'biology', name: '生物' },
    { id: 'chinese', name: '语文' },
    { id: 'english', name: '英语' },
];

// 难度级别选项
const DIFFICULTY_LEVELS = [
    { id: 'easy', name: '简单' },
    { id: 'medium', name: '中等' },
    { id: 'hard', name: '困难' },
];

const QuestionGenerator = ({ onComplete }) => {
    const user = useUser(); // 获取当前登录用户
    const supabase = useSupabaseClient(); // Supabase客户端实例

    // 状态变量
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [topics, setTopics] = useState('');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    // 处理生成试题
    const handleGenerateQuestions = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('请先登录后再生成试题');
            return;
        }

        if (!subject) {
            setError('请选择科目');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setQuestions(null);
            setAnswers({});
            setResult(null);

            // 将主题字符串转换为数组
            const topicsArray = topics
                ? topics.split(',').map(topic => topic.trim())
                : [];

            // 调用API生成试题
            const response = await generateQuestions(
                user.id,
                subject,
                difficulty,
                count,
                topicsArray
            );

            setQuestions(response.questions);
        } catch (err) {
            console.error('生成试题时出错:', err);
            setError('生成试题失败。请稍后再试。');
        } finally {
            setLoading(false);
        }
    };

    // 处理答案变更
    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // 提交答案
    const handleSubmit = async () => {
        if (!user || !questions || Object.keys(answers).length === 0) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // 准备答案数据
            const answersData = Object.keys(answers).map(questionId => ({
                questionId,
                userAnswer: answers[questionId],
                // 查找对应问题的正确答案
                correctAnswer: questions.find(q => q.id === questionId)?.correctAnswer
            }));

            // 计算得分
            const correctCount = answersData.filter(
                a => a.userAnswer === a.correctAnswer
            ).length;
            const score = (correctCount / answersData.length) * 100;

            // 保存到数据库
            const { error: dbError } = await supabase
                .from('quiz_attempts')
                .insert({
                    user_id: user.id,
                    course_id: subject, // 使用科目作为课程ID
                    answers: answersData,
                    score,
                    max_score: 100
                });

            if (dbError) {
                throw new Error(dbError.message);
            }

            // 设置结果
            setResult({
                score,
                total: answersData.length,
                correct: correctCount
            });

            // 如果有回调函数，调用它
            if (onComplete) {
                onComplete({
                    score,
                    subject,
                    difficulty,
                    questionsCount: answersData.length
                });
            }
        } catch (err) {
            console.error('提交答案时出错:', err);
            setError('提交答案失败。请稍后再试。');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 重置所有
    const handleReset = () => {
        setQuestions(null);
        setAnswers({});
        setResult(null);
        setError(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* 试题生成表单 */}
            {!questions && (
                <form onSubmit={handleGenerateQuestions} className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">生成练习题</h2>

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

                    {/* 难度选择 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            难度
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            {DIFFICULTY_LEVELS.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 主题 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            主题 (可选，用逗号分隔)
                        </label>
                        <input
                            type="text"
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            placeholder="例如: 函数, 三角函数"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 题目数量 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            题目数量
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
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
                        {loading ? '正在生成...' : '生成试题'}
                    </button>
                </form>
            )}

            {/* 试题显示和作答 */}
            {questions && !result && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {SUBJECTS.find(s => s.id === subject)?.name || '练习'} -
                            {DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.name || ''}
                        </h2>
                        <button
                            onClick={handleReset}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            重新设置
                        </button>
                    </div>

                    {/* 题目列表 */}
                    <div className="space-y-8">
                        {questions.map((question, index) => (
                            <div key={question.id} className="border p-4 rounded-lg">
                                <p className="font-bold mb-2">
                                    {index + 1}. {question.stem}
                                </p>

                                {/* 选择题 */}
                                {question.type === 'multiple-choice' && (
                                    <div className="space-y-2 ml-4">
                                        {question.options.map((option, optIndex) => (
                                            <div key={optIndex} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`q${index}-opt${optIndex}`}
                                                    name={`question-${question.id}`}
                                                    value={option.substring(0, 1)} // 假设选项格式为 "A. 选项内容"
                                                    checked={answers[question.id] === option.substring(0, 1)}
                                                    onChange={() => handleAnswerChange(question.id, option.substring(0, 1))}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`q${index}-opt${optIndex}`}
                                                    className="ml-2 block text-gray-700"
                                                >
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 填空题 */}
                                {question.type === 'fill-in-blank' && (
                                    <div className="ml-4">
                                        <input
                                            type="text"
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            placeholder="请输入答案"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 提交按钮 */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isSubmitting || Object.keys(answers).length !== questions.length
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        {isSubmitting ? '正在提交...' : '提交答案'}
                    </button>

                    {Object.keys(answers).length !== questions.length && (
                        <p className="text-sm text-red-600 text-center">
                            请回答所有问题后再提交
                        </p>
                    )}
                </div>
            )}

            {/* 结果显示 */}
            {result && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">测验结果</h2>

                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <p className="text-4xl font-bold text-blue-700 mb-2">
                            {result.score.toFixed(0)}%
                        </p>
                        <p className="text-lg">
                            总共 {result.total} 道题，正确 {result.correct} 道
                        </p>
                    </div>

                    {/* 查看解析 */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold">解析</h3>

                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`border p-4 rounded-lg ${
                                    answers[question.id] === question.correctAnswer
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-red-500 bg-red-50'
                                }`}
                            >
                                <p className="font-bold mb-2">
                                    {index + 1}. {question.stem}
                                </p>

                                <div className="flex items-center mb-2">
                                    <span className="font-medium mr-2">您的答案:</span>
                                    <span className={answers[question.id] === question.correctAnswer
                                        ? 'text-green-600 font-bold'
                                        : 'text-red-600 font-bold'
                                    }>
                    {answers[question.id]}
                  </span>
                                </div>

                                {answers[question.id] !== question.correctAnswer && (
                                    <div className="flex items-center mb-2">
                                        <span className="font-medium mr-2">正确答案:</span>
                                        <span className="text-green-600 font-bold">
                      {question.correctAnswer}
                    </span>
                                    </div>
                                )}

                                <div className="mt-2 p-3 bg-white rounded">
                                    <p className="font-medium">解析:</p>
                                    <p>{question.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 重新开始按钮 */}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            重新设置
                        </button>
                        <button
                            onClick={() => {
                                setQuestions(null);
                                setResult(null);
                                setAnswers({});
                            }}
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            再做一组
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionGenerator;