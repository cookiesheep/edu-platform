'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import QuizResults from './QuizResults';

const GeneratedQuiz = ({ content, quizData, onRetake, onNewQuiz }) => {
  const contentRef = useRef(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResults, setGradingResults] = useState(null);
  const [encouragement, setEncouragement] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  
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
        
        // 处理标题
        let html = contentToDisplay
          .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4 text-center">$1</h1>')
          .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3 text-primary-700">$1</h2>')
          .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
          .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
          .replace(/^##### (.*$)/gm, '<h5 class="text-base font-bold mt-2 mb-1">$1</h5>');
        
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
        html = html.replace(/^\s*---\s*$/gm, '<hr class="my-6 border-gray-300" />');
        
        // 处理强调文本
        html = html
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
        
        // 处理列表
        html = html
          .replace(/^\s*[\-\*]\s+(.*)$/gm, '<li class="ml-6 py-1 list-disc">$1</li>')
          .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-6 py-1 list-decimal">$1</li>');
        
        // 处理段落
        html = html.replace(/^(?!<[a-zA-Z]).+$/gm, '<p class="my-3">$&</p>');
        
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
    
    // 记录答案修改次数
    setAnswerModifications(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + 1
    }));
    
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
          quiz_metadata: metadata,
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
            setAssessment(assessmentData.assessment);
          } else {
            console.warn('评估API调用失败，但不影响批改结果');
          }
        } catch (assessmentError) {
          console.warn('评估调用出错，但不影响批改结果:', assessmentError.message);
        }
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
      className="bg-white rounded-lg overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 操作按钮 */}
      <div className="print:hidden flex justify-between items-center mb-4 border-b pb-3">
        <div className="flex space-x-2">
          <button 
            onClick={() => window.print()}
            className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            打印试题
          </button>
          
          {currentQuestionCount > 0 && (
            <button 
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || Object.keys(answers).length === 0}
              className={`flex items-center text-sm px-3 py-1 rounded transition-colors ${
                isSubmitting || Object.keys(answers).length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isSubmitting ? '批改中...' : '提交答案'}
            </button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <strong className="font-bold">提交失败：</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* 答题状态提示 */}
      {currentQuestionCount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-700">
              已答题: {Object.keys(answers).length}/{currentQuestionCount} 
              {Object.keys(answers).length === currentQuestionCount && (
                <span className="ml-2 text-green-600 font-medium">✓ 已完成，可以提交</span>
              )}
              {Object.keys(answers).length === 0 && (
                <span className="ml-2 text-orange-600 font-medium">请开始答题</span>
              )}
              {behaviorData.totalStartTime && (
                <span className="ml-2 text-gray-600 text-sm">
                  用时: {Math.floor((Date.now() - behaviorData.totalStartTime) / 1000)}秒
                </span>
              )}
            </span>
          </div>
        </div>
      )}
      
      {/* 试题内容显示 */}
      <div 
        ref={contentRef} 
        className="prose prose-primary max-w-none overflow-auto print:p-0 mb-6"
      ></div>

      {/* 交互式答题界面 */}
      {quizContent && (() => {
        const { questions } = parseQuizContent(quizContent);
        return questions.length > 0 && (
          <div className="mt-6 print:hidden">
            <h3 className="text-xl font-bold mb-4">📝 在线答题</h3>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className="p-4 border rounded-lg bg-gray-50"
                  onMouseEnter={() => recordQuestionStart(question.id)}
                >
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">第{index + 1}题</span>
                    <p className="font-medium text-gray-900 mt-1">{question.question}</p>
                    {answerTimingData[question.id] && (
                      <span className="text-xs text-gray-500 ml-2">
                        答题时间: {Math.floor(answerTimingData[question.id] / 1000)}秒
                        {answerModifications[question.id] > 1 && (
                          <span className="ml-1">| 修改{answerModifications[question.id] - 1}次</span>
                        )}
                      </span>
                    )}
                  </div>
                  
                  {question.type === 'multiple_choice' && question.options.length > 0 ? (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option.key}
                          className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            answers[question.id] === option.key
                              ? 'bg-blue-100 border border-blue-300'
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.key}
                            checked={answers[question.id] === option.key}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="mr-3"
                            disabled={isSubmitting}
                          />
                          <span>{option.key}. {option.text}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="请输入答案..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        onFocus={() => recordQuestionStart(question.id)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 底部提交提示 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium">
                    完成答题后请点击&ldquo;提交答案&rdquo;按钮
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    系统将为您自动批改并显示详细的成绩分析
                  </p>
                </div>
                <div className="text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
};

export default GeneratedQuiz; 