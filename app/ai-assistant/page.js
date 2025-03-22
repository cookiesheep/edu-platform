'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';
import { Bot, RefreshCcw, Send, Loader, User } from 'lucide-react';
import { motion } from 'framer-motion';

// 生成唯一ID用于消息
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function AIAssistantPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // 当前选择的模型
    const [selectedModel, setSelectedModel] = useState('assessment');

    // 可用模型列表
    const models = [
        { id: 'assessment', name: '成绩评估', description: '分析学习数据，提供评估和建议', icon: <Bot size={24} className="mr-2" /> },
        { id: 'learningPath', name: '学习路径', description: '创建个性化学习计划', icon: <Bot size={24} className="mr-2" /> },
        { id: 'questionGenerator', name: '试题生成', description: '生成符合你水平的练习题', icon: <Bot size={24} className="mr-2" /> }
    ];

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (!session) {
                    router.push('/login?redirect=/ai-assistant');
                    return;
                }

                setUser(session.user);

                // 添加系统欢迎消息
                setMessages([
                    {
                        id: `system-welcome-${generateUniqueId()}`,
                        role: 'system',
                        content: '👋 你好！我是你的 AI 学习助手。我可以帮助你评估学习情况、推荐学习路径，或生成练习题。请选择你需要的功能并告诉我你的问题。',
                        timestamp: new Date()
                    }
                ]);

                // 检查表是否存在
                try {
                    const { count, error } = await supabase
                        .from('ai_chat_history')
                        .select('*', { count: 'exact', head: true });

                    if (error && error.code === '42P01') { // 表不存在
                        console.log('AI 聊天历史表不存在，正在创建...');
                        await createChatHistoryTable();
                    }
                } catch (e) {
                    console.log('检查表时出错，尝试创建表', e);
                    await createChatHistoryTable();
                }

                // 从数据库加载历史记录
                try {
                    const { data: chatHistory, error: historyError } = await supabase
                        .from('ai_chat_history')
                        .select('id, role, content, model, created_at')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: true })
                        .limit(50);

                    if (!historyError && chatHistory && chatHistory.length > 0) {
                        // 确保历史记录和欢迎消息不重复
                        const historyMessages = chatHistory.map(msg => ({
                            id: `db-${msg.id}`,  // 添加前缀以区分数据库记录
                            role: msg.role,
                            content: msg.content,
                            modelType: msg.model,
                            timestamp: new Date(msg.created_at)
                        }));
                        
                        // 只保留一条欢迎消息
                        setMessages(prev => {
                            const welcomeMessage = prev.find(m => m.role === 'system');
                            return [...(welcomeMessage ? [welcomeMessage] : []), ...historyMessages];
                        });
                    }
                } catch (dbError) {
                    console.error('从数据库加载聊天历史出错:', dbError);
                }
            } catch (error) {
                console.error('检查认证状态出错:', error);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    async function createChatHistoryTable() {
        try {
            // 创建 AI 聊天历史表
            await supabase.rpc('create_chat_history_table');
        } catch (e) {
            console.error('创建表失败', e);
            // 备选方案：直接在浏览器端模拟表的功能
            console.log('使用内存中的聊天历史');
        }
    }

    // 聊天自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 确保消息有唯一的ID
    useEffect(() => {
        // 检查消息是否有重复ID，如果有，重新生成新的ID
        const messageIds = new Set();
        const uniqueMessages = messages.map(msg => {
            // 如果ID已经存在或未定义，生成新ID
            if (!msg.id || messageIds.has(msg.id)) {
                const newId = `${msg.role}-${generateUniqueId()}`;
                return { ...msg, id: newId };
            }
            
            messageIds.add(msg.id);
            return msg;
        });
        
        // 如果有消息ID被更新，更新消息列表
        if (uniqueMessages.some((msg, idx) => msg.id !== messages[idx]?.id)) {
            setMessages(uniqueMessages);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        try {
            setSending(true);

            // 添加用户消息到聊天
            const userMessageId = `user-${generateUniqueId()}`;
            const userMessage = {
                id: userMessageId,
                role: 'user',
                content: input,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);
            setInput('');

            try {
                // 保存到数据库
                await supabase
                    .from('ai_chat_history')
                    .insert({
                        user_id: user.id,
                        role: 'user',
                        model: selectedModel,
                        content: input,
                        created_at: new Date().toISOString()
                    });
            } catch (e) {
                console.log('保存消息到数据库失败，仅在前端显示', e);
            }

            // 添加思考消息
            const thinkingId = `thinking-${generateUniqueId()}`;
            setMessages(prev => [...prev, {
                id: thinkingId,
                role: 'assistant',
                content: '思考中...',
                isThinking: true,
                timestamp: new Date()
            }]);

            // 调用实际的FastGPT API
            try {
                const response = await fetch('/api/ai-assistant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: input,
                        modelType: selectedModel,
                        userId: user.id
                    }),
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '获取AI响应失败');
                }
                
                const data = await response.json();
                
                // 移除思考消息，添加API返回的回复
                const assistantMessageId = `assistant-${generateUniqueId()}`;
                setMessages(prev =>
                    prev.filter(msg => msg.id !== thinkingId).concat({
                        id: assistantMessageId,
                        role: 'assistant',
                        content: data.response,
                        timestamp: new Date()
                    })
                );

                // 保存AI回复到数据库
                try {
                    await supabase
                        .from('ai_chat_history')
                        .insert({
                            user_id: user.id,
                            role: 'assistant',
                            model: selectedModel,
                            content: data.response,
                            created_at: new Date().toISOString()
                        });
                } catch (e) {
                    console.log('保存AI回复到数据库失败', e);
                }
            } catch (error) {
                console.error('调用AI API时出错:', error);
                // 显示错误消息
                setMessages(prev =>
                    prev.filter(msg => msg.id !== thinkingId).concat({
                        id: `error-${generateUniqueId()}`,
                        role: 'system',
                        content: `调用AI助手时出错: ${error.message}`,
                        isError: true,
                        timestamp: new Date()
                    })
                );
            }

            setSending(false);

        } catch (error) {
            console.error('发送消息时出错:', error);

            // 显示错误消息
            setMessages(prev =>
                prev.filter(msg => !msg.isThinking).concat({
                    id: `error-${generateUniqueId()}`,
                    role: 'system',
                    content: '发送消息时出错，请稍后重试。',
                    isError: true,
                    timestamp: new Date()
                })
            );
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = async () => {
        if (confirm('确定要清空聊天记录吗？这将删除所有历史消息。')) {
            try {
                // 从数据库删除历史记录
                if (user) {
                    try {
                        await supabase
                            .from('ai_chat_history')
                            .delete()
                            .eq('user_id', user.id);
                    } catch (e) {
                        console.log('从数据库删除历史记录失败', e);
                    }
                }

                // 只保留系统欢迎消息
                setMessages([
                    {
                        id: `system-welcome-${generateUniqueId()}`,
                        role: 'system',
                        content: '👋 你好！我是你的 AI 学习助手。我可以帮助你评估学习情况、推荐学习路径，或生成练习题。请选择你需要的功能并告诉我你的问题。',
                        timestamp: new Date()
                    }
                ]);
            } catch (error) {
                console.error('清空聊天记录时出错:', error);
            }
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        <p className="mt-4 text-gray-600">加载中...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    {/* 头部 */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Bot size={24} className="mr-2" />
                            <h1 className="text-xl font-bold">AI 学习助手</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleClearChat}
                                className="text-xs px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors flex items-center"
                            >
                                <RefreshCcw size={14} className="mr-1" />
                                清空聊天记录
                            </button>
                        </div>
                    </div>

                    {/* 模型选择器 */}
                    <div className="bg-gray-50 border-b border-gray-200 p-3 grid grid-cols-3 gap-2 text-sm">
                        {models.map(model => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModel(model.id)}
                                className={`rounded-lg p-2 transition-all duration-300 flex flex-col items-center justify-center ${
                                    selectedModel === model.id
                                    ? 'bg-primary-100 border-primary-300 border text-primary-800 shadow-sm'
                                    : 'hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                            >
                                <span className="text-lg mb-1">{model.icon}</span>
                                <span className="font-medium">{model.name}</span>
                                <span className="text-xs text-gray-500 mt-1">{model.description}</span>
                            </button>
                        ))}
                    </div>

                    {/* 聊天内容区域 */}
                    <div className="h-[500px] overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Bot size={48} className="mb-2 text-gray-300" />
                                <p>还没有任何消息，开始提问吧！</p>
                            </div>
                        ) : (
                            messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                            message.role === 'user'
                                                ? 'bg-primary-500 text-white rounded-tr-none'
                                                : message.role === 'system'
                                                ? message.isError
                                                    ? 'bg-red-50 text-red-800 border border-red-200'
                                                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                        } ${
                                            message.role !== 'user' ? 'glass-morphism' : ''
                                        }`}
                                    >
                                        {message.role === 'user' ? (
                                            <div className="flex items-start">
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                                <User size={16} className="ml-2 mt-1 flex-shrink-0 opacity-70" />
                                            </div>
                                        ) : (
                                            <div className="flex items-start">
                                                {message.role === 'system' ? null : (
                                                    <Bot size={16} className="mr-2 mt-1 flex-shrink-0 text-primary-500" />
                                                )}
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                        )}
                                        <div className="text-xs opacity-70 mt-1 text-right">
                                            {message.timestamp.toLocaleTimeString()}
                                        </div>
                                    </motion.div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 输入区域 */}
                    <div className="border-t border-gray-200 p-3 bg-white">
                        <div className="relative flex">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`向${models.find(m => m.id === selectedModel)?.name}提问...`}
                                className="w-full border border-gray-300 rounded-l-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 max-h-24 min-h-[60px]"
                                disabled={sending}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || sending}
                                className={`bg-primary-600 rounded-r-lg px-4 flex items-center justify-center transition-all duration-300 ${
                                    !input.trim() || sending
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-primary-700'
                                }`}
                            >
                                {sending ? (
                                    <Loader className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5 text-white" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                            按 Enter 发送消息，Shift + Enter 换行
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}