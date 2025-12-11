'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { X, Download, BarChart2, Brain, BookOpen, Key, Palette, Flame, Search, Lightbulb, ClipboardList, Sparkles } from 'lucide-react';

const AssessmentReport = ({ assessment, onClose, onDownload }) => {
  const [currentSection, setCurrentSection] = useState('overview');
  const router = useRouter();

  // 滚动到页面顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 从评估结果提取参数并跳转到内容生成页面
  const handleGenerateContent = () => {
    const { structured_data, metadata } = assessment;
    
    // 提取认知水平
    const cognitiveLevelMap = {
      'basic': '初级认知',
      'intermediate': '中级认知',
      'advanced': '高级认知'
    };
    const cognitiveLevel = cognitiveLevelMap[structured_data.cognitive_assessment?.level] || '中级认知';
    
    // 提取先验知识（根据分数判断）
    const score = structured_data.overall_performance?.score || 60;
    const priorKnowledge = score < 60 ? '基础' : score >= 80 ? '深入' : '中等';
    
    // 提取学习风格（根据行为模式推断）
    const modificationCount = structured_data.learning_patterns?.modification_count || 0;
    const learningStyle = modificationCount > 5 ? '文本型' : modificationCount > 2 ? '应用型' : '视觉型';
    
    // 提取动机类型（根据完成率和表现推断）
    const completionRate = structured_data.overall_performance?.completion_rate || 0;
    const motivationType = completionRate >= 0.9 ? '任务导向' : score >= 80 ? '成就导向' : '兴趣驱动';
    
    // 提取学科和知识点
    const subject = metadata?.quiz_metadata?.parameters?.subject || '通用';
    const knowledgeGaps = structured_data.knowledge_gaps || [];
    const knowledgePoint = knowledgeGaps.length > 0 
      ? knowledgeGaps[0].knowledge_points?.[0] || `${subject}核心概念`
      : `${subject}核心概念`;
    
    // 提取先决知识
    const prerequisiteConcepts = knowledgeGaps
      .flatMap(gap => gap.knowledge_points || [])
      .slice(0, 3)
      .join(', ') || '';
    
    // 构建参数对象
    const params = {
      cognitiveLevel,
      priorKnowledge,
      learningStyle,
      motivationType,
      knowledgePoint,
      subjectDomain: subject,
      prerequisiteConcepts,
      conceptType: '概念型',
      complexityLevel: score < 60 ? 2 : score >= 80 ? 4 : 3,
      learningObjective: score < 60 ? '理解' : score >= 80 ? '应用' : '理解'
    };
    
    // 存储到sessionStorage
    sessionStorage.setItem('contentGeneratorParams', JSON.stringify(params));
    
    // 跳转到内容生成页面
    router.push('/content-generator');
  };

  if (!assessment) {
    return null;
  }

  const { report, structured_data, metadata } = assessment;

  // 解析报告内容为不同部分
  const parseReportSections = (reportText) => {
    const sections = {};

    // 分割不同的部分
    const sectionTitles = [
      '📊 总体表现概览',
      '🧠 认知维度分析',
      '📚 知识掌握分析',
      '🔑 先验知识评估',
      '🎨 学习风格分析',
      '🔥 学习动机分析',
      '🔍 错误模式分析',
      '💡 学习建议与路径',
      '📋 学习者模型总结'
    ];

    let currentContent = reportText;

    sectionTitles.forEach((title, index) => {
      const nextTitle = sectionTitles[index + 1];
      const titleRegex = new RegExp(`### ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=### ${nextTitle ? nextTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '$'})`);
      const match = currentContent.match(titleRegex);

      if (match) {
        sections[title] = match[1].trim();
      }
    });

    return sections;
  };

  const reportSections = parseReportSections(report);

  // 根据评分获取颜色主题
  const getScoreTheme = (score) => {
    if (score >= 90) return { color: '#10B981', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', textColor: 'text-emerald-400' };
    if (score >= 75) return { color: '#3B82F6', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20', textColor: 'text-blue-400' };
    if (score >= 60) return { color: '#F59E0B', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20', textColor: 'text-yellow-400' };
    return { color: '#EF4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', textColor: 'text-red-400' };
  };

  const scoreTheme = getScoreTheme(structured_data.overall_performance.score);

  // 导航菜单项
  const navigationItems = [
    { id: 'overview', title: '总体概览', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'cognitive', title: '认知分析', icon: <Brain className="w-4 h-4" /> },
    { id: 'knowledge', title: '知识掌握', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'prerequisites', title: '先验知识', icon: <Key className="w-4 h-4" /> },
    { id: 'learning_style', title: '学习风格', icon: <Palette className="w-4 h-4" /> },
    { id: 'motivation', title: '学习动机', icon: <Flame className="w-4 h-4" /> },
    { id: 'errors', title: '错误模式', icon: <Search className="w-4 h-4" /> },
    { id: 'recommendations', title: '学习建议', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'summary', title: '模型总结', icon: <ClipboardList className="w-4 h-4" /> }
  ];

  // 渲染不同的部分内容
  const renderSectionContent = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* 成绩环形图 */}
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 relative">
                <CircularProgressbar
                  value={structured_data.overall_performance.score}
                  text={`${structured_data.overall_performance.score}%`}
                  styles={buildStyles({
                    textColor: '#fff',
                    pathColor: scoreTheme.color,
                    trailColor: 'rgba(255,255,255,0.1)',
                    textSize: '20px'
                  })}
                />
                <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] -z-10"></div>
              </div>
            </div>

            {/* 基本指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {structured_data.overall_performance.score}%
                </div>
                <div className="text-sm text-blue-300/70">总体正确率</div>
              </div>
              <div className="text-center p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {Math.round(structured_data.overall_performance.completion_rate * 100)}%
                </div>
                <div className="text-sm text-emerald-300/70">完成度</div>
              </div>
              <div className="text-center p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {Math.floor(structured_data.overall_performance.total_time / 1000)}s
                </div>
                <div className="text-sm text-yellow-300/70">总用时</div>
              </div>
              <div className="text-center p-5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {structured_data.overall_performance.grade}
                </div>
                <div className="text-sm text-purple-300/70">等级评定</div>
              </div>
            </div>

            {/* 总体表现概览文本 */}
            <div className="bg-[#0f172a]/50 p-6 rounded-xl border border-white/10">
              <h4 className="font-bold mb-4 text-white text-lg flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-cyan-400" />
                总体表现概览
              </h4>
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['📊 总体表现概览'] || '暂无概览信息').replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>
        );

      case 'cognitive':
        return (
          <div className="space-y-6">
            <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
              <h4 className="font-bold mb-4 text-blue-400 text-lg flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                认知维度分析
              </h4>
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['🧠 认知维度分析'] || '暂无认知分析信息').replace(/\n/g, '<br>')
                }}
              />
            </div>

            {/* 认知水平可视化 */}
            <div className="grid grid-cols-3 gap-4">
              {['初级认知', '中级认知', '高级认知'].map((level, index) => (
                <div
                  key={level}
                  className={`p-4 rounded-xl text-center border transition-all ${structured_data.cognitive_assessment.level === 'basic' && index === 0 ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' :
                      structured_data.cognitive_assessment.level === 'intermediate' && index === 1 ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' :
                        structured_data.cognitive_assessment.level === 'advanced' && index === 2 ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' :
                          'bg-[#0f172a]/30 border-white/5 text-slate-500'
                    }`}
                >
                  <div className="font-bold text-lg mb-1">{level}</div>
                  <div className="text-xs opacity-70">
                    {index === 0 && '具体操作导向'}
                    {index === 1 && '有限抽象思维'}
                    {index === 2 && '精通抽象思维'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
              <h4 className="font-bold mb-4 text-emerald-400 text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                知识掌握分析
              </h4>
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['📚 知识掌握分析'] || '暂无知识掌握分析信息').replace(/\n/g, '<br>')
                }}
              />
            </div>

            {/* 知识水平指示器 */}
            <div className="grid grid-cols-3 gap-4">
              {['基础', '中等', '深入'].map((level, index) => (
                <div
                  key={level}
                  className={`p-4 rounded-xl text-center border transition-all ${
                    // 基于overall_performance.score来判断知识水平
                    (structured_data.overall_performance.score < 60 && index === 0) ||
                      (structured_data.overall_performance.score >= 60 && structured_data.overall_performance.score < 80 && index === 1) ||
                      (structured_data.overall_performance.score >= 80 && index === 2)
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#0f172a]/30 border-white/5 text-slate-500'
                    }`}
                >
                  <div className="font-bold text-lg mb-1">{level}</div>
                  <div className="text-xs opacity-70">
                    {index === 0 && '基础概念理解'}
                    {index === 1 && '关联理解有限'}
                    {index === 2 && '深度掌握关系'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'learning_style':
        return (
          <div className="space-y-6">
            <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/20">
              <h4 className="font-bold mb-4 text-purple-400 text-lg flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                学习风格分析
              </h4>
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['🎨 学习风格分析'] || '暂无学习风格分析信息').replace(/\n/g, '<br>')
                }}
              />
            </div>

            {/* 学习风格类型 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'visual', name: '视觉型', icon: '👁️' },
                { type: 'text', name: '文本型', icon: '📝' },
                { type: 'application', name: '应用型', icon: '🛠️' },
                { type: 'social', name: '社交型', icon: '👥' }
              ].map((style, index) => (
                <div
                  key={style.type}
                  className={`p-4 rounded-xl text-center border transition-all ${
                    // 基于learning_patterns数据推断学习风格
                    (structured_data.learning_patterns?.modification_count > 5 && style.type === 'text') ||
                      (structured_data.learning_patterns?.modification_count <= 2 && style.type === 'visual') ||
                      (structured_data.overall_performance?.completion_rate >= 0.9 && style.type === 'application') ||
                      (index === 0) // 默认选择第一个作为主要风格
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-[#0f172a]/30 border-white/5 text-slate-500'
                    }`}
                >
                  <div className="text-2xl mb-2">{style.icon}</div>
                  <div className="font-bold">{style.name}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'motivation':
        return (
          <div className="space-y-6">
            <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
              <h4 className="font-bold mb-4 text-red-400 text-lg flex items-center">
                <Flame className="w-5 h-5 mr-2" />
                学习动机分析
              </h4>
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['🔥 学习动机分析'] || '暂无学习动机分析信息').replace(/\n/g, '<br>')
                }}
              />
            </div>

            {/* 动机类型 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'task_oriented', name: '任务导向', icon: '🎯' },
                { type: 'interest_driven', name: '兴趣驱动', icon: '💡' },
                { type: 'achievement_oriented', name: '成就导向', icon: '🏆' },
                { type: 'application_oriented', name: '应用导向', icon: '🔧' }
              ].map((motivation, index) => (
                <div
                  key={motivation.type}
                  className={`p-4 rounded-xl text-center border transition-all ${
                    // 基于表现数据推断动机类型
                    (structured_data.overall_performance?.completion_rate >= 0.9 && motivation.type === 'task_oriented') ||
                      (structured_data.overall_performance?.score >= 80 && motivation.type === 'achievement_oriented') ||
                      (structured_data.learning_patterns?.modification_count > 3 && motivation.type === 'interest_driven') ||
                      (index === 0) // 默认选择第一个
                      ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#0f172a]/30 border-white/5 text-slate-500'
                    }`}
                >
                  <div className="text-2xl mb-2">{motivation.icon}</div>
                  <div className="font-bold">{motivation.name}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/20">
              <h4 className="font-bold mb-4 text-yellow-400 text-lg flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                学习建议与路径
              </h4>
              <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['💡 学习建议与路径'] || '暂无学习建议信息').replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>
        );

      default:
        const sectionKey = Object.keys(reportSections).find(key =>
          key.toLowerCase().includes(currentSection) ||
          currentSection.includes(key.toLowerCase().replace(/[^\w]/g, ''))
        );

        return (
          <div className="bg-[#0f172a]/50 p-6 rounded-xl border border-white/10">
            <div
              className="prose prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{
                __html: (reportSections[sectionKey] || '暂无此部分信息').replace(/\n/g, '<br>')
              }}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0f172a] border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* 左侧导航 */}
        <div className="w-64 bg-[#020617]/50 p-6 overflow-y-auto border-r border-white/10 hidden md:block">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">学习者评估报告</h2>
            <p className="text-xs text-slate-400">
              评估时间: {new Date(metadata.assessed_at).toLocaleString()}
            </p>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-all ${currentSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/30'
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col bg-[#0f172a]">
          {/* 顶部工具栏 */}
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="md:hidden mr-3">
                {navigationItems.find(item => item.id === currentSection)?.icon}
              </span>
              {navigationItems.find(item => item.id === currentSection)?.title || '评估报告'}
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateContent}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                生成个性化学习内容
              </button>
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载报告
                </button>
              )}
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors border border-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                关闭
              </button>
            </div>
          </div>

          {/* 移动端导航 (仅在小屏幕显示) */}
          <div className="md:hidden overflow-x-auto whitespace-nowrap p-4 border-b border-white/10 bg-[#020617]/30">
            <div className="flex space-x-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center ${currentSection === item.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/5'
                    }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {renderSectionContent()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssessmentReport;