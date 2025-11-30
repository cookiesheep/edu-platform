'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// 模拟数据 - 实际应用中应该从API获取
const MOCK_QUESTIONS = [
    {
        id: 1,
        type: 'multiple-choice',
        subject: '数学',
        difficulty: '中等',
        question: '设函数f(x)=ln(x-1)+lnx的定义域为',
        options: [
            'A. (1,+∞)',
            'B. (0,+∞)',
            'C. (0,1)∪(1,+∞)',
            'D. (1,+∞)'
        ],
        correctAnswer: 'D',
        explanation: '函数f(x)=ln(x-1)+lnx，由于对数函数的定义域是正实数，所以要求x-1>0且x>0，解得x>1，所以定义域是(1,+∞)。'
    },
    {
        id: 2,
        type: 'multiple-choice',
        subject: '物理',
        difficulty: '简单',
        question: '关于牛顿第一定律，下列说法正确的是',
        options: [
            'A. 任何物体都具有保持静止状态的趋势',
            'B. 外力是物体运动的原因',
            'C. 任何物体在没有外力作用时，保持静止或匀速直线运动状态',
            'D. 物体的加速度与所受合外力成正比'
        ],
        correctAnswer: 'C',
        explanation: '牛顿第一定律（惯性定律）：任何物体在没有外力作用时，保持静止或匀速直线运动状态。选项D描述的是牛顿第二定律。'
    },
    {
        id: 3,
        type: 'multiple-choice',
        subject: '化学',
        difficulty: '困难',
        question: '下列反应属于氧化反应的是',
        options: [
            'A. CO₂ + H₂O → H₂CO₃',
            'B. 2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O',
            'C. 2H₂O₂ → 2H₂O + O₂↑',
            'D. CH₄ + 2O₂ → CO₂ + 2H₂O'
        ],
        correctAnswer: 'D',
        explanation: 'D选项中，CH₄被氧化为CO₂，碳原子的氧化数由-4变为+4，是氧化反应。A选项是化合反应，B选项是复分解反应，C选项是歧化反应。'
    },
];

