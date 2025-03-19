'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

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

            // Get user session
            const { data: { session } } = await supabase.auth.getSession();
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

            if (error) {
                console.error('Error fetching profile:', error);
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

            setLoading(false);
        }

        getProfile();
    }, [router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update profile
            const { error } = await supabase
                .from('profiles')
                .upsert({
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

            if (error) throw error;

            setMessage({ type: 'success', text: '个人资料已成功更新！' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: '更新个人资料时出错: ' + error.message });
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
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">个人资料设置</h1>
                <p className="text-gray-600 mt-2">更新您的个人信息和学习偏好</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-md ${
                    message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Sidebar */}
                    <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.full_name || '用户头像'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-medium text-gray-400">
                                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold mb-1">{profile.full_name || '未设置姓名'}</h2>
                            <p className="text-gray-500 mb-4">{user?.email}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <h3 className="font-medium text-gray-700 mb-2">账户信息</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-gray-500">账户类型</span>
                                    <span className="font-medium">学生</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">加入日期</span>
                                    <span className="font-medium">{new Date(user?.created_at).toLocaleDateString()}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">学校</span>
                                    <span className="font-medium">{profile.school || '未设置'}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">年级</span>
                                    <span className="font-medium">{profile.grade || '未设置'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="md:w-2/3 p-6">
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                                姓名
                                            </label>
                                            <input
                                                type="text"
                                                id="full_name"
                                                name="full_name"
                                                value={profile.full_name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
                                                头像URL
                                            </label>
                                            <input
                                                type="text"
                                                id="avatar_url"
                                                name="avatar_url"
                                                value={profile.avatar_url}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                                                学校
                                            </label>
                                            <input
                                                type="text"
                                                id="school"
                                                name="school"
                                                value={profile.school}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                                                年级
                                            </label>
                                            <select
                                                id="grade"
                                                name="grade"
                                                value={profile.grade}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            >
                                                <option value="">选择年级</option>
                                                {gradeOptions.map(grade => (
                                                    <option key={grade} value={grade}>{grade}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                            个人简介
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            value={profile.bio}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="简单介绍一下自己..."
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">学习偏好</h3>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            感兴趣的科目
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {subjectOptions.map(subject => (
                                                <button
                                                    key={subject}
                                                    type="button"
                                                    onClick={() => handleSubjectToggle(subject)}
                                                    className={`px-3 py-1 rounded-full text-sm ${
                                                        profile.preferred_subjects.includes(subject)
                                                            ? 'bg-primary-100 text-primary-800 border border-primary-300'
                                                            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {subject}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="learning_goal" className="block text-sm font-medium text-gray-700 mb-1">
                                            学习目标
                                        </label>
                                        <textarea
                                            id="learning_goal"
                                            name="learning_goal"
                                            rows={3}
                                            value={profile.learning_goal}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="你的学习目标是什么？"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">通知设置</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="email_notifications"
                                                    name="email_notifications"
                                                    type="checkbox"
                                                    checked={profile.email_notifications}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="email_notifications" className="font-medium text-gray-700">电子邮件通知</label>
                                                <p className="text-gray-500">接收关于课程更新、活动和重要公告的电子邮件。</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="study_reminder"
                                                    name="study_reminder"
                                                    type="checkbox"
                                                    checked={profile.study_reminder}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="study_reminder" className="font-medium text-gray-700">学习提醒</label>
                                                <p className="text-gray-500">接收每日学习目标和未完成任务的提醒。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
                                    >
                                        {saving ? '保存中...' : '保存更改'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}