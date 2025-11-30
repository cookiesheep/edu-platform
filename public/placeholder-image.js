// 这个文件会在构建时创建一个占位图片
const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建一个600x400的画布
const canvas = createCanvas(600, 400);
const ctx = canvas.getContext('2d');

// 绘制背景
ctx.fillStyle = '#4F46E5';
ctx.fillRect(0, 0, 600, 400);

// 绘制文字
ctx.font = 'bold 40px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('AI 学习平台', 300, 200);

// 将画布导出为PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/placeholder-image.png', buffer);

console.log('占位图片已创建: ./public/placeholder-image.png'); 