export default function PracticePage() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [subject, setSubject] = useState('all');
    const [difficulty, setDifficulty] = useState('all');
    const [practiceMode, setPracticeMode] = useState('random'); // 'random' or 'adaptive'
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // 获取用户信息
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);

            // 实际应用中应该从API获取题目
            // 这里使用模拟数据
            setQuestions(MOCK_QUESTIONS);
            setLoading(false);
        }

        fetchData();
    }, []);

    // 筛选题目
    useEffect(() => {
        let filteredQuestions = [...MOCK_QUESTIONS];

        if (subject !== 'all') {
            filteredQuestions = filteredQuestions.filter(q => q.subject === subject);
        }

        if (difficulty !== 'all') {
            filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
        }

        if (practiceMode === 'adaptive' && user) {
            // 在实际应用中，应根据用户的学习情况推荐题目
            // 这里简单模拟一下，调整题目顺序
            filteredQuestions.sort((a, b) => {
                const difficultyMap = { '简单': 1, '中等': 2, '困难': 3 };
                return difficultyMap[a.difficulty] - difficultyMap[b.difficulty];
            });
        } else {
            // 随机模式，打乱题目顺序
            filteredQuestions.sort(() => Math.random() - 0.5);
        }

        setQuestions(filteredQuestions);
        setCurrentIndex(0);
        setSelectedAnswer('');
        setIsAnswered(false);
        setShowExplanation(false);
        setShowResults(false);
        setScore(0);
    }, [subject, difficulty, practiceMode, user]);

    const currentQuestion = questions[currentIndex];

    const handleAnswerSelect = (option) => {
        if (isAnswered) return;

        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === currentQuestion.correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setSelectedAnswer('');
            setIsAnswered(false);
            setShowExplanation(false);
        } else {
            // 已完成所有题目，显示结果页面
            setShowResults(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer('');
        setIsAnswered(false);
        setShowExplanation(false);
        setShowResults(false);
        setScore(0);

        // 重新打乱题目顺序
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
    };

    // 渲染结果页面
    const renderResults = () => {
        const percentage = Math.round((score / questions.length) * 100);

        let feedback = '';
        let suggestions = [];

        if (percentage >= 90) {
            feedback = '优秀！你对这些知识点掌握得非常好。';
            suggestions = ['可以尝试更高难度的题目来挑战自己', '深入学习更高级的概念和应用'];
        } else if (percentage >= 70) {
            feedback = '良好！你已经掌握了大部分知识点。';
            suggestions = ['复习做错的题目，理解错误原因', '加强对相关概念的理解和应用'];
        } else if (percentage >= 60) {
            feedback = '及格！你掌握了基本的知识点，但还有提升空间。';
            suggestions = ['需要重点复习做错的题目', '加强基础概念的学习和理解', '增加练习频率'];
        } else {
            feedback = '需要加油！你对这些知识点的理解还有待提高。';
            suggestions = ['建议重新学习相关概念', '从基础题目开始，逐步提高难度', '制定每日学习计划，定期复习'];
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
            >
                <div className="bg-primary-600 p-4 text-white">
                    <h3 className="font-bold text-lg">练习结果</h3>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="3"
                                    strokeDasharray="100, 100"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={percentage >= 60 ? "#4F46E5" : "#EF4444"}
                                    strokeWidth="3"
                                    strokeDasharray={`${percentage}, 100`}
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                                <div className="text-3xl font-bold">{percentage}%</div>
                                <div className="text-sm text-gray-500">{score}/{questions.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">评价</h4>
                        <p className="text-gray-700">{feedback}</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">建议</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">题目分析</h4>
                        <div className="space-y-2">
                            {questions.map((question, index) => {
                                const isCorrect = selectedAnswer === question.correctAnswer;
                                return (
                                    <div
                                        key={question.id}
                                        className={`p-3 rounded-md ${
                                            index === currentIndex ? 'bg-primary-50 border border-primary-200' :
                                                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                        }`}
                                    >
                                        <div className="flex items-start">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-medium ${
                                                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium mb-1">{question.question}</div>
                                                <div className="flex items-center">
                                                    <span className="text-sm">你的答案: </span>
                                                    <span className={`ml-1 font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedAnswer || '未答'}
                          </span>
                                                    {!isCorrect && (
                                                        <span className="ml-2 text-sm">
                              正确答案: <span className="font-medium text-green-700">{question.correctAnswer}</span>
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleRestart}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                            重新作答
                        </button>
                        <button
                            onClick={() => {
                                setSubject('all');
                                setDifficulty('all');
                                setShowResults(false);
                            }}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition duration-200"
                        >
                            开始新练习
                        </button>
                    </div>
                </div>
            </motion.div>
        );
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

    if (questions.length === 0) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">没有找到符合条件的题目</h3>
                    <p className="mt-1 text-gray-500">请尝试调整筛选条件。</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">题目练习</h1>
                <p className="text-gray-600 mt-2">通过有针对性的练习提高解题能力和知识掌握程度</p>
            </div>

            {/* 筛选器和模式选择 */}
            {!showResults && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">科目</label>
                            <select
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">全部科目</option>
                                <option value="数学">数学</option>
                                <option value="物理">物理</option>
                                <option value="化学">化学</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                            <select
                                id="difficulty"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">全部难度</option>
                                <option value="简单">简单</option>
                                <option value="中等">中等</option>
                                <option value="困难">困难</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">练习模式</label>
                            <select
                                id="mode"
                                value={practiceMode}
                                onChange={(e) => setPracticeMode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                disabled={!user}
                            >
                                <option value="random">随机练习</option>
                                <option value="adaptive">智能推荐{!user && '（需登录）'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* 结果或题目卡片 */}
            {showResults ? (
                renderResults()
            ) : (
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md p-6 mb-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {currentQuestion.subject}
              </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {currentQuestion.difficulty}
              </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            题目 {currentIndex + 1}/{questions.length}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                const optionLetter = option.split('.')[0];
                                const isCorrect = optionLetter === currentQuestion.correctAnswer;
                                const isSelected = optionLetter === selectedAnswer;

                                let bgColor = 'bg-white';
                                if (isAnswered) {
                                    if (isCorrect) {
                                        bgColor = 'bg-green-50 border-green-200';
                                    } else if (isSelected) {
                                        bgColor = 'bg-red-50 border-red-200';
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(optionLetter)}
                                        className={`w-full text-left p-4 border rounded-md ${bgColor} ${
                                            isAnswered ? 'cursor-default' : 'hover:bg-gray-50'
                                        } transition duration-200`}
                                        disabled={isAnswered}
                                    >
                                        <div className="flex items-start">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                                                isAnswered && isCorrect
                                                    ? 'bg-green-100 text-green-700'
                                                    : isAnswered && isSelected
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {optionLetter}
                                            </div>
                                            <div>{option.split('.').slice(1).join('.')}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {isAnswered && (
                        <div className={`p-4 rounded-md mb-6 ${
                            selectedAnswer === currentQuestion.correctAnswer
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
                                    selectedAnswer === currentQuestion.correctAnswer
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`} viewBox="0 0 20 20" fill="currentColor">
                                    {selectedAnswer === currentQuestion.correctAnswer ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    )}
                                </svg>
                                <span className={`font-medium ${
                                    selectedAnswer === currentQuestion.correctAnswer
                                        ? 'text-green-700'
                                        : 'text-red-700'
                                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer
                      ? '回答正确！'
                      : `回答错误，正确答案是 ${currentQuestion.correctAnswer}`}
                </span>
                            </div>

                            <button
                                onClick={() => setShowExplanation(!showExplanation)}
                                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                            >
                                {showExplanation ? '隐藏解析' : '查看解析'}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${
                                    showExplanation ? 'transform rotate-180' : ''
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showExplanation && (
                                <div className="mt-2 text-sm text-gray-600">
                                    {currentQuestion.explanation}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                if (currentIndex > 0) {
                                    setCurrentIndex(prevIndex => prevIndex - 1);
                                    setSelectedAnswer('');
                                    setIsAnswered(false);
                                    setShowExplanation(false);
                                }
                            }}
                            disabled={currentIndex === 0}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                            上一题
                        </button>

                        {isAnswered ? (
                            <button
                                onClick={handleNextQuestion}
                                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition duration-200"
                            >
                                {currentIndex < questions.length - 1 ? '下一题' : '完成练习'}
                            </button>
                        ) : (
                            <span className="text-sm text-gray-500 self-center">
                请选择一个答案
              </span>
                        )}
                    </div>
                </motion.div>
            )}

            {/* 进度卡片 - 仅在做题模式下显示 */}
            {!showResults && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold mb-4">本次练习进度</h3>
                    <div className="flex items-center mb-4">
                        <div className="text-2xl font-bold text-primary-600 mr-2">{score}</div>
                        <div className="text-gray-600">/ {questions.length} 正确</div>
                        <div className="ml-auto text-lg font-medium">
                            {Math.round((score / Math.max(1, isAnswered ? currentIndex + 1 : currentIndex)) * 100) || 0}%
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
                        >
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1 mt-4">
                        {questions.map((q, idx) => {
                            let bgColor = 'bg-gray-200';

                            if (idx < currentIndex) {
                                // 已回答的题目
                                const userAnswer = idx === currentIndex ? selectedAnswer : null;
                                const isCorrect = userAnswer === q.correctAnswer;

                                if (isCorrect) {
                                    bgColor = 'bg-green-500';
                                } else {
                                    bgColor = 'bg-red-500';
                                }
                            } else if (idx === currentIndex && isAnswered) {
                                // 当前题目且已回答
                                bgColor = selectedAnswer === q.correctAnswer ? 'bg-green-500' : 'bg-red-500';
                            } else if (idx === currentIndex) {
                                // 当前题目未回答
                                bgColor = 'bg-primary-300';
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`h-2 rounded-sm ${bgColor} transition-all duration-300`}
                                    title={`题目 ${idx + 1}`}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}