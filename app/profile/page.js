'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import supabase from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, School, BookOpen, Bell,
    Save, AlertCircle, CheckCircle, Camera
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form data
    const [profile, setProfile] = useState({
        full_name: '',
        avatar_url: '',
        school: '',
        grade: '',
        bio: '',
        preferred_subjects: [],
        learning_goal: '',
        email_notifications: true,
        study_reminder: true
    });

    // Available options
    const gradeOptions = ['初一', '初二', '初三', '高一', '高二', '高三'];
    const subjectOptions = ['数学', '物理', '化学', '生物', '历史', '地理', '政治', '英语', '语文'];

    useEffect(() => {
        async function getProfile() {
            setLoading(true);

            try {
                // Get user session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                if (!session) {
                    router.push('/login?redirect=/profile');
                    return;
                }

                setUser(session.user);

                // Fetch user profile
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 means not found
                    console.error('Error fetching profile:', error);
                    setMessage({ type: 'error', text: '获取个人资料失败: ' + error.message });
                } else if (data) {
                    // If profile exists, populate the form
                    setProfile({
                        full_name: data.full_name || '',
                        avatar_url: data.avatar_url || '',
                        school: data.school || '',
                        grade: data.grade || '',
                        bio: data.bio || '',
                        preferred_subjects: data.preferred_subjects || [],
                        learning_goal: data.learning_goal || '',
                        email_notifications: data.email_notifications !== false,
                        study_reminder: data.study_reminder !== false
                    });
                }
            } catch (e) {
                console.error('获取用户会话或资料时出错:', e);
                setMessage({ type: 'error', text: '加载个人资料时出错' });
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, [router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            if (!user) {
                throw new Error('用户未登录');
            }

            // 先检查资料是否存在
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('检查资料时出错:', checkError);
                throw checkError;
            }

            let updateError;

            if (!existingProfile) {
                // 如果资料不存在，使用 INSERT
                console.log('创建新资料...');
                const { error } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url,
                        school: profile.school,
                        grade: profile.grade,
                        bio: profile.bio,
                        preferred_subjects: profile.preferred_subjects,
                        learning_goal: profile.learning_goal,
                        email_notifications: profile.email_notifications,
                        study_reminder: profile.study_reminder,
                        updated_at: new Date().toISOString()
                    });
                updateError = error;
            } else {
                // 如果资料存在，使用 UPDATE
                console.log('更新现有资料...');
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url,
                        school: profile.school,
                        grade: profile.grade,
                        bio: profile.bio,
                        preferred_subjects: profile.preferred_subjects,
                        learning_goal: profile.learning_goal,
                        email_notifications: profile.email_notifications,
                        study_reminder: profile.study_reminder,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);
                updateError = error;
            }

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: '个人资料已成功更新！' });

            // 刷新资料数据
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!error && data) {
                setProfile({
                    full_name: data.full_name || '',
                    avatar_url: data.avatar_url || '',
                    school: data.school || '',
                    grade: data.grade || '',
                    bio: data.bio || '',
                    preferred_subjects: data.preferred_subjects || [],
                    learning_goal: data.learning_goal || '',
                    email_notifications: data.email_notifications !== false,
                    study_reminder: data.study_reminder !== false
                });
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: '更新个人资料时出错: ' + (error.message || JSON.stringify(error))
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setProfile(prev => ({ ...prev, [name]: checked }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubjectToggle = (subject) => {
        setProfile(prev => {
            const subjects = [...prev.preferred_subjects];
            if (subjects.includes(subject)) {
                return { ...prev, preferred_subjects: subjects.filter(s => s !== subject) };
            } else {
                return { ...prev, preferred_subjects: [...subjects, subject] };
            }
        });
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-[#020617] flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#020617] pt-20 pb-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">个人资料设置</h1>
                        <p className="text-slate-400">更新您的个人信息和学习偏好</p>
                    </motion.div>

                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                className={`mb-6 p-4 rounded-xl border flex items-center ${message.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                )}
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="glass-panel rounded-2xl border border-white/10 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="md:flex">
                            {/* Sidebar */}
                            <div className="md:w-1/3 bg-[#0f172a]/50 p-8 border-r border-white/10">
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full bg-[#1e293b] overflow-hidden mb-4 ring-4 ring-white/5 shadow-xl">
                                            {profile.avatar_url ? (
                                                <img
                                                    src={profile.avatar_url}
                                                    alt={profile.full_name || '用户头像'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl font-medium text-slate-500 bg-gradient-to-br from-slate-800 to-slate-900">
                                                    {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-4 right-0 p-2 bg-cyan-600 rounded-full text-white shadow-lg cursor-pointer hover:bg-cyan-500 transition-colors">
                                            <Camera className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-1">{profile.full_name || '未设置姓名'}</h2>
                                    <p className="text-slate-400 mb-4 text-sm">{user?.email}</p>
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-6">
                                    <h3 className="font-medium text-slate-300 mb-4 flex items-center">
                                        <User className="w-4 h-4 mr-2 text-cyan-400" />
                                        账户信息
                                    </h3>
                                    <ul className="space-y-4 text-sm">
                                        <li className="flex justify-between items-center">
                                            <span className="text-slate-500">账户类型</span>
                                            <span className="font-medium text-slate-300 bg-white/5 px-2 py-1 rounded">学生</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <span className="text-slate-500">加入日期</span>
                                            <span className="font-medium text-slate-300">{new Date(user?.created_at).toLocaleDateString()}</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <span className="text-slate-500">学校</span>
                                            <span className="font-medium text-slate-300">{profile.school || '未设置'}</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <span className="text-slate-500">年级</span>
                                            <span className="font-medium text-slate-300">{profile.grade || '未设置'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="md:w-2/3 p-8 bg-[#0f172a]/30">
                                <form onSubmit={handleUpdate}>
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                                                <User className="w-5 h-5 mr-2 text-cyan-400" />
                                                基本信息
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="full_name" className="block text-sm font-medium text-slate-400 mb-2">
                                                        姓名
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="full_name"
                                                        name="full_name"
                                                        value={profile.full_name}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                        placeholder="输入您的姓名"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="avatar_url" className="block text-sm font-medium text-slate-400 mb-2">
                                                        头像URL
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="avatar_url"
                                                        name="avatar_url"
                                                        value={profile.avatar_url}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                        placeholder="https://..."
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="school" className="block text-sm font-medium text-slate-400 mb-2">
                                                        学校
                                                    </label>
                                                    <div className="relative">
                                                        <School className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                                        <input
                                                            type="text"
                                                            id="school"
                                                            name="school"
                                                            value={profile.school}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-4 py-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                            placeholder="输入学校名称"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="grade" className="block text-sm font-medium text-slate-400 mb-2">
                                                        年级
                                                    </label>
                                                    <select
                                                        id="grade"
                                                        name="grade"
                                                        value={profile.grade}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none"
                                                    >
                                                        <option value="" className="bg-[#0f172a]">选择年级</option>
                                                        {gradeOptions.map(grade => (
                                                            <option key={grade} value={grade} className="bg-[#0f172a]">{grade}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <label htmlFor="bio" className="block text-sm font-medium text-slate-400 mb-2">
                                                    个人简介
                                                </label>
                                                <textarea
                                                    id="bio"
                                                    name="bio"
                                                    rows={4}
                                                    value={profile.bio}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-[#020617]/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                                                    placeholder="简单介绍一下自己..."
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-white/10 pt-8">
                                            <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                                                <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
                                                学习偏好
                                            </h3>

                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                                    感兴趣的科目
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {subjectOptions.map(subject => (
                                                        <button
                                                            key={subject}
                                                            type="button"
                                                            onClick={() => handleSubjectToggle(subject)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${profile.preferred_subjects.includes(subject)
                                                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                                                                    : 'bg-[#020617]/50 text-slate-400 border border-white/10 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                        >
                                                            {subject}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="learning_goal" className="block text-sm font-medium text-slate-400 mb-2">
                                                    学习目标
                                                </label>
                                                <textarea
                                                    id="learning_goal"
                                                    name="learning_goal"
                                                    rows={3}
                                                    value={profile.learning_goal}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-[#020617]/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                                                    placeholder="你的学习目标是什么？"
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-white/10 pt-8">
                                            <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                                                <Bell className="w-5 h-5 mr-2 text-cyan-400" />
                                                通知设置
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex items-start p-4 rounded-xl bg-[#020617]/30 border border-white/5">
                                                    <div className="flex items-center h-5 mt-1">
                                                        <input
                                                            id="email_notifications"
                                                            name="email_notifications"
                                                            type="checkbox"
                                                            checked={profile.email_notifications}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-cyan-600 border-white/10 rounded bg-[#0f172a] focus:ring-cyan-500 focus:ring-offset-[#0f172a]"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor="email_notifications" className="font-medium text-white">电子邮件通知</label>
                                                        <p className="text-slate-400 mt-1">接收关于课程更新、活动和重要公告的电子邮件。</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start p-4 rounded-xl bg-[#020617]/30 border border-white/5">
                                                    <div className="flex items-center h-5 mt-1">
                                                        <input
                                                            id="study_reminder"
                                                            name="study_reminder"
                                                            type="checkbox"
                                                            checked={profile.study_reminder}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-cyan-600 border-white/10 rounded bg-[#0f172a] focus:ring-cyan-500 focus:ring-offset-[#0f172a]"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor="study_reminder" className="font-medium text-white">学习提醒</label>
                                                        <p className="text-slate-400 mt-1">接收每日学习目标和未完成任务的提醒。</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6 border-t border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => router.back()}
                                                className="px-6 py-2.5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-slate-500 mr-3 transition-all"
                                            >
                                                取消
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-6 py-2.5 border border-transparent rounded-xl shadow-lg shadow-cyan-500/20 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                                            >
                                                {saving ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                        保存中...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        保存更改
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}