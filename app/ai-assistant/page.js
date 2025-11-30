'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';
import { Bot, Send, Loader, User, MessageCircle, Sparkles, BookOpen, Brain, Target, Copy, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isGuest, setIsGuest] = useState(false);

    // 当前选择的模型
    const [selectedModel, setSelectedModel] = useState('assessment');

    // 可用模型列表
    const models = [
        {
            id: 'assessment',
            name: '📊 成绩评估',
            description: '分析学习数据，提供详细的学习评估和改进建议',
            color: 'from-cyan-500 to-blue-600',
            example: '帮我分析一下我的数学学习情况'
        },
        {
            id: 'learningPath',
            name: '🗺️ 学习路径',
            description: '根据你的目标和水平，制定个性化学习计划',
            color: 'from-emerald-500 to-teal-600',
            example: '我想提升英语水平，请为我制定学习计划'
        },
        {
            id: 'questionGenerator',
            name: '📝 试题生成',
            description: '生成符合你当前水平的个性化练习题',
            color: 'from-purple-500 to-violet-600',
            example: '请为我生成一些高中物理力学题目'
        }
    ];

    // 平台功能介绍
    const platformFeatures = [
        {
            icon: <Brain className="w-5 h-5" />,
            title: "智能试题生成",
            desc: "AI自动生成个性化试题，支持在线答题和智能批改",
            link: "/quiz-generator"
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: "学习内容生成",
            desc: "根据学习者特征生成个性化学习内容和指南",
            link: "/content-generator"
        },
        {
            icon: <Target className="w-5 h-5" />,
            title: "课程中心",
            desc: "丰富的课程资源，系统化学习路径",
            link: "/courses"
        }
    ];

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (session) {
                    setUser(session.user);
                    setIsGuest(false);
                } else {
                    // 设置为游客模式，无需强制登录
                    setIsGuest(true);
                }

                // 添加欢迎消息（根据登录状态定制）
                const welcomeMessage = session ?
                    `🎉 欢迎回来，${session.user.email}！我是您的专属学习伙伴。

🚀 **我们的平台功能**：
• 📊 **智能试题生成**：根据年级、学科、难度生成个性化试题，支持AI批改和学习者评估
• 📚 **学习内容生成**：基于学习者特征生成定制化学习内容和指南  
• 🎓 **课程中心**：丰富的系统化课程资源，覆盖多个学科领域
• 🤖 **AI学习助手**：实时解答问题，提供学习建议和路径规划

💡 **如何使用**：
1. 选择上方的功能模式（成绩评估/学习路径/试题生成）
2. 描述您的学习需求或问题
3. 我会根据您选择的模式提供专业建议

🎯 **使用示例**：
• "帮我分析一下我的数学学习情况"
• "我想提升英语水平，请制定学习计划"  
• "生成一些高中物理力学练习题"

现在就告诉我，您想要什么帮助吧！✨` :
                    `🎉 欢迎使用AI学习助手！我是您的智能学习伙伴。

🚀 **我们的平台功能**：
• 📊 **智能试题生成**：根据年级、学科、难度生成个性化试题，支持AI批改和学习者评估
• 📚 **学习内容生成**：基于学习者特征生成定制化学习内容和指南  
• 🎓 **课程中心**：丰富的系统化课程资源，覆盖多个学科领域
• 🤖 **AI学习助手**：实时解答问题，提供学习建议和路径规划

💡 **游客模式**：您现在以游客身份使用AI助手，可以正常对话和获取帮助。
📝 **想要更多功能？**[登录账户](/login)可以保存聊天记录和个性化设置。

🎯 **使用示例**：
• "帮我分析一下我的数学学习情况"
• "我想提升英语水平，请制定学习计划"  
• "生成一些高中物理力学练习题"

现在就告诉我，您想要什么帮助吧！✨`;

                setMessages([
                    {
                        id: `system-welcome-${generateUniqueId()}`,
                        role: 'assistant',
                        content: welcomeMessage,
                        timestamp: new Date()
                    }
                ]);

                // 只有在用户登录时才加载历史记录
                if (session) {
                    try {
                        const { count, error } = await supabase
                            .from('ai_chat_history')
                            .select('*', { count: 'exact', head: true });

                        if (error && error.code === '42P01') {
                            console.log('AI 聊天历史表不存在，正在创建...');
                            await createChatHistoryTable();
                        }
                    } catch (e) {
                        console.log('检查表时出错，尝试创建表', e);
                        await createChatHistoryTable();
                    }

                    try {
                        const { data: chatHistory, error: historyError } = await supabase
                            .from('ai_chat_history')
                            .select('id, role, content, model, created_at')
                            .eq('user_id', session.user.id)
                            .order('created_at', { ascending: true })
                            .limit(50);

                        if (!historyError && chatHistory && chatHistory.length > 0) {
                            const historyMessages = chatHistory.map(msg => ({
                                id: `db-${msg.id}`,
                                role: msg.role,
                                content: msg.content,
                                modelType: msg.model,
                                timestamp: new Date(msg.created_at)
                            }));

                            setMessages(prev => {
                                const welcomeMessage = prev.find(m => m.role === 'assistant');
                                return [...(welcomeMessage ? [welcomeMessage] : []), ...historyMessages];
                            });
                        }
                    } catch (dbError) {
                        console.error('从数据库加载聊天历史出错:', dbError);
                    }
                }
            } catch (error) {
                console.error('检查认证状态出错:', error);
                // 即使认证失败，也允许以游客身份使用
                setIsGuest(true);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    async function createChatHistoryTable() {
        try {
            await supabase.rpc('create_chat_history_table');
        } catch (e) {
            console.error('创建表失败', e);
            console.log('使用内存中的聊天历史');
        }
    }

    // 聊天自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 快速提问模板
    const quickQuestions = [
        "帮我制定数学学习计划",
        "生成英语词汇练习题",
        "分析我的学习进度",
        "推荐适合的课程"
    ];

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        try {
            setSending(true);

            const userMessageId = `user-${generateUniqueId()}`;
            const userMessage = {
                id: userMessageId,
                role: 'user',
                content: input,
                timestamp: new Date()
            };

            const currentInput = input;
            setInput('');
            setMessages(prev => [...prev, userMessage]);

            // 只有登录用户才保存用户消息到数据库
            if (user && !isGuest) {
                try {
                    await supabase
                        .from('ai_chat_history')
                        .insert({
                            user_id: user.id,
                            role: 'user',
                            model: selectedModel,
                            content: currentInput,
                            created_at: new Date().toISOString()
                        });
                } catch (e) {
                    console.log('保存用户消息到数据库失败', e);
                }
            }

            // 添加"正在思考"消息
            const thinkingId = `thinking-${generateUniqueId()}`;
            setMessages(prev => [...prev, {
                id: thinkingId,
                role: 'assistant',
                content: '🤔 正在思考中...',
                isThinking: true,
                timestamp: new Date()
            }]);

            try {
                const response = await fetch('/api/ai-assistant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: currentInput,
                        modelType: selectedModel,
                        userId: user?.id || 'guest', // 游客模式传递 'guest'
                        isGuest: isGuest
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status}`);
                }

                const data = await response.json();

                // 移除思考消息，添加AI回复
                setMessages(prev => {
                    const filteredMessages = prev.filter(m => m.id !== thinkingId);
                    return [...filteredMessages, {
                        id: `assistant-${generateUniqueId()}`,
                        role: 'assistant',
                        content: data.response || '抱歉，我暂时无法回答这个问题。',
                        modelType: selectedModel,
                        timestamp: new Date()
                    }];
                });

                // 只有登录用户才保存AI回复到数据库
                if (user && !isGuest) {
                    try {
                        await supabase
                            .from('ai_chat_history')
                            .insert({
                                user_id: user.id,
                                role: 'assistant',
                                model: selectedModel,
                                content: data.response || '抱歉，我暂时无法回答这个问题。',
                                created_at: new Date().toISOString()
                            });
                    } catch (e) {
                        console.log('保存AI回复到数据库失败', e);
                    }
                }

            } catch (error) {
                console.error('发送消息时出错:', error);

                setMessages(prev => {
                    const filteredMessages = prev.filter(m => m.id !== thinkingId);
                    return [...filteredMessages, {
                        id: `error-${generateUniqueId()}`,
                        role: 'assistant',
                        content: '抱歉，我现在遇到了一些技术问题。请稍后再试，或者尝试使用我们的其他功能：\n\n• 🧠 [智能试题生成](/quiz-generator)\n• 📚 [学习内容生成](/content-generator)\n• 🎓 [课程中心](/courses)',
                        isError: true,
                        timestamp: new Date()
                    }];
                });
            }

        } catch (error) {
            console.error('处理消息时出错:', error);
        } finally {
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
        if (window.confirm('确定要清空聊天记录吗？')) {
            const welcomeMessage = isGuest ?
                `🎉 欢迎使用AI学习助手！我是您的智能学习伙伴。

💡 **游客模式**：您现在以游客身份使用AI助手，可以正常对话和获取帮助。
📝 **想要更多功能？**[登录账户](/login)可以保存聊天记录和个性化设置。

现在就告诉我，您想要什么帮助吧！✨` :
                `🎉 欢迎回来，${user?.email}！我是您的专属学习伙伴。

现在就告诉我，您想要什么帮助吧！✨`;

            setMessages([{
                id: `system-welcome-${generateUniqueId()}`,
                role: 'assistant',
                content: welcomeMessage,
                timestamp: new Date()
            }]);

            // 只有登录用户才清空数据库记录
            if (user && !isGuest) {
                try {
                    await supabase
                        .from('ai_chat_history')
                        .delete()
                        .eq('user_id', user.id);
                } catch (e) {
                    console.log('清空数据库聊天记录失败', e);
                }
            }
        }
    };

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                    <Loader className="animate-spin h-8 w-8 text-cyan-500" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#020617] pt-20 pb-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 页面标题 */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                            <Bot className="w-10 h-10 mr-3 text-cyan-400" />
                            AI 学习助手
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            您的智能学习伙伴，提供个性化学习建议、路径规划和学习评估
                        </p>
                    </motion.div>

                    {/* 模型选择器 */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">选择AI助手模式</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {models.map((model) => (
                                <motion.button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${selectedModel === model.id
                                            ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                                            : 'border-white/10 bg-[#0f172a]/50 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className={`text-lg font-semibold mb-2 ${selectedModel === model.id ? 'text-cyan-400' : 'text-white'
                                        }`}>
                                        {model.name}
                                    </div>
                                    <div className="text-sm text-slate-400 mb-3">{model.description}</div>
                                    <div className="text-xs text-slate-500 italic">
                                        示例：{model.example}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* 聊天区域 */}
                    <motion.div
                        className="glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-[#0f172a]/60 backdrop-blur-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* 聊天头部 */}
                        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-white/10 p-4">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center text-white">
                                    <MessageCircle className="w-6 h-6 mr-2 text-cyan-400" />
                                    <span className="font-semibold">AI 学习助手</span>
                                    <span className="ml-2 text-cyan-200 text-sm bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                        当前模式: {models.find(m => m.id === selectedModel)?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleClearChat}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                    title="清空聊天记录"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 用户状态提示 */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    {isGuest ? (
                                        <>
                                            <AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
                                            <span className="text-slate-300">
                                                游客模式 · 聊天记录不会保存
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="w-4 h-4 mr-2 text-emerald-400" />
                                            <span className="text-slate-300">
                                                已登录: {user?.email} · 聊天记录已保存
                                            </span>
                                        </>
                                    )}
                                </div>
                                {isGuest && (
                                    <a
                                        href="/login"
                                        className="text-cyan-400 hover:text-cyan-300 underline text-sm transition-colors"
                                    >
                                        立即登录
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* 消息列表 */}
                        <div className="h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${message.role === 'user'
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-cyan-500/20'
                                                : 'bg-[#1e293b] text-slate-200 rounded-2xl rounded-bl-md border border-white/10'
                                            } p-4 relative group`}>
                                            {message.role === 'assistant' && (
                                                <div className="flex items-center mb-2">
                                                    <Bot className="w-4 h-4 mr-2 text-cyan-400" />
                                                    <span className="text-xs text-slate-400">AI助手</span>
                                                    {message.isThinking && <Sparkles className="w-4 h-4 ml-2 animate-pulse text-cyan-400" />}
                                                </div>
                                            )}

                                            <div className="whitespace-pre-wrap leading-relaxed">
                                                {message.isThinking ? (
                                                    <div className="flex items-center text-slate-400">
                                                        <Loader className="w-4 h-4 animate-spin mr-2" />
                                                        {message.content}
                                                    </div>
                                                ) : (
                                                    message.content
                                                )}
                                            </div>

                                            {!message.isThinking && (
                                                <button
                                                    onClick={() => copyMessage(message.content)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-black/20 hover:bg-black/40 text-white/70 hover:text-white"
                                                    title="复制消息"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            )}

                                            <div className="text-xs opacity-50 mt-2 text-right">
                                                {message.timestamp?.toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* 快速提问 */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-4">
                                <div className="text-sm text-slate-400 mb-2 flex items-center">
                                    <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                                    快速提问：
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInput(question)}
                                            className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 hover:text-white transition-all hover:border-cyan-500/30"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 输入区域 */}
                        <div className="border-t border-white/10 p-4 bg-[#0f172a]/50">
                            <div className="flex space-x-3">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`向${models.find(m => m.id === selectedModel)?.name}提问...`}
                                    className="flex-1 bg-[#020617]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                                    rows="2"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || sending}
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-3 rounded-xl hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center w-12 h-12 self-end"
                                >
                                    {sending ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* 平台功能推荐 */}
                    <motion.div
                        className="mt-8 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">
                            🚀 探索更多平台功能
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {platformFeatures.map((feature, index) => (
                                <motion.a
                                    key={index}
                                    href={feature.link}
                                    className="block p-4 bg-[#0f172a]/50 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/5 transition-all duration-300 group"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className="flex items-center mb-2">
                                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                                            {feature.icon}
                                        </div>
                                        <h4 className="ml-3 font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                            {feature.title}
                                        </h4>
                                    </div>
                                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}