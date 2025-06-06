'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AssessmentReport = ({ assessment, onClose, onDownload }) => {
  const [currentSection, setCurrentSection] = useState('overview');

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
    if (score >= 90) return { color: '#10B981', bgColor: '#ECFDF5' };
    if (score >= 75) return { color: '#3B82F6', bgColor: '#EFF6FF' };
    if (score >= 60) return { color: '#F59E0B', bgColor: '#FFFBEB' };
    return { color: '#EF4444', bgColor: '#FEF2F2' };
  };

  const scoreTheme = getScoreTheme(structured_data.overall_performance.score);

  // 导航菜单项
  const navigationItems = [
    { id: 'overview', title: '总体概览', icon: '📊' },
    { id: 'cognitive', title: '认知分析', icon: '🧠' },
    { id: 'knowledge', title: '知识掌握', icon: '📚' },
    { id: 'prerequisites', title: '先验知识', icon: '🔑' },
    { id: 'learning_style', title: '学习风格', icon: '🎨' },
    { id: 'motivation', title: '学习动机', icon: '🔥' },
    { id: 'errors', title: '错误模式', icon: '🔍' },
    { id: 'recommendations', title: '学习建议', icon: '💡' },
    { id: 'summary', title: '模型总结', icon: '📋' }
  ];

  // 渲染不同的部分内容
  const renderSectionContent = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* 成绩环形图 */}
            <div className="flex items-center justify-center">
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={structured_data.overall_performance.score}
                  text={`${structured_data.overall_performance.score}%`}
                  styles={buildStyles({
                    textColor: scoreTheme.color,
                    pathColor: scoreTheme.color,
                    trailColor: '#E5E7EB'
                  })}
                />
              </div>
            </div>

            {/* 基本指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {structured_data.overall_performance.score}%
                </div>
                <div className="text-sm text-blue-500">总体正确率</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(structured_data.overall_performance.completion_rate * 100)}%
                </div>
                <div className="text-sm text-green-500">完成度</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.floor(structured_data.overall_performance.total_time / 1000)}s
                </div>
                <div className="text-sm text-yellow-500">总用时</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {structured_data.overall_performance.grade}
                </div>
                <div className="text-sm text-purple-500">等级评定</div>
              </div>
            </div>

            {/* 总体表现概览文本 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">📊 总体表现概览</h4>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: (reportSections['📊 总体表现概览'] || '暂无概览信息').replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>
        );
      
      case 'cognitive':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">🧠 认知维度分析</h4>
              <div 
                className="prose prose-sm max-w-none"
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
                  className={`p-4 rounded-lg text-center ${
                    structured_data.cognitive_assessment.level === 'basic' && index === 0 ? 'bg-blue-100 border-2 border-blue-300' :
                    structured_data.cognitive_assessment.level === 'intermediate' && index === 1 ? 'bg-blue-100 border-2 border-blue-300' :
                    structured_data.cognitive_assessment.level === 'advanced' && index === 2 ? 'bg-blue-100 border-2 border-blue-300' :
                    'bg-gray-100'
                  }`}
                >
                  <div className="font-bold">{level}</div>
                  <div className="text-sm text-gray-600 mt-1">
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
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">📚 知识掌握分析</h4>
              <div 
                className="prose prose-sm max-w-none"
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
                  className={`p-4 rounded-lg text-center ${
                    structured_data.knowledge_assessment.level === 'basic' && index === 0 ? 'bg-green-100 border-2 border-green-300' :
                    structured_data.knowledge_assessment.level === 'intermediate' && index === 1 ? 'bg-green-100 border-2 border-green-300' :
                    structured_data.knowledge_assessment.level === 'advanced' && index === 2 ? 'bg-green-100 border-2 border-green-300' :
                    'bg-gray-100'
                  }`}
                >
                  <div className="font-bold">{level}</div>
                  <div className="text-sm text-gray-600 mt-1">
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
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">🎨 学习风格分析</h4>
              <div 
                className="prose prose-sm max-w-none"
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
              ].map((style) => (
                <div 
                  key={style.type}
                  className={`p-4 rounded-lg text-center ${
                    structured_data.learning_style.primary === style.type ? 
                    'bg-purple-100 border-2 border-purple-300' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <div className="font-bold">{style.name}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'motivation':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">🔥 学习动机分析</h4>
              <div 
                className="prose prose-sm max-w-none"
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
              ].map((motivation) => (
                <div 
                  key={motivation.type}
                  className={`p-4 rounded-lg text-center ${
                    structured_data.motivation_analysis.primary_type === motivation.type ? 
                    'bg-red-100 border-2 border-red-300' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-1">{motivation.icon}</div>
                  <div className="font-bold">{motivation.name}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'recommendations':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">💡 学习建议与路径</h4>
              <div 
                className="prose prose-sm max-w-none"
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <div 
              className="prose prose-sm max-w-none"
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* 左侧导航 */}
        <div className="w-64 bg-gray-50 p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">学习者评估报告</h2>
            <p className="text-sm text-gray-600">
              评估时间: {new Date(metadata.assessed_at).toLocaleString()}
            </p>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  currentSection === item.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部工具栏 */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-bold">
              {navigationItems.find(item => item.id === currentSection)?.title || '评估报告'}
            </h3>
            <div className="flex space-x-2">
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  下载报告
                </button>
              )}
              <button
                onClick={onClose}
                className="flex items-center px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                关闭
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderSectionContent()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssessmentReport; 