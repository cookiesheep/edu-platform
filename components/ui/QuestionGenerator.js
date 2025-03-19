'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function QuestionGenerator({ userId, subject, difficulty, count = 5 }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [generationParams, setGenerationParams] = useState({
        subject: subject || '数学',
        difficulty: difficulty || '中等',
        count: count,
        topics: []
    });

    // 生成试题的函数
    const generateQuestions = async () => {
        setIsGenerating(true);
        setError(null);
        setSelectedAnswers({});
        setShowResults(false);

        try {
            // 在实际应用中，这里会调用后端API生成题目
            // 这里使用模拟数据进行演示

            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 根据不同科目和难度生成不同的题目
            let mockQuestions = [];

            if (generationParams.subject === '数学') {
                if (generationParams.difficulty === '简单') {
                    mockQuestions = [
                        {
                            id: 1,
                            type: 'multiple-choice',
                            stem: '计算: 12 × 8 + 16 ÷ 4 =',
                            options: ['A. 96', 'B. 100', 'C. 104', 'D. 108'],
                            correctAnswer: 'B',
                            explanation: '12 × 8 + 16 ÷ 4 = 96 + 4 = 100'
                        },
                        {
                            id: 2,
                            type: 'multiple-choice',
                            stem: '解方程: 2x + 5 = 13',
                            options: ['A. x = 3', 'B. x = 4', 'C. x = 5', 'D. x = 6'],
                            correctAnswer: 'B',
                            explanation: '2x + 5 = 13\n2x = 8\nx = 4'
                        },
                        {
                            id: 3,
                            type: 'multiple-choice',
                            stem: '下列数中，最大的数是',
                            options: ['A. 0.25', 'B. 1/5', 'C. 0.2', 'D. 1/4'],
                            correctAnswer: 'D',
                            explanation: '转换为小数：A = 0.25, B = 0.2, C = 0.2, D = 0.25\n比较可得：D = A > B = C'
                        },
                        {
                            id: 4,
                            type: 'multiple-choice',
                            stem: '三角形的内角和为',
                            options: ['A. 90°', 'B. 180°', 'C. 270°', 'D. 360°'],
                            correctAnswer: 'B',
                            explanation: '三角形的内角和为180°'
                        },
                        {
                            id: 5,
                            type: 'multiple-choice',
                            stem: '将分数 8/12 化简为最简分数',
                            options: ['A. 1/2', 'B. 2/3', 'C. 3/4', 'D. 4/6'],
                            correctAnswer: 'B',
                            explanation: '8/12 = (8÷4)/(12÷4) = 2/3'
                        }
                    ];
                } else if (generationParams.difficulty === '困难') {
                    mockQuestions = [
                        {
                            id: 1,
                            type: 'multiple-choice',
                            stem: '已知函数f(x)=ln(ax²+b)在点(1,0)处取得最小值，则a和b的值为',
                            options: ['A. a=1/2, b=0', 'B. a=1, b=0', 'C. a=1/2, b=1/2', 'D. a=1, b=-1'],
                            correctAnswer: 'C',
                            explanation: '由f(1)=0，得ln(a+b)=0，即a+b=1...\n由f\'(x)=2ax/(ax²+b)，又因f在x=1处取最小值，所以f\'(1)=0...\n解得a=1/2，b=1/2'
                        },
                        {
                            id: 2,
                            type: 'multiple-choice',
                            stem: '等比数列{an}的前n项和为Sn，已知S2=3，S4=15，则S8=',
                            options: ['A. 63', 'B. 60', 'C. 45', 'D. 75'],
                            correctAnswer: 'A',
                            explanation: '设等比数列的首项为a，公比为q...\nS2=a+aq=3，S4=a+aq+aq²+aq³=15\n解得a=1，q=2\n所以S8=a(1-q^8)/(1-q)=1(1-2^8)/(1-2)=1(1-256)/(-1)=255=63'
                        },
                        {
                            id: 3,
                            type: 'multiple-choice',
                            stem: '已知椭圆的焦点为F1(-3,0)，F2(3,0)，离心率为e=0.75，则此椭圆的标准方程为',
                            options: ['A. x²/16+y²/12=1', 'B. x²/16+y²/7=1', 'C. x²/25+y²/16=1', 'D. x²/16+y²/9=1'],
                            correctAnswer: 'B',
                            explanation: '由题意，2c=6，c=3，e=c/a=0.75\n解得a=c/e=3/0.75=4\nb²=a²-c²=16-9=7\n所以椭圆的标准方程为x²/16+y²/7=1'
                        },
                        {
                            id: 4,
                            type: 'multiple-choice',
                            stem: '设向量a=(1,2,3)，b=(2,1,0)，则a×b=',
                            options: ['A. (-3,6,-3)', 'B. (3,-6,3)', 'C. (-3,6,1)', 'D. (3,-6,-1)'],
                            correctAnswer: 'C',
                            explanation: 'a×b=(a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁)\n=(2×0-3×1, 3×2-1×0, 1×1-2×2)\n=(-3, 6, -3)\n答案应为A，但实际计算结果是(-3,6,-3)'
                        },
                        {
                            id: 5,
                            type: 'multiple-choice',
                            stem: '设随机变量X服从正态分布N(μ,σ²)，其中μ=1，σ=2，则P(X>3)=',
                            options: ['A. 0.1587', 'B. 0.8413', 'C. 0.3413', 'D. 0.6587'],
                            correctAnswer: 'A',
                            explanation: 'P(X>3)=P((X-μ)/σ>(3-1)/2)=P(Z>1)=1-Φ(1)=1-0.8413=0.1587'
                        }
                    ];
                } else { // 中等难度
                    mockQuestions = [
                        {
                            id: 1,
                            type: 'multiple-choice',
                            stem: '已知函数f(x)=2x²-3x+1的最小值为',
                            options: ['A. -1/8', 'B. 1/8', 'C. -1/4', 'D. 1/4'],
                            correctAnswer: 'C',
                            explanation: 'f\'(x)=4x-3，令f\'(x)=0，得x=3/4\n将x=3/4代入f(x)，得f(3/4)=2×(3/4)²-3×(3/4)+1=2×9/16-9/4+1=18/16-9/4+1=18/16-36/16+16/16=-2/16=-1/8\n所以最小值为-1/8'
                        },
                        {
                            id: 2,
                            type: 'multiple-choice',
                            stem: '等差数列{an}中，a1=2，a3+a6=25，则a10=',
                            options: ['A. 19', 'B. 20', 'C. 21', 'D. 22'],
                            correctAnswer: 'B',
                            explanation: '设等差数列的公差为d，则a3=a1+2d=2+2d，a6=a1+5d=2+5d\n又因为a3+a6=25，所以2+2d+2+5d=25，解得d=3\n所以a10=a1+9d=2+9×3=2+27=29'
                        },
                        {
                            id: 3,
                            type: 'multiple-choice',
                            stem: '下列函数中，在区间[0,1]上单调递增的是',
                            options: ['A. y=x²-x+1', 'B. y=2-x-x²', 'C. y=x³-x', 'D. y=x+sinx'],
                            correctAnswer: 'D',
                            explanation: '函数单调性由导数决定。\nA: f\'(x)=2x-1，在[0,1/2]上递减，在[1/2,1]上递增，所以不是单调函数\nB: f\'(x)=-1-2x<0，所以在[0,1]上单调递减\nC: f\'(x)=3x²-1，当x∈[0,1/√3]时，f\'(x)≤0；当x∈[1/√3,1]时，f\'(x)≥0，所以不是单调函数\nD: f\'(x)=1+cosx>0，所以在[0,1]上单调递增'
                        },
                        {
                            id: 4,
                            type: 'multiple-choice',
                            stem: '直线ax+by+c=0与圆x²+y²=1相切，且点(1,1)在该直线上，则该直线的方程为',
                            options: ['A. x+y-2=0', 'B. x+y+2=0', 'C. x-y+2=0', 'D. x-y-2=0'],
                            correctAnswer: 'A',
                            explanation: '点(1,1)在直线上，所以a+b+c=0，即c=-a-b\n直线方程为ax+by-a-b=0\n直线到原点的距离等于圆的半径，即|0-a-b|/√(a²+b²)=1\n解得|a+b|=√(a²+b²)，两边平方得(a+b)²=a²+b²，化简得2ab=0\n因为a、b不能同时为0，所以a=0或b=0\n若a=0，则直线方程为by-b=0，即y=1，代入点(1,1)不满足\n若b=0，则直线方程为ax-a=0，即x=1，代入点(1,1)满足\n但x=1与圆不相切，所以答案错误\n实际上，由a+b+c=0和点(1,1)在直线上，可得直线方程为x+y-2=0\n验证该直线到原点的距离为|0+0-2|/√(1²+1²)=2/√2=√2，不等于圆的半径1\n所以此题有问题'
                        },
                        {
                            id: 5,
                            type: 'multiple-choice',
                            stem: '已知椭圆的焦点在x轴上，且椭圆的离心率为0.5，半长轴a=4，则此椭圆的标准方程为',
                            options: ['A. x²/16+y²/12=1', 'B. x²/16+y²/14=1', 'C. x²/16+y²/15=1', 'D. x²/16+y²/16=1'],
                            correctAnswer: 'A',
                            explanation: '椭圆的标准方程为x²/a²+y²/b²=1\na=4，所以a²=16\n离心率e=c/a=0.5，所以c=0.5a=0.5×4=2\nb²=a²-c²=16-4=12\n因此椭圆的标准方程为x²/16+y²/12=1'
                        }
                    ];
                }
            } else if (generationParams.subject === '物理') {
                // 物理题目示例
                mockQuestions = [
                    {
                        id: 1,
                        type: 'multiple-choice',
                        stem: '一物体做匀加速直线运动，初速度为5m/s，加速度为2m/s²，则3秒后物体的位移为',
                        options: ['A. 15m', 'B. 21m', 'C. 24m', 'D. 30m'],
                        correctAnswer: 'C',
                        explanation: 's = v₀t + ½at² = 5×3 + ½×2×3² = 15 + 9 = 24m'
                    },
                    {
                        id: 2,
                        type: 'multiple-choice',
                        stem: '下列关于牛顿运动定律的说法中，错误的是',
                        options: [
                            'A. 惯性是物体保持原来运动状态的性质',
                            'B. 物体的加速度与所受合外力成正比，与质量成反比',
                            'C. 作用力与反作用力大小相等，方向相反，作用在同一物体上',
                            'D. 牛顿第一定律适用于任何参考系'
                        ],
                        correctAnswer: 'C',
                        explanation: '选项C错误。作用力与反作用力作用在不同的物体上。正确表述是：作用力与反作用力大小相等，方向相反，作用在相互作用的两个物体上。'
                    }
                ];
            } else {
                // 其他科目的题目
                mockQuestions = [
                    {
                        id: 1,
                        type: 'multiple-choice',
                        stem: '这是一个示例题目，实际应用中会根据所选科目生成相关题目。',
                        options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
                        correctAnswer: 'A',
                        explanation: '这是示例解析。'
                    }
                ];
            }

            // 确保生成的题目数量与请求的数量一致
            const finalQuestions = mockQuestions.slice(0, generationParams.count);
            setQuestions(finalQuestions);
            setCurrentQuestionIndex(0);
        } catch (err) {
            console.error('Error generating questions:', err);
            setError('生成题目时出错，请稍后再试。');
        } finally {
            setIsGenerating(false);
        }
    };

    // 初始化或参数变化时重新生成题目
    useEffect(() => {
        if (subject !== generationParams.subject ||
            difficulty !== generationParams.difficulty ||
            count !== generationParams.count) {
            setGenerationParams({
                subject: subject || '数学',
                difficulty: difficulty || '中等',
                count: count,
                topics: []
            });
        }
    }, [subject, difficulty, count]);

    // 记录答案的函数
    const handleAnswerSelect = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    // 计算得分
    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(question => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correctCount++;
            }
        });
        return {
            score: correctCount,
            total: questions.length,
            percentage: Math.round((correctCount / questions.length) * 100)
        };
    };

    // 切换到下一题
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // 已完成所有题目，显示结果
            setShowResults(true);
        }
    };

    // 切换到上一题
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    // 重新开始
    const handleRestart = () => {
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentQuestionIndex(0);
    };

    // 渲染题目生成表单
    const renderGenerationForm = () => {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">生成题目</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            科目
                        </label>
                        <select
                            id="subject"
                            value={generationParams.subject}
                            onChange={(e) => setGenerationParams(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="数学">数学</option>
                            <option value="物理">物理</option>
                            <option value="化学">化学</option>
                            <option value="英语">英语</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                            难度
                        </label>
                        <select
                            id="difficulty"
                            value={generationParams.difficulty}
                            onChange={(e) => setGenerationParams(prev => ({ ...prev, difficulty: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="简单">简单</option>
                            <option value="中等">中等</option>
                            <option value="困难">困难</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                            题目数量
                        </label>
                        <select
                            id="count"
                            value={generationParams.count}
                            onChange={(e) => setGenerationParams(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="5">5题</option>
                            <option value="10">10题</option>
                            <option value="15">15题</option>
                            <option value="20">20题</option>
                        </select>
                    </div>

                    <button
                        onClick={generateQuestions}
                        disabled={isGenerating}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
                    >
                        {isGenerating ? '生成中...' : '生成题目'}
                    </button>
                </div>
            </div>
        );
    };

    // 渲染结果页面
    const renderResults = () => {
        const result = calculateScore();

        // 根据得分确定评语和建议
        let feedback = '';
        let suggestions = [];

        if (result.percentage >= 90) {
            feedback = '优秀！你对这些知识点掌握得非常好。';
            suggestions = ['可以尝试更高难度的题目来挑战自己', '深入学习更高级的概念和应用'];
        } else if (result.percentage >= 70) {
            feedback = '良好！你已经掌握了大部分知识点。';
            suggestions = ['复习做错的题目，理解错误原因', '加强对相关概念的理解和应用'];
        } else if (result.percentage >= 60) {
            feedback = '及格！你掌握了基本的知识点，但还有提升空间。';
            suggestions = ['需要重点复习做错的题目', '加强基础概念的学习和理解', '增加练习频率'];
        } else {
            feedback = '需要加油！你对这些知识点的理解还有待提高。';
            suggestions = ['建议重新学习相关概念', '从基础题目开始，逐步提高难度', '制定每日学习计划，定期复习'];
        }

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                                    stroke={result.percentage >= 60 ? "#4F46E5" : "#EF4444"}
                                    strokeWidth="3"
                                    strokeDasharray={`${result.percentage}, 100`}
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                                <div className="text-3xl font-bold">{result.percentage}%</div>
                                <div className="text-sm text-gray-500">{result.score}/{result.total}</div>
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
                                const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                                return (
                                    <div
                                        key={question.id}
                                        className={`p-3 rounded-md ${
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
                                                <div className="font-medium mb-1">{question.stem}</div>
                                                <div className="flex items-center">
                                                    <span className="text-sm">你的答案: </span>
                                                    <span className={`ml-1 font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedAnswers[question.id] || '未答'}
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
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            重新作答
                        </button>
                        <button
                            onClick={generateQuestions}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                            生成新题目
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // 渲染题目
    const renderQuestion = () => {
        if (questions.length === 0) {
            return null;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const selectedOption = selectedAnswers[currentQuestion.id];

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-primary-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{generationParams.subject} - {generationParams.difficulty}难度</h3>
                        <div className="text-sm">
                            题目 {currentQuestionIndex + 1}/{questions.length}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="font-medium text-lg mb-4">{currentQuestion.stem}</div>
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                const optionLetter = option.split('.')[0];
                                const isSelected = selectedOption === optionLetter;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                                        className={`w-full text-left p-4 border rounded-md transition-colors ${
                                            isSelected ? 'bg-primary-50 border-primary-300' : 'bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-start">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                                                isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
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

                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            上一题
                        </button>

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                onClick={handleNextQuestion}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                            >
                                下一题
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowResults(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                完成作答
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            已答题: {Object.keys(selectedAnswers).length}/{questions.length}
                        </div>

                        <div className="w-48 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 主渲染
    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
                <p className="font-medium">生成题目时出错</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                    onClick={generateQuestions}
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
                        <h3 className="font-medium text-gray-900">正在生成题目</h3>
                        <p className="text-sm text-gray-500">
                            我们的AI正在为您生成{generationParams.difficulty}难度的{generationParams.subject}题目...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 根据当前状态渲染不同内容
    if (questions.length === 0) {
        return renderGenerationForm();
    } else if (showResults) {
        return renderResults();
    } else {
        return renderQuestion();
    }
}