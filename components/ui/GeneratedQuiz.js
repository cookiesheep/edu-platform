'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import QuizResults from './QuizResults';
import { Printer, Send, Clock, Edit2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

const GeneratedQuiz = ({ content, quizData, onRetake, onNewQuiz }) => {
  const contentRef = useRef(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResults, setGradingResults] = useState(null);
  const [encouragement, setEncouragement] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // 新增：详细的答题数据收集
  const [answerTimingData, setAnswerTimingData] = useState({});
  const [answerModifications, setAnswerModifications] = useState({});
  const [questionStartTimes, setQuestionStartTimes] = useState({});
  const [behaviorData, setBehaviorData] = useState({
    totalStartTime: null,
    questionOrder: [],
    skipPatterns: {},
    lastInteractionTime: null
  });

  // 从quizData中获取试题内容和答案
  const quizContent = quizData?.quiz_content || content;
  const answersContent = quizData?.answers_content || '';
  const metadata = quizData?.metadata;

  // 获取当前登录用户，用于写入 Supabase
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    })();
  }, []);

  // 初始化答题追踪数据
  useEffect(() => {
    const startTime = Date.now();
    setBehaviorData(prev => ({
      ...prev,
      totalStartTime: startTime,
      lastInteractionTime: startTime
    }));
  }, []);

  // 解析试题内容，提取题目信息
  const parseQuizContent = (content) => {
    if (!content) return { questions: [] };

    const lines = content.split('\n');
    const questions = [];

    let currentQuestion = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // 跳过包含答案的部分
      if (trimmedLine.includes('参考答案') ||
        trimmedLine.includes('答案与解析') ||
        trimmedLine.includes('能力评估指南')) {
        return;
      }

      // 解析题目
      if (/^\d+\./.test(trimmedLine)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }

        currentQuestion = {
          id: questions.length + 1,
          question: trimmedLine,
          options: [],
          type: 'multiple_choice'
        };
      } else if (currentQuestion && /^[ABCD]\./.test(trimmedLine)) {
        currentQuestion.options.push({
          key: trimmedLine.charAt(0),
          text: trimmedLine.substring(2).trim()
        });
      } else if (currentQuestion && trimmedLine && !trimmedLine.startsWith('#')) {
        // 补充题目描述或填空题
        if (currentQuestion.question.includes('_____') || trimmedLine.includes('_____')) {
          currentQuestion.type = 'fill_blank';
        }
        currentQuestion.question += ' ' + trimmedLine;
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return { questions };
  };

  // 使用useEffect将内容转换为HTML显示
  useEffect(() => {
    if (quizContent && contentRef.current) {
      const { questions } = parseQuizContent(quizContent);
      setCurrentQuestionCount(questions.length);

      // 创建Markdown样式，但排除答案部分
      const markdownToHtml = (markdown) => {
        if (!markdown) return '';

        // 提取试题部分，排除答案部分
        let contentToDisplay = markdown;

        // 移除答案相关的部分
        const answerSections = [
          /## 参考答案与解析[\s\S]*$/,
          /## 🔍 能力评估指南[\s\S]*$/,
          /===ANSWERS_START===[\s\S]*?===ANSWERS_END===/,
          /祝您测试顺利！[\s\S]*$/
        ];

        answerSections.forEach(pattern => {
          contentToDisplay = contentToDisplay.replace(pattern, '');
        });

        // 处理标题 - Dark Mode Styles
        let html = contentToDisplay
          .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4 text-center text-white">$1</h1>')
          .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3 text-cyan-400">$1</h2>')
          .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-white">$1</h3>')
          .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-3 mb-2 text-slate-200">$1</h4>')
          .replace(/^##### (.*$)/gm, '<h5 class="text-base font-bold mt-2 mb-1 text-slate-300">$1</h5>');

        // 处理特殊字符和表情符号
        html = html
          .replace(/📝/g, '<span class="text-xl">📝</span>')
          .replace(/📊/g, '<span class="text-xl">📊</span>')
          .replace(/⏱️/g, '<span class="text-xl">⏱️</span>')
          .replace(/✅/g, '<span class="text-xl">✅</span>')
          .replace(/🔍/g, '<span class="text-xl">🔍</span>')
          .replace(/📌/g, '<span class="text-xl">📌</span>')
          .replace(/🎯/g, '<span class="text-xl">🎯</span>')
          .replace(/💡/g, '<span class="text-xl">💡</span>');

        // 处理水平线
        html = html.replace(/^\s*---\s*$/gm, '<hr class="my-6 border-white/10" />');

        // 处理强调文本
        html = html
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-cyan-300">$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em class="italic text-slate-300">$1</em>');

        // 处理列表
        html = html
          .replace(/^\s*[\-\*]\s+(.*)$/gm, '<li class="ml-6 py-1 list-disc text-slate-300">$1</li>')
          .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-6 py-1 list-decimal text-slate-300">$1</li>');

        // 处理段落
        html = html.replace(/^(?!<[a-zA-Z]).+$/gm, '<p class="my-3 text-slate-300">$&</p>');

        // 修复可能的标签嵌套问题
        html = html
          .replace(/<p>\s*<h([1-6])/g, '<h$1')
          .replace(/<\/h([1-6])>\s*<\/p>/g, '</h$1>')
          .replace(/<p>\s*<(ul|ol|blockquote|pre)/g, '<$1')
          .replace(/<\/(ul|ol|blockquote|pre)>\s*<\/p>/g, '</$1>');

        return html;
      };

      // 应用处理后的HTML
      contentRef.current.innerHTML = markdownToHtml(quizContent);
    }
  }, [quizContent]);

  // 记录题目开始答题时间
  const recordQuestionStart = (questionId) => {
    if (!questionStartTimes[questionId]) {
      const currentTime = Date.now();
      setQuestionStartTimes(prev => ({
        ...prev,
        [questionId]: currentTime
      }));

      // 记录答题顺序
      setBehaviorData(prev => ({
        ...prev,
        questionOrder: [...prev.questionOrder, questionId],
        lastInteractionTime: currentTime
      }));
    }
  };

  // 计算答题时间
  const calculateAnswerTime = (questionId) => {
    const startTime = questionStartTimes[questionId];
    if (startTime) {
      return Date.now() - startTime;
    }
    return 0;
  };

  const handleAnswerChange = (questionId, answer) => {
    const currentTime = Date.now();

    // 记录题目开始时间（如果还没记录）
    recordQuestionStart(questionId);

    // 获取当前答案
    const currentAnswer = answers[questionId] || '';

    // 只有答案真正改变时才记录修改次数（避免填空题正常输入被计算为修改）
    if (currentAnswer !== answer) {
      // 对于填空题，只有在答案长度变化超过1个字符或者答案被清空时才计算为修改
      const isFillBlank = !answer || answer.length <= 1 || Math.abs(answer.length - currentAnswer.length) > 1;

      if (!isFillBlank || currentAnswer === '') {
        setAnswerModifications(prev => ({
          ...prev,
          [questionId]: (prev[questionId] || 0) + 1
        }));
      }
    }

    // 计算并记录答题时间
    const answerTime = calculateAnswerTime(questionId);
    setAnswerTimingData(prev => ({
      ...prev,
      [questionId]: answerTime
    }));

    // 更新答案
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // 更新行为数据
    setBehaviorData(prev => ({
      ...prev,
      lastInteractionTime: currentTime
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 验证是否有答案内容用于批改
      if (!answersContent) {
        throw new Error('无法获取标准答案，请重新生成试题');
      }

      // 构建详细的答题数据
      const detailedAnswerData = {
        answers,
        timing_data: answerTimingData,
        behavior_data: {
          ...behaviorData,
          totalDuration: Date.now() - behaviorData.totalStartTime,
          completionTime: new Date().toISOString()
        },
        modification_data: answerModifications,
        question_start_times: questionStartTimes,
        metadata: {
          total_questions: currentQuestionCount,
          completion_rate: Object.keys(answers).length / currentQuestionCount,
          average_time_per_question: Object.values(answerTimingData).reduce((a, b) => a + b, 0) / Object.keys(answerTimingData).length || 0
        }
      };

      console.log('提交详细答题数据:', detailedAnswerData);

      // 第一步：调用批改API
      const gradingResponse = await fetch('/api/quiz-grading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          quiz_metadata: {
            ...metadata,
            user_id: userId,
            userId: userId,
            parameters: {
              ...(metadata?.parameters || {}),
              user_id: userId,
              userId: userId
            }
          },
          answers_content: answersContent,
          detailed_data: detailedAnswerData
        }),
      });

      const gradingData = await gradingResponse.json();

      if (!gradingResponse.ok) {
        throw new Error(gradingData.error || '批改失败');
      }

      console.log('批改成功:', gradingData);
      setGradingResults(gradingData.grading_results);
      setEncouragement(gradingData.encouragement);

      // 第二步：如果需要评估，单独调用评估API
      if (gradingData.requires_assessment && gradingData.assessment_data) {
        try {
          console.log('开始调用评估API...');

          // 显示评估加载状态
          const originalSubmitText = '正在生成学习评估报告...';

          const assessmentResponse = await fetch('/api/assessment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(gradingData.assessment_data),
          });

          if (assessmentResponse.ok) {
            const assessmentData = await assessmentResponse.json();
            console.log('评估成功:', assessmentData);

            // 确保正确设置评估数据
            if (assessmentData && assessmentData.assessment) {
              setAssessment(assessmentData.assessment);
              console.log('学习评估报告生成成功');
            } else {
              console.log('评估API返回了数据，但格式可能不正确:', assessmentData);
              // 设置一个基本的评估结果，确保功能可用
              setAssessment(assessmentData);
            }
          } else {
            const errorText = await assessmentResponse.text();
            console.warn('评估API调用失败:', errorText);
            console.warn('但批改结果不受影响，您仍可以查看成绩');
          }
        } catch (assessmentError) {
          console.warn('评估调用出错:', assessmentError.message);
          console.warn('但批改结果不受影响，您仍可以查看成绩');
          // 不抛出错误，确保批改结果仍可显示
        }
      } else {
        console.log('无需调用评估API或缺少评估数据');
      }

    } catch (err) {
      console.error('批改错误:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setGradingResults(null);
    setEncouragement(null);
    setAssessment(null);
    setError(null);
    setAnswerTimingData({});
    setAnswerModifications({});
    setQuestionStartTimes({});
    setBehaviorData({
      totalStartTime: null,
      questionOrder: [],
      skipPatterns: {},
      lastInteractionTime: null
    });
    if (onRetake) onRetake();
  };

  const handleNewQuiz = () => {
    setAnswers({});
    setGradingResults(null);
    setEncouragement(null);
    setAssessment(null);
    setError(null);
    setAnswerTimingData({});
    setAnswerModifications({});
    setQuestionStartTimes({});
    setBehaviorData({
      totalStartTime: null,
      questionOrder: [],
      skipPatterns: {},
      lastInteractionTime: null
    });
    if (onNewQuiz) onNewQuiz();
  };

  // 如果已有批改结果，显示成绩页面
  if (gradingResults && encouragement) {
    return (
      <QuizResults
        gradingResults={gradingResults}
        encouragement={encouragement}
        assessment={assessment}
        onRetake={resetQuiz}
        onNewQuiz={handleNewQuiz}
      />
    );
  }

  return (
    <motion.div
      className="bg-[#0f172a]/50 min-h-[500px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 操作按钮 */}
      <div className="print:hidden flex justify-between items-center mb-6 border-b border-white/10 pb-4 px-6 pt-6">
        <div className="flex space-x-3">
          <button
            onClick={() => window.print()}
            className="flex items-center text-sm bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg transition-colors border border-white/10"
          >
            <Printer className="h-4 w-4 mr-2" />
            打印试题
          </button>

          {quizContent && (() => {
            const { questions } = parseQuizContent(quizContent);
            return questions.length > 0 && (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || Object.keys(answers).length === 0}
                className={`flex items-center text-sm px-4 py-2 rounded-lg transition-colors ${isSubmitting || Object.keys(answers).length === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  }`}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? '批改中...' : '提交答案'}
              </button>
            );
          })()}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <div>
            <strong className="font-bold">提交失败：</strong>
            <span className="ml-1">{error}</span>
          </div>
        </div>
      )}

      {/* 答题状态提示 */}
      {quizContent && (() => {
        const { questions } = parseQuizContent(quizContent);
        return questions.length > 0 && (
          <div className="mx-6 mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-cyan-400 mr-2" />
                <span className="text-cyan-100">
                  已答题: {Object.keys(answers).length}/{questions.length}
                  {Object.keys(answers).length === questions.length && (
                    <span className="ml-2 text-emerald-400 font-medium flex items-center inline-flex">
                      <CheckCircle className="w-4 h-4 mr-1" /> 已完成
                    </span>
                  )}
                  {Object.keys(answers).length === 0 && (
                    <span className="ml-2 text-yellow-400 font-medium">请开始答题</span>
                  )}
                </span>
              </div>
              {behaviorData.totalStartTime && (
                <span className="flex items-center text-slate-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  用时: {Math.floor((Date.now() - behaviorData.totalStartTime) / 1000)}秒
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* 整合的试题内容和答题界面 */}
      {quizContent && (() => {
        const { questions } = parseQuizContent(quizContent);
        return questions.length > 0 ? (
          <div className="space-y-6 px-6 pb-8 print:p-0">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-6 border border-white/5 rounded-xl bg-[#0f172a]/30 hover:border-white/10 transition-colors"
                onMouseEnter={() => recordQuestionStart(question.id)}
              >
                {/* 题目内容 */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                      第 {index + 1} 题
                    </span>
                    {answerTimingData[question.id] && (
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.floor(answerTimingData[question.id] / 1000)}秒
                        {answerModifications[question.id] > 1 && (
                          <span className="ml-2 flex items-center">
                            <Edit2 className="w-3 h-3 mr-1" />
                            修改{answerModifications[question.id] - 1}次
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-slate-200 text-lg leading-relaxed">{question.question}</p>
                </div>

                {/* 答题选项 */}
                {question.type === 'multiple_choice' && question.options.length > 0 ? (
                  <div className="space-y-3 ml-2">
                    {question.options.map((option) => (
                      <label
                        key={option.key}
                        className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border ${answers[question.id] === option.key
                            ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                            : 'bg-[#0f172a]/50 border-white/5 hover:bg-white/5 hover:border-white/10'
                          }`}
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.key}
                            checked={answers[question.id] === option.key}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${answers[question.id] === option.key
                              ? 'border-cyan-400'
                              : 'border-slate-600'
                            }`}>
                            {answers[question.id] === option.key && (
                              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <span className={`text-base ${answers[question.id] === option.key ? 'text-cyan-100' : 'text-slate-300'
                          }`}>
                          <span className="font-bold mr-2">{option.key}.</span> {option.text}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="ml-2">
                    <input
                      type="text"
                      placeholder="请输入答案..."
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      onFocus={() => recordQuestionStart(question.id)}
                      disabled={isSubmitting}
                      className="w-full px-5 py-4 bg-[#0f172a]/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-slate-500 text-lg transition-all"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* 底部提交区域 */}
            <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-cyan-100 font-bold text-xl mb-2">
                      准备好提交了吗？
                    </p>
                    <p className="text-cyan-400/80 text-sm">
                      系统将为您自动批改并生成详细的学习分析报告
                    </p>
                  </div>
                  <div className="text-cyan-500/50">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                </div>

                {/* 明显的提交按钮 */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting || Object.keys(answers).length === 0}
                    className={`flex items-center px-10 py-5 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${isSubmitting || Object.keys(answers).length === 0
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        正在智能批改中...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        提交答案
                      </>
                    )}
                  </button>
                </div>

                {/* 答题进度提示 */}
                {Object.keys(answers).length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-cyan-300/70">
                      已答题 {Object.keys(answers).length} 道，{Object.keys(answers).length === questions.length ? '所有题目已完成！' : `还需完成 ${questions.length - Object.keys(answers).length} 道题`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={contentRef}
            className="prose prose-invert max-w-none overflow-auto px-6 pb-8"
          ></div>
        );
      })()}
    </motion.div>
  );
};

export default GeneratedQuiz;