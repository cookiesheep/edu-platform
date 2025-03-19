'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好！我是你的AI学习助手，有任何问题都可以问我。' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 模拟AI响应
    const simulateAIResponse = async (query) => {
        setIsLoading(true);

        // 根据问题分类给出不同回答
        const lowerQuery = query.toLowerCase();
        let response = '';

        // 等待1-2秒，模拟AI思考
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        if (lowerQuery.includes('学习路径') || lowerQuery.includes('怎么学')) {
            response = '根据你的学习情况，我建议你先掌握基础概念，然后进行习题练习，最后做一些综合性的题目来巩固知识点。你可以按照课程章节顺序学习，每完成一个章节后做对应的练习题。';
        }
        else if (lowerQuery.includes('题') || lowerQuery.includes('问题') || lowerQuery.includes('做不出')) {
            response = '遇到难题是很正常的！建议你先回顾相关知识点，理解基本概念和解题方法。如果还有困难，可以查看课程中的例题解析，或者在论坛上向其他同学请教。我也可以帮你分析具体的题目，你可以把题目发给我。';
        }
        else if (lowerQuery.includes('考试') || lowerQuery.includes('复习')) {
            response = '备考建议：1. 制定详细的复习计划，合理分配时间；2. 掌握重点知识点和解题技巧；3. 做真题和模拟题，熟悉考试形式；4. 保持良好的作息，保证充足的休息。如果你想针对具体科目复习，可以告诉我具体是哪个科目。';
        }
        else if (lowerQuery.includes('数学')) {
            response = '数学学习需要打好基础，掌握核心概念和公式。建议你：1. 理解概念而不只是记忆公式；2. 多做习题，培养解题思路；3. 复习时注重知识点之间的联系；4. 有针对性地练习自己薄弱的部分。如果有具体的数学问题，可以详细告诉我。';
        }
        else if (lowerQuery.includes('物理')) {
            response = '学习物理的关键是理解物理概念和原理，而不仅仅是套用公式。建议：1. 认真理解基本概念和定律；2. 学会分析物理过程；3. 多做实验和思考实验原理；4. 结合实际生活中的例子加深理解。有具体的物理问题请随时向我提问。';
        }
        else if (lowerQuery.includes('化学')) {
            response = '化学学习需要记忆与理解相结合。我的建议：1. 牢记元素周期表和基本化学反应；2. 理解化学反应的原理和条件；3. 注重实验操作和观察；4. 多练习化学方程式的配平和计算题。如有具体问题，请详细描述。';
        }
        else if (lowerQuery.includes('你好') || lowerQuery.includes('hi') || lowerQuery.includes('hello')) {
            response = '你好！我是你的AI学习助手。我可以帮你解答学习上的问题，提供学习建议，或者陪你讨论学术话题。有什么我可以帮助你的吗？';
        }
        else {
            response = '你的问题很有价值！我建议你可以：1. 查看课程相关章节获取更多信息；2. 在实践中应用所学知识；3. 与其他同学交流讨论，加深理解。如果你有更具体的问题，请告诉我，我会尽力帮助你。';
        }

        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
    };

    // 处理发送消息
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // 添加用户消息
        setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
        const userMessage = inputValue;
        setInputValue('');

        // 获取AI响应
        await simulateAIResponse(userMessage);
    };

    // 自动滚动到最新消息
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            {/* 浮动按钮 */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-all z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </motion.button>

            {/* 聊天框 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-lg">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium">AI学习助手</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 h-80 overflow-y-auto bg-gray-50">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                                            message.role === 'user'
                                                ? 'bg-primary-100 text-primary-800'
                                                : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="mb-4">
                                    <div className="inline-block rounded-lg px-4 py-2 bg-white border border-gray-200 text-gray-800 shadow-sm">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="发送消息..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 disabled:bg-primary-300 transition duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}