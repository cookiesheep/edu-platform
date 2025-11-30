/**
 * 合并类名工具函数
 * 用于合并多个类名字符串，并移除重复或空白类名
 *
 * @param  {...string} inputs - 要合并的类名
 * @returns {string} 合并后的类名字符串
 */
export function cn(...inputs) {
    // 过滤掉所有假值（如null、undefined、false、''等）
    const classes = inputs.filter(Boolean);

    // 类名字符串数组转换为单个字符串，用空格连接
    return classes.join(' ');
}

/**
 * 格式化日期工具函数
 *
 * @param {Date} date - 要格式化的日期对象
 * @param {string} format - 格式化模式，默认为'yyyy-MM-dd'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'yyyy-MM-dd') {
    if (!date) return '';

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('yyyy', year)
        .replace('MM', month)
        .replace('dd', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 生成唯一ID工具函数
 *
 * @param {string} prefix - ID前缀
 * @returns {string} 生成的唯一ID
 */
export function uniqueId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 防抖函数
 * 延迟执行函数，如果在等待期间再次调用则重置计时器
 *
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 包装后的函数
 */
export function debounce(func, wait = 300) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * 限制函数的执行频率
 *
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 包装后的函数
 */
export function throttle(func, limit = 300) {
    let inThrottle;

    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}