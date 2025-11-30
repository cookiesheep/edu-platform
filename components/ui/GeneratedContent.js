'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GeneratedContent = ({ content }) => {
  const contentRef = useRef(null);
  
  // 使用useEffect将内容转换为HTML显示
  useEffect(() => {
    if (content && contentRef.current) {
      // 创建Markdown样式
      const markdownToHtml = (markdown) => {
        if (!markdown) return '';
        
        // 处理标题
        let html = markdown
          .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
          .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3 text-primary-700">$1</h2>')
          .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
          .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
          .replace(/^##### (.*$)/gm, '<h5 class="text-base font-bold mt-2 mb-1">$1</h5>');
        
        // 处理特殊字符和表情符号
        html = html
          .replace(/📚/g, '<span class="text-xl">📚</span>')
          .replace(/🎯/g, '<span class="text-xl">🎯</span>')
          .replace(/💡/g, '<span class="text-xl">💡</span>')
          .replace(/⚙️/g, '<span class="text-xl">⚙️</span>')
          .replace(/🔑/g, '<span class="text-xl">🔑</span>')
          .replace(/🌉/g, '<span class="text-xl">🌉</span>')
          .replace(/📝/g, '<span class="text-xl">📝</span>')
          .replace(/🧩/g, '<span class="text-xl">🧩</span>')
          .replace(/🔍/g, '<span class="text-xl">🔍</span>')
          .replace(/💼/g, '<span class="text-xl">💼</span>')
          .replace(/🔄/g, '<span class="text-xl">🔄</span>')
          .replace(/⚡/g, '<span class="text-xl">⚡</span>')
          .replace(/🤔/g, '<span class="text-xl">🤔</span>')
          .replace(/🔗/g, '<span class="text-xl">🔗</span>')
          .replace(/📊/g, '<span class="text-xl">📊</span>')
          .replace(/✅/g, '<span class="text-xl">✅</span>')
          .replace(/🧪/g, '<span class="text-xl">🧪</span>')
          .replace(/📌/g, '<span class="text-xl">📌</span>')
          .replace(/📖/g, '<span class="text-xl">📖</span>')
          .replace(/🌱/g, '<span class="text-xl">🌱</span>')
          .replace(/🗺️/g, '<span class="text-xl">🗺️</span>');
        
        // 处理水平线
        html = html.replace(/^\s*---\s*$/gm, '<hr class="my-6 border-gray-300" />');
        
        // 处理强调文本
        html = html
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // 处理引用块
        html = html.replace(/^\> (.*)$/gm, '<blockquote class="pl-4 border-l-4 border-primary-300 bg-primary-50 py-2 my-4 text-gray-700 italic">$1</blockquote>');
        
        // 处理列表
        html = html
          .replace(/^\s*[\-\*]\s+(.*)$/gm, '<li class="ml-6 py-1 list-disc">$1</li>')
          .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-6 py-1 list-decimal">$1</li>');
        
        // 将相邻的列表项包装在ul或ol中
        html = html
          .replace(/(<li class="ml-6 py-1 list-disc">.*<\/li>)(\n<li class="ml-6 py-1 list-disc">)/g, '$1<li class="ml-6 py-1 list-disc">')
          .replace(/(<li class="ml-6 py-1 list-decimal">.*<\/li>)(\n<li class="ml-6 py-1 list-decimal">)/g, '$1<li class="ml-6 py-1 list-decimal">');
        
        html = html
          .replace(/(<li class="ml-6 py-1 list-disc">.*?)(?=\n[^\n<]*<li class="ml-6 py-1 list-disc">)/g, '<ul class="my-3">$1')
          .replace(/(<li class="ml-6 py-1 list-decimal">.*?)(?=\n[^\n<]*<li class="ml-6 py-1 list-decimal">)/g, '<ol class="my-3">$1');
        
        html = html
          .replace(/(<li class="ml-6 py-1 list-disc">.*<\/li>)(?!\n<li class="ml-6 py-1 list-disc">)/g, '<ul class="my-3">$1</ul>')
          .replace(/(<li class="ml-6 py-1 list-decimal">.*<\/li>)(?!\n<li class="ml-6 py-1 list-decimal">)/g, '<ol class="my-3">$1</ol>');
        
        // 识别和处理各种图表标记
        // 1. 处理多行代码块中的图表
        html = html.replace(/```(?:mermaid)?\s*\n(graph[\s\S]*?)\n```/gm, 
          '<div class="mermaid-diagram bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">' + 
          '<div class="text-sm text-gray-500 mb-2">图表预览</div>' + 
          '<pre class="mermaid">$1</pre></div>');
        
        html = html.replace(/```\s*\n(sequenceDiagram[\s\S]*?)\n```/gm, 
          '<div class="mermaid-diagram bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">' + 
          '<div class="text-sm text-gray-500 mb-2">时序图预览</div>' + 
          '<pre class="mermaid">$1</pre></div>');
        
        html = html.replace(/```\s*\n(mindmap[\s\S]*?)\n```/gm, 
          '<div class="mermaid-diagram bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">' + 
          '<div class="text-sm text-gray-500 mb-2">思维导图预览</div>' + 
          '<pre class="mermaid">$1</pre></div>');
          
        // 2. 处理行内图表代码(用单反引号包裹)
        html = html.replace(/`(graph[\s\S]*?)`/gm, 
          '<div class="mermaid-diagram bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">' + 
          '<div class="text-sm text-gray-500 mb-2">图表预览</div>' + 
          '<pre class="mermaid">$1</pre></div>');
        
        html = html.replace(/`(sequenceDiagram[\s\S]*?)`/gm, 
          '<div class="mermaid-diagram bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">' + 
          '<div class="text-sm text-gray-500 mb-2">时序图预览</div>' + 
          '<pre class="mermaid">$1</pre></div>');
        
        html = html.replace(/`(mindmap[\s\S]*?)`/gm, 
          '<div class="mermaid-diagram bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">' + 
          '<div class="text-sm text-gray-500 mb-2">思维导图预览</div>' + 
          '<pre class="mermaid">$1</pre></div>');
        
        // 处理代码块和内联代码 - 在图表处理后
        html = html
          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-gray-800">$1</code>')
          .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded my-4 overflow-x-auto"><code>$1</code></pre>');
        
        // 处理链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
        
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
      contentRef.current.innerHTML = markdownToHtml(content);
      
      // 加载Mermaid脚本和初始化
      const loadAndInitializeMermaid = () => {
        // 检查是否有mermaid图表
        const hasMermaidDiagrams = contentRef.current.querySelectorAll('.mermaid').length > 0;
        if (!hasMermaidDiagrams) return;
        
        // 加载mermaid
        try {
          if (!window.mermaid) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
            script.async = true;
            script.onload = () => {
              if (window.mermaid) {
                window.mermaid.initialize({ 
                  startOnLoad: true,
                  theme: 'default',
                  securityLevel: 'loose',
                  fontFamily: 'sans-serif',
                  flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                  }
                });
                window.mermaid.run();
                console.log('Mermaid初始化完成');
              }
            };
            document.body.appendChild(script);
          } else if (typeof window.mermaid.run === 'function') {
            // 如果mermaid已经加载，直接重新运行
            window.mermaid.run();
            console.log('使用已加载的Mermaid');
          }
        } catch (error) {
          console.error('Mermaid加载或初始化失败', error);
          
          // 显示错误信息
          const mermaidDiagrams = contentRef.current.querySelectorAll('.mermaid-diagram');
          mermaidDiagrams.forEach(diagram => {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'text-red-500 text-sm mt-2';
            errorMsg.textContent = '图表渲染失败，请尝试刷新页面';
            diagram.appendChild(errorMsg);
          });
        }
      };
      
      // 加载并初始化Mermaid
      loadAndInitializeMermaid();
    }
  }, [content]);
  
  return (
    <motion.div
      className="bg-white rounded-lg overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="print:block flex justify-end mb-3 border-b pb-2">
        <button 
          onClick={() => window.print()}
          className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          打印/保存为PDF
        </button>
      </div>
      
      <div 
        ref={contentRef} 
        className="prose prose-primary max-w-none overflow-auto print:p-0"
      ></div>
    </motion.div>
  );
};

export default GeneratedContent; 