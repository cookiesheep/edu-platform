// components/ui/AIAssistant.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, X, Minimize2, Maximize2, Loader2, MessageSquare } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好！我是你的AI学习助手，有任何问题都可以问我。我可以帮助你解答学习问题、推荐学习路径或生成练习题。' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('assessment');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // 可用模型列表
    const models = [
        { id: 'assessment', name: '成绩评估', description: '分析学习数据，提供评估和建议', icon: '📊' },
        { id: 'learningPath', name: '学习路径', description: '创建个性化学习计划', icon: '🛤️' },
        { id: 'questionGenerator', name: '试题生成', description: '生成符合你水平的练习题', icon: '📝' }
    ];

    // 获取用户信息
    useEffect(() => {
        async function getUser() {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        }
        getUser();
    }, []);

    // 自动滚动到最新消息
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 当聊天窗口打开时，聚焦输入框
    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    // 打字动画效果
    useEffect(() => {
        if (isTyping) {
            const timeout = setTimeout(() => {
                setIsTyping(false);
            }, 1000 + Math.random() * 2000);
            
            return () => clearTimeout(timeout);
        }
    }, [isTyping]);

    // 处理聊天输入提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputValue.trim() || isLoading) return;
        
        // 添加用户消息到聊天窗口
        const userMessage = inputValue.trim();
        const userMessageId = `user-${Date.now()}`;
        setMessages(prev => [...prev, { id: userMessageId, role: 'user', content: userMessage }]);
        setInputValue('');
        setIsLoading(true);
        setError(null);
        setIsTyping(true);
        
        try {
            // 调用后端API获取AI响应
            const response = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    modelType: selectedModel,
                    userId: user ? user.id : null
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '获取AI响应失败');
            }
            
            const data = await response.json();
            
            // 添加AI响应到聊天窗口
            const botMessageId = `assistant-${Date.now()}`;
            setMessages(prev => [...prev, { 
                id: botMessageId,
                role: 'assistant', 
                content: data.response
            }]);
        } catch (err) {
            console.error('AI助手请求错误:', err);
            setError(err.message || '与AI助手通信时出错');
            const errorMessageId = `error-${Date.now()}`;
            setMessages(prev => [...prev, { 
                id: errorMessageId,
                role: 'assistant', 
                isError: true, 
                content: `抱歉，发生了一个错误: ${err.message}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 处理输入框变化
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // 处理聊天窗口打开/关闭
    const toggleChat = () => {
        setIsOpen(prev => !prev);
        setIsMinimized(false);
    };

    // 处理聊天窗口最小化/最大化
    const toggleMinimize = () => {
        setIsMinimized(prev => !prev);
    };

    // 清空聊天记录
    const handleClearChat = () => {
        setMessages([
            { role: 'assistant', content: '聊天记录已清空。我是你的AI学习助手，有任何问题都可以问我。' }
        ]);
    };

    return (
        <>
            {/* 悬浮按钮 */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 focus:outline-none z-50 flex items-center justify-center"
                aria-label="打开AI助手"
            >
                {isOpen ? (
                    <X size={24} />
                ) : (
                    <div className="relative">
                        <Bot size={24} />
                        <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* 聊天窗口 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={
                            isMinimized
                                ? { opacity: 1, y: 0, scale: 0.95, height: 'auto', width: '300px' }
                                : { opacity: 1, y: 0, scale: 1, height: 'auto', width: 'auto' }
                        }
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed ${
                            isMinimized ? 'bottom-20 right-6 shadow-md' : 'bottom-6 right-6 sm:bottom-6 sm:right-6 sm:max-w-md max-w-[calc(100%-2rem)]'
                        } bg-white/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl z-40 border border-gray-200 flex flex-col`}
                        style={{ maxHeight: isMinimized ? '60px' : 'calc(80vh - 2rem)' }}
                    >
                        {isMinimized ? (
                            // 最小化状态
                            <div className="flex items-center justify-between p-3 bg-primary-50 cursor-pointer" onClick={toggleMinimize}>
                                <div className="flex items-center">
                                    <Bot size={20} className="text-primary-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-800">AI学习助手</span>
                                </div>
                                <Maximize2 size={18} className="text-gray-500 hover:text-primary-600" />
                            </div>
                        ) : (
                            // 完整状态
                            <>
                                {/* 聊天窗口标题栏 */}
                                <div className="bg-primary-50 p-3 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Bot size={20} className="text-primary-600 mr-2" />
                                        <span className="font-medium text-gray-800">AI学习助手</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={toggleMinimize}
                                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                                            aria-label="最小化"
                                        >
                                            <Minimize2 size={18} className="text-gray-500" />
                                        </button>
                                        <button
                                            onClick={toggleChat}
                                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                                            aria-label="关闭"
                                        >
                                            <X size={18} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* 模型选择器 */}
                                <div className="border-b border-gray-200 p-2 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex overflow-x-auto space-x-1 pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                            {models.map((model) => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => setSelectedModel(model.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                                                        selectedModel === model.id
                                                            ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-400'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                    title={model.description}
                                                >
                                                    <span className="mr-1">{model.icon}</span>
                                                    {model.name}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleClearChat}
                                            className="px-2 py-1 text-xs rounded-full whitespace-nowrap bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                        >
                                            清空聊天
                                        </button>
                                    </div>
                                </div>

                                {/* 聊天消息区域 */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${
                                                    msg.role === 'user'
                                                        ? 'bg-primary-600 text-white'
                                                        : msg.role === 'system'
                                                        ? 'bg-gray-200 text-gray-800'
                                                        : msg.isError
                                                        ? 'bg-red-50 text-red-800 border border-red-200'
                                                        : 'bg-white text-gray-800 border border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-start">
                                                    {msg.role !== 'user' && (
                                                        <Bot size={16} className="mr-2 mt-1 flex-shrink-0 text-primary-500" />
                                                    )}
                                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                        {msg.content}
                                                    </div>
                                                    {msg.role === 'user' && (
                                                        <User size={16} className="ml-2 mt-1 flex-shrink-0 text-white/70" />
                                                    )}
                                                </div>
                                            </motion.div>
                                        </div>
                                    ))}
                                    
                                    {/* 正在输入指示器 */}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-white border border-gray-100 rounded-lg px-4 py-2 shadow-sm"
                                            >
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                    
                                    {/* 加载指示器 */}
                                    {isLoading && !isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-100 rounded-lg px-4 py-2 shadow-sm">
                                                <Loader2 className="animate-spin h-5 w-5 text-primary-500" />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* 锚点元素，用于自动滚动 */}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* 错误提示 */}
                                {error && (
                                    <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-t border-red-100">
                                        <div className="flex items-center">
                                            <span className="mr-2">⚠️</span>
                                            {error}
                                        </div>
                                    </div>
                                )}

                                {/* 输入框 */}
                                <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 bg-white">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            ref={inputRef}
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            placeholder={`向${models.find(m => m.id === selectedModel)?.name}提问...`}
                                            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="submit"
                                            className={`bg-primary-600 text-white rounded-r-lg px-4 flex items-center justify-center transition-all duration-300 ${
                                                isLoading || !inputValue.trim() 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:bg-primary-700 active:bg-primary-800'
                                            }`}
                                            disabled={isLoading || !inputValue.trim()}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin h-5 w-5" />
                                            ) : (
                                                <Send size={18} className="transform transition-transform group-hover:translate-x-1" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 px-1">
                                        按 Enter 发送，Shift + Enter 换行
                                    </p>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}