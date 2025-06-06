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
    
    console.log('开始解析试题内容:', content.substring(0, 200) + '...');
    
    const lines = content.split('\n');
    const questions = [];
    
    let currentQuestion = null;
    let inAnswerSection = false;
    let questionCounter = 0; // 添加计数器确保唯一ID
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // 跳过空行
      if (!trimmedLine) return;
      
      // 检查是否进入答案部分，如果是则停止解析
      if (trimmedLine.includes('参考答案') || 
          trimmedLine.includes('答案与解析') ||
          trimmedLine.includes('能力评估指南') ||
          trimmedLine.includes('===ANSWERS_START===') ||
          trimmedLine.match(/^(选择题答案|填空题答案)[:：]/)) {
        inAnswerSection = true;
        return;
      }
      
      if (inAnswerSection) return;
      
      // 跳过标题行
      if (trimmedLine.startsWith('#') || trimmedLine.includes('摸底测试')) {
        return;
      }
      
      // 解析题目 - 改进识别逻辑
      const questionMatch = trimmedLine.match(/^(\d+)[\.\s、](.+)/);
      if (questionMatch) {
        // 保存之前的题目
        if (currentQuestion) {
          console.log('保存题目:', currentQuestion.id, '选项数量:', currentQuestion.options.length);
          questions.push(currentQuestion);
        }
        
        questionCounter++;
        const questionNumber = parseInt(questionMatch[1]);
        const questionText = questionMatch[2].trim();
        
        currentQuestion = {
          id: `q_${questionCounter}_${questionNumber}`, // 使用复合ID确保唯一性
          originalId: questionNumber,
          question: questionText,
          options: [],
          type: 'multiple_choice'
        };
        
        console.log('新题目:', questionCounter, questionNumber, questionText);
      } 
      // 解析选择题选项 - 改进选项识别
      else if (currentQuestion && /^[ABCD][\.\s、]/.test(trimmedLine)) {
        const optionMatch = trimmedLine.match(/^([ABCD])[\.\s、](.+)/);
        if (optionMatch) {
          const optionKey = optionMatch[1];
          const optionText = optionMatch[2].trim();
          
          currentQuestion.options.push({
            key: optionKey,
            text: optionText,
            id: `${currentQuestion.id}_option_${optionKey}` // 确保选项也有唯一ID
          });
          
          console.log('添加选项:', optionKey, optionText);
        }
      } 
      // 检查是否为填空题或补充题目内容
      else if (currentQuestion && trimmedLine && !trimmedLine.startsWith('##')) {
        // 如果包含空白符号，判断为填空题
        if (trimmedLine.includes('_____') || trimmedLine.includes('___') || trimmedLine.includes('______')) {
          currentQuestion.type = 'fill_blank';
          currentQuestion.question += ' ' + trimmedLine;
          console.log('识别为填空题:', currentQuestion.question);
        } 
        // 如果是选择题但还没有选项，可能是题目的续行
        else if (currentQuestion.type === 'multiple_choice' && currentQuestion.options.length === 0) {
          currentQuestion.question += ' ' + trimmedLine;
          console.log('补充题目内容:', currentQuestion.question);
        }
      }
    });
    
    // 保存最后一题
    if (currentQuestion) {
      console.log('保存最后一题:', currentQuestion.id, '选项数量:', currentQuestion.options.length);
      questions.push(currentQuestion);
    }
    
    // 处理没有明确ABCD选项的情况，尝试从题目中提取
    questions.forEach((question, qIndex) => {
      if (question.type === 'multiple_choice' && question.options.length === 0) {
        console.log('尝试从题目文本中提取选项:', question.question);
        
        // 查找可能的选项模式
        const optionPatterns = [
          /[ABCD][\.\s、]([^ABCD]*?)(?=[ABCD][\.\s、]|$)/g,
          /[①②③④][\.\s、]([^①②③④]*?)(?=[①②③④][\.\s、]|$)/g
        ];
        
        for (const pattern of optionPatterns) {
          const matches = question.question.matchAll(pattern);
          const extractedOptions = [];
          
          for (const match of matches) {
            const key = match[0].charAt(0);
            const text = match[1].trim();
            if (text) {
              extractedOptions.push({ 
                key, 
                text,
                id: `${question.id}_extracted_option_${key}` // 确保提取的选项也有唯一ID
              });
            }
          }
          
          if (extractedOptions.length >= 2) {
            question.options = extractedOptions;
            // 清理题目文本，移除选项部分
            question.question = question.question.replace(pattern, '').trim();
            console.log('成功提取选项:', extractedOptions.length, '个');
            break;
          }
        }
        
        // 如果仍然没有选项，判断为填空题
        if (question.options.length === 0) {
          question.type = 'fill_blank';
          console.log('转换为填空题');
        }
      }
    });
    
    console.log('解析完成，共', questions.length, '道题目');
    questions.forEach((q, i) => {
      console.log(`题目${i+1}: ${q.type}, ID: ${q.id}, 选项数: ${q.options.length}`);
    });
    
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
      const currentTime = Date.now();
      const totalDuration = behaviorData.totalStartTime ? currentTime - behaviorData.totalStartTime : 0;
      
      const detailedData = {
        answers: answers,
        timing_data: answerTimingData,
        behavior_data: {
          ...behaviorData,
          totalDuration: totalDuration,
          completionTime: new Date().toISOString()
        },
        modification_data: answerModifications,
        question_start_times: questionStartTimes,
        metadata: {
          total_questions: currentQuestionCount,
          completion_rate: Object.keys(answers).length / currentQuestionCount,
          average_time_per_question: totalDuration / Object.keys(answers).length || 0
        }
      };

      console.log('提交详细答题数据:', detailedData);

      const requestData = {
        answers: answers,
        quiz_metadata: quizData?.metadata || {},
        answers_content: answersContent,
        detailed_data: detailedData
      };

      // 使用重试机制调用API
      const maxRetries = 3;
      let lastError = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`开始第${attempt}次批改API调用...`);
          
          const response = await fetch('/api/quiz-grading', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            // 添加请求超时处理
            signal: AbortSignal.timeout(120000) // 120秒超时
          });

          console.log('批改API响应状态:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('批改API错误响应:', errorText);
            
            if (response.status === 504) {
              // 504错误，可能需要重试
              if (attempt < maxRetries) {
                console.log(`504错误，等待${attempt * 2}秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, attempt * 2000));
                continue;
              }
              throw new Error('服务器响应超时，请稍后重试或联系管理员');
            } else if (response.status >= 500) {
              // 服务器错误，可能需要重试
              if (attempt < maxRetries) {
                console.log(`服务器错误${response.status}，等待${attempt}秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                continue;
              }
              throw new Error(`服务器错误 (${response.status})，请稍后重试`);
            } else {
              // 客户端错误，不重试
              throw new Error(`批改失败 (${response.status}): ${errorText}`);
            }
          }

          const data = await response.json();
          console.log('批改响应数据:', data);

          if (data.success && data.grading_results) {
            setGradingResults(data.grading_results);
            setEncouragement(data.encouragement);
            setAssessment(data.assessment);
            console.log('批改成功，显示结果');
            return; // 成功，退出重试循环
          } else {
            throw new Error(data.error || '批改结果格式错误');
          }

        } catch (fetchError) {
          console.error(`第${attempt}次批改尝试失败:`, fetchError);
          lastError = fetchError;
          
          // 特定错误处理
          if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
            if (attempt < maxRetries) {
              console.log(`请求超时，等待${attempt * 3}秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, attempt * 3000));
              continue;
            }
          } else if (fetchError.message.includes('fetch')) {
            if (attempt < maxRetries) {
              console.log(`网络错误，等待${attempt * 2}秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, attempt * 2000));
              continue;
            }
          }
          
          // 其他错误或最后一次重试失败
          if (attempt === maxRetries) {
            break;
          }
        }
      }

      // 所有重试都失败了
      throw lastError || new Error('批改服务暂时不可用，请稍后重试');

    } catch (error) {
      console.error('批改错误:', error);
      setError(error.message || '批改失败，请稍后重试');
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
              {questions.map((question, questionIndex) => (
                <div 
                  key={question.id}
                  className="p-4 border rounded-lg bg-gray-50"
                  onMouseEnter={() => recordQuestionStart(question.originalId || question.id)}
                >
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">第{questionIndex + 1}题</span>
                    <p className="font-medium text-gray-900 mt-1">{question.question}</p>
                    {answerTimingData[question.originalId || question.id] && (
                      <span className="text-xs text-gray-500 ml-2">
                        答题时间: {Math.floor(answerTimingData[question.originalId || question.id] / 1000)}秒
                        {answerModifications[question.originalId || question.id] > 1 && (
                          <span className="ml-1">| 修改{answerModifications[question.originalId || question.id] - 1}次</span>
                        )}
                      </span>
                    )}
                  </div>
                  
                  {question.type === 'multiple_choice' && question.options.length > 0 ? (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={`question-${question.id}-option-${option.key}-${optionIndex}`}
                          className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            answers[question.originalId || question.id] === option.key
                              ? 'bg-blue-100 border border-blue-300'
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-question-${question.originalId || question.id}`}
                            value={option.key}
                            checked={answers[question.originalId || question.id] === option.key}
                            onChange={(e) => handleAnswerChange(question.originalId || question.id, e.target.value)}
                            className="mr-3 h-4 w-4 text-blue-600"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm">{option.key}. {option.text}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="请输入答案..."
                        value={answers[question.originalId || question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.originalId || question.id, e.target.value)}
                        onFocus={() => recordQuestionStart(question.originalId || question.id)}
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