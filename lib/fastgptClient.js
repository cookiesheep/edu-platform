// lib/fastgptClient.js

/**
 * FastGPT API 客户端
 * 该模块负责调用FastGPT分享模式API
 */

// 模型分享ID常量
const MODEL_IDS = {
    assessment: 'jo87glkagm0bjuu3a8a9fscf',
    learningPath: 'w6v4iudnki84eer4e2dmwo37',
    questionGenerator: 'jidvsej3g5cofla8xsm891kd'
};

/**
 * 调用FastGPT分享模式API
 * @param {string} modelId - 模型ID
 * @param {string|object} userMessage - 用户消息
 * @returns {Promise<string>} API响应
 */
export async function callFastgptShareApi(modelId, userMessage) {
    // 检查模型ID是否有效
    if (!MODEL_IDS[modelId]) {
        throw new Error(`未知的模型ID: ${modelId}`);
    }

    const shareId = MODEL_IDS[modelId];
    const apiUrl = `https://cloud.fastgpt.cn/api/v1/chat/share`;
    
    console.log(`正在调用FastGPT API，模型: ${modelId}，分享ID: ${shareId}`);
    
    try {
        // 确保消息内容是字符串
        const messageContent = typeof userMessage === 'string' 
            ? userMessage 
            : JSON.stringify(userMessage);
        
        // 构建请求体
        const requestBody = {
            shareId: shareId,
            messages: [
                { role: 'user', content: messageContent }
            ]
        };
        
        console.log('FastGPT API请求体:', JSON.stringify(requestBody));
        
        // 发送请求
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // 处理响应
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`FastGPT API错误 (${response.status}): ${errorText}`);
            throw new Error(`API请求失败: ${response.status} ${response.statusText || ''}`);
        }

        // 解析响应数据
        const responseData = await response.json();
        console.log('FastGPT API响应:', responseData);
        
        // 提取回复内容
        if (responseData && responseData.choices && 
            responseData.choices.length > 0 && 
            responseData.choices[0].message) {
            return responseData.choices[0].message.content;
        } else {
            console.error('FastGPT API返回了意外的响应格式:', responseData);
            throw new Error('API响应格式错误');
        }
    } catch (error) {
        console.error('调用FastGPT API时出错:', error);
        throw error;
    }
}

/**
 * 获取成绩评估
 */
export async function getAssessment(data) {
    return callFastgptShareApi('assessment', data);
}

/**
 * 获取学习路径
 */
export async function getLearningPath(data) {
    return callFastgptShareApi('learningPath', data);
}

/**
 * 获取练习题
 */
export async function getQuestions(data) {
    return callFastgptShareApi('questionGenerator', data);
}

export default {
    getAssessment,
    getLearningPath,
    getQuestions,
    MODEL_IDS
};