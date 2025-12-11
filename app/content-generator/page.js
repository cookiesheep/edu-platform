'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// 移除了 ImageIcon
import { FileText, Brain, Sparkles, Send, AlertCircle, CheckCircle, Loader, BookOpen, Target, Lightbulb, ExternalLink } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

export default function ContentGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  // 移除了 knowledgeImage 状态
  const [learningResources, setLearningResources] = useState([]);
  const [error, setError] = useState(null);
  const [isBackupContent, setIsBackupContent] = useState(false);
  const [isFromAssessment, setIsFromAssessment] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 表单状态
  const [cognitiveLevel, setCognitiveLevel] = useState('中级认知');
  const [priorKnowledge, setPriorKnowledge] = useState('中等');
  const [learningStyle, setLearningStyle] = useState('视觉型');
  const [motivationType, setMotivationType] = useState('兴趣驱动');
  const [knowledgePoint, setKnowledgePoint] = useState('');
  const [subjectDomain, setSubjectDomain] = useState('');
  const [conceptType, setConceptType] = useState('概念型');
  const [complexityLevel, setComplexityLevel] = useState(3);
  const [prerequisiteConcepts, setPrerequisiteConcepts] = useState('');
  const [learningObjective, setLearningObjective] = useState('理解');

  // 生成内容的函数
  const generateContent = async (params = null) => {
    // 1. 先获取当前登录用户
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || null; // 如果没登录就是 null

    if (!currentUserId) {
        console.warn("用户未登录，生成的内容将不会保存到数据库");
    }

    const currentCognitiveLevel = params?.cognitiveLevel || cognitiveLevel;
    const currentPriorKnowledge = params?.priorKnowledge || priorKnowledge;
    const currentLearningStyle = params?.learningStyle || learningStyle;
    const currentMotivationType = params?.motivationType || motivationType;
    const currentKnowledgePoint = params?.knowledgePoint || knowledgePoint;
    const currentSubjectDomain = params?.subjectDomain || subjectDomain;
    const currentPrerequisiteConcepts = params?.prerequisiteConcepts || prerequisiteConcepts;
    const currentConceptType = params?.conceptType || conceptType;
    const currentComplexityLevel = params?.complexityLevel || complexityLevel;

    if (!currentKnowledgePoint.trim() || !currentSubjectDomain.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setIsBackupContent(false);

    const requestData = {
      learner_profile: {
        cognitive_level: currentCognitiveLevel,
        prior_knowledge: [currentPriorKnowledge],
        learning_style: currentLearningStyle,
        motivation_type: currentMotivationType,
        attention_span: '正常'
      },
      knowledge_point: {
        topic: currentKnowledgePoint,
        type: currentConceptType,
        complexity: currentComplexityLevel,
        prerequisites: currentPrerequisiteConcepts ? currentPrerequisiteConcepts.split(',').map(item => item.trim()) : []
      },
      content_parameters: {
        language_complexity: '适中',
        content_density: '中等',
        interactivity: '中等',
        example_ratio: '30%'
      },
      userId: currentUserId // ✅ 这里现在发送的是真实的 User ID
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    fetch('/api/content-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      signal: controller.signal,
    })
    .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          return response.json().then(errorData => {
            setError(errorData.error || '内容生成失败');
            setIsGenerating(false);
          });
        }
        return response.json();
      })
      .then(data => {
        if (!data) return;
        if (data.success && data.learning_content) {
          setGeneratedContent(data.learning_content.content);
          // 移除了 setKnowledgeImage
          setLearningResources(data.learning_content.learning_resources || []);
        } else if (data.content) {
          setGeneratedContent(data.content);
        } else {
          setError('返回数据格式异常');
        }
        if (data.isBackup) {
          setIsBackupContent(true);
        }
        setIsGenerating(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        setError(err.name === 'AbortError' ? '请求超时，请检查网络连接后重试' : err.message || '生成内容时发生错误');
        setIsGenerating(false);
      });
  };

  // 从sessionStorage读取评估结果参数并自动生成
  useEffect(() => {
    const paramsStr = sessionStorage.getItem('contentGeneratorParams');
    if (paramsStr) {
      const params = JSON.parse(paramsStr);
      setCognitiveLevel(params.cognitiveLevel || '中级认知');
      setPriorKnowledge(params.priorKnowledge || '中等');
      setLearningStyle(params.learningStyle || '视觉型');
      setMotivationType(params.motivationType || '兴趣驱动');
      setKnowledgePoint(params.knowledgePoint || '');
      setSubjectDomain(params.subjectDomain || '');
      setPrerequisiteConcepts(params.prerequisiteConcepts || '');
      setConceptType(params.conceptType || '概念型');
      setComplexityLevel(params.complexityLevel || 3);
      setLearningObjective(params.learningObjective || '理解');
      
      setIsFromAssessment(true);
      sessionStorage.removeItem('contentGeneratorParams');
      generateContent(params);
    }
  }, []);

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    generateContent();
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "智能分析",
      description: "基于学习者特征智能分析最适合的内容结构"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "精准匹配",
      description: "根据认知水平和学习目标精准定制内容"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "个性化生成",
      description: "考虑学习风格和动机类型，生成个性化学习材料"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#020617] pt-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

        {/* 页面头部 */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#020617] to-[#020617] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* 页面标题 - 从评估结果跳转时不显示 */}
            {!isFromAssessment && (
              <>
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mr-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                        智能学习 <span className="text-gradient-primary">内容生成</span>
                      </h1>
                      <p className="text-lg text-slate-400">
                        基于 AI 的个性化学习内容生成系统
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    根据学习者特征和知识点要求，智能生成精准适配的个性化教学内容，
                    让每个学习者都能获得最适合自己的学习体验
                  </p>
                </motion.div>

                {/* 特色功能介绍 */}
                <motion.div
                  className="grid md:grid-cols-3 gap-6 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {features.map((feature, index) => (
                    <div key={index} className="glass-panel rounded-xl p-6 text-center border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </motion.div>
              </>
            )}

            <div className={`grid grid-cols-1 ${isFromAssessment ? '' : 'lg:grid-cols-5'} gap-8`}>

              {/* 左侧表单 */}
              {!isFromAssessment && (
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                <div className="glass-panel rounded-2xl border border-white/10 p-6 sticky top-24">
                  <div className="flex items-center mb-6">
                    <Sparkles className="w-5 h-5 text-cyan-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">内容生成参数</h2>
                  </div>

                  <form onSubmit={handleGenerateContent} className="space-y-6">

                    {/* 基本信息 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        知识点信息
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          知识点 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={knowledgePoint}
                          onChange={(e) => setKnowledgePoint(e.target.value)}
                          placeholder="请输入具体知识点，如「二次方程求解」"
                          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          学科领域 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={subjectDomain}
                          onChange={(e) => setSubjectDomain(e.target.value)}
                          placeholder="请输入学科领域，如「高中数学」"
                          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          先决知识
                        </label>
                        <input
                          type="text"
                          value={prerequisiteConcepts}
                          onChange={(e) => setPrerequisiteConcepts(e.target.value)}
                          placeholder="如「一次方程、代数运算」"
                          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* 学习者模型 */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        学习者特征
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">认知水平</label>
                          <select
                            value={cognitiveLevel}
                            onChange={(e) => setCognitiveLevel(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="初级认知" className="bg-[#0f172a]">初级认知</option>
                            <option value="中级认知" className="bg-[#0f172a]">中级认知</option>
                            <option value="高级认知" className="bg-[#0f172a]">高级认知</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">先验知识</label>
                          <select
                            value={priorKnowledge}
                            onChange={(e) => setPriorKnowledge(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="基础" className="bg-[#0f172a]">基础</option>
                            <option value="中等" className="bg-[#0f172a]">中等</option>
                            <option value="深入" className="bg-[#0f172a]">深入</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">学习风格</label>
                          <select
                            value={learningStyle}
                            onChange={(e) => setLearningStyle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="视觉型" className="bg-[#0f172a]">视觉型</option>
                            <option value="文本型" className="bg-[#0f172a]">文本型</option>
                            <option value="应用型" className="bg-[#0f172a]">应用型</option>
                            <option value="社交型" className="bg-[#0f172a]">社交型</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">学习目标</label>
                          <select
                            value={learningObjective}
                            onChange={(e) => setLearningObjective(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="记忆" className="bg-[#0f172a]">记忆</option>
                            <option value="理解" className="bg-[#0f172a]">理解</option>
                            <option value="应用" className="bg-[#0f172a]">应用</option>
                            <option value="分析" className="bg-[#0f172a]">分析</option>
                            <option value="评估" className="bg-[#0f172a]">评估</option>
                            <option value="创造" className="bg-[#0f172a]">创造</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          内容复杂度: {complexityLevel}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={complexityLevel}
                          onChange={(e) => setComplexityLevel(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>简单</span>
                          <span>适中</span>
                          <span>复杂</span>
                        </div>
                      </div>
                    </div>

                    {/* 生成按钮 */}
                    <motion.button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                      whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                      whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                    >
                      {isGenerating ? (
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isGenerating ? '智能生成中...' : '生成个性化内容'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
              )}

              {/* 右侧生成结果 */}
              <motion.div
                className={isFromAssessment ? 'w-full' : 'lg:col-span-3'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="glass-panel rounded-2xl border border-white/10 p-8 min-h-[600px]">
                  <div className="flex items-center mb-8">
                    <FileText className="w-6 h-6 text-cyan-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">生成结果</h2>
                  </div>

                  {error ? (
                    <motion.div
                      className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-lg text-red-400 mb-2">生成失败</h3>
                        <p className="text-red-300/80">{error}</p>
                      </div>
                    </motion.div>
                  ) : isGenerating ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-cyan-500 rounded-full animate-spin absolute top-0 left-0" style={{
                          borderTopColor: 'transparent',
                          borderRightColor: 'transparent'
                        }}></div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mt-6 mb-2">
                        AI 正在智能生成内容...
                      </h3>
                      <p className="text-slate-400 text-center max-w-md">
                        正在分析您的学习特征和知识点要求，生成最适合的个性化学习内容
                      </p>
                      <p className="text-sm text-slate-500 mt-4">
                        预计需要 30-60 秒
                      </p>
                    </motion.div>
                  ) : generatedContent ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {isBackupContent && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm flex items-start">
                          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">提示：</span>
                            <span className="ml-1 opacity-80">AI 服务暂时不可用，显示的是备用简化内容。请稍后再试。</span>
                          </div>
                        </div>
                      )}

                      <div className="prose prose-invert max-w-none space-y-6">
                        {/* 学习内容文本 - 移除了顶部的 knowledgeImage 渲染块 */}
                        <div className="bg-[#0f172a]/50 border border-emerald-500/20 rounded-xl p-8">
                          <div className="flex items-center mb-6">
                            <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                            <h3 className="text-lg font-semibold text-white m-0">生成成功！</h3>
                          </div>
                          <div className="relative">
                            <div 
                              className={`prose prose-invert max-w-none text-slate-300 leading-relaxed transition-all ${
                                !isExpanded ? 'max-h-[12rem] overflow-hidden' : ''
                              }`}
                              style={!isExpanded ? { 
                                maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)'
                              } : {}}
                            >
                              <ReactMarkdown
                                components={{
                                  code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match ? match[1] : '';
                                    return !inline && match ? (
                                      <div className="my-4">
                                        <SyntaxHighlighter
                                          style={vscDarkPlus}
                                          language={language}
                                          PreTag="div"
                                          className="rounded-lg"
                                          {...props}
                                        >
                                          {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                      </div>
                                    ) : (
                                      <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400" {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                  p: ({ children }) => <p className="mb-4">{children}</p>,
                                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                  // 移除了 img 自定义组件，恢复默认行为（虽然我们现在不生成图片了）
                                }}
                              >
                                {generatedContent}
                              </ReactMarkdown>
                            </div>
                            {generatedContent && generatedContent.length > 500 && (
                              <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                              >
                                {isExpanded ? '收起' : '展开'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 推荐学习资源 */}
                        {learningResources && learningResources.length > 0 && (
                          <div className="bg-[#0f172a]/50 border border-purple-500/20 rounded-xl p-6">
                            <div className="flex items-center mb-4">
                              <BookOpen className="w-5 h-5 text-purple-400 mr-2" />
                              <h3 className="text-lg font-semibold text-white m-0">推荐学习资源</h3>
                            </div>
                            <div className="space-y-3">
                              {learningResources.map((resource, index) => (
                                <a
                                  key={index}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-white font-medium mb-1 group-hover:text-cyan-400 transition-colors">
                                        {resource.title}
                                      </h4>
                                      <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                                          {resource.platform}
                                        </span>
                                      </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <FileText className="w-10 h-10 text-slate-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        开始生成个性化学习内容
                      </h3>
                      <p className="text-slate-400 max-w-md mb-6">
                        请在左侧填写学习者特征和知识点信息，我们的 AI 将为您生成专属的学习内容
                      </p>
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-400">
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                        内容将根据学习风格、认知水平等因素进行个性化调整
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}