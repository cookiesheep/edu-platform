/**
 * API客户端库
 * 包含与后端API通信的函数
 */

/**
 * 获取成绩评估
 * @param {string} userId - 用户ID
 * @param {string} subject - 科目ID
 * @param {string} period - 时间段 (week/month/quarter/year)
 * @returns {Promise<object>} 评估结果
 */
export async function fetchAssessment(userId, subject, period = 'month') {
    try {
        const response = await fetch('/api/assessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                subjectId: subject,
                period,
                includeDetails: true
            }),
        });

        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('获取评估时出错:', error);
        throw error;
    }
}

/**
 * 生成试题
 * @param {string} userId - 用户ID
 * @param {string} subject - 科目
 * @param {string} difficulty - 难度级别
 * @param {number} count - 试题数量
 * @param {Array<string>} topics - 主题列表
 * @returns {Promise<object>} 生成的试题
 */
export async function generateQuestions(userId, subject, difficulty, count, topics = []) {
    try {
        const response = await fetch('/api/questions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                subject,
                difficulty,
                count,
                topics,
            }),
        });

        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('生成试题时出错:', error);
        throw error;
    }
}

/**
 * 生成学习路径
 * @param {string} userId - 用户ID
 * @param {string} subject - 科目
 * @param {string} goal - 学习目标
 * @param {string} deadline - 截止日期
 * @param {string} currentLevel - 当前水平
 * @returns {Promise<object>} 生成的学习路径
 */
export async function generateLearningPath(userId, subject, goal, deadline, currentLevel) {
    try {
        const response = await fetch('/api/learning-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                subject,
                goal,
                deadline,
                currentLevel
            }),
        });

        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('生成学习路径时出错:', error);
        throw error;
    }
}

/**
 * 提交测验答案
 * @param {string} userId - 用户ID
 * @param {string} courseId - 课程ID
 * @param {string} chapterId - 章节ID
 * @param {Array} answers - 用户答案
 * @returns {Promise<object>} 提交结果
 */
export async function submitQuizAttempt(userId, courseId, chapterId, answers) {
    try {
        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                courseId,
                chapterId,
                answers
            }),
        });

        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('提交测验答案时出错:', error);
        throw error;
    }
}

/**
 * 更新用户进度
 * @param {string} userId - 用户ID
 * @param {string} courseId - 课程ID
 * @param {number} progressPercentage - 进度百分比
 * @param {number} completedChapters - 已完成章节数
 * @returns {Promise<object>} 更新结果
 */
export async function updateUserProgress(userId, courseId, progressPercentage, completedChapters) {
    try {
        const response = await fetch('/api/progress/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                courseId,
                progressPercentage,
                completedChapters
            }),
        });

        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('更新用户进度时出错:', error);
        throw error;
    }
}