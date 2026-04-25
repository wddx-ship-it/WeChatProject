const fs = require('fs');
const path = require('path');

// 创建 tabbar 图标目录
const iconDir = path.join(__dirname, 'src', 'static', 'tabbar');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 创建一个简单的 81x81 PNG 图标（微信小程序推荐尺寸）
// 使用纯色的 PNG 文件作为占位符
function createPngIcon(filename, color) {
  // PNG 文件头 + IHDR + IDAT + IEND
  // 这里创建一个简单的 81x81 纯色 PNG
  
  const width = 81;
  const height = 81;
  
  // 简化的 PNG 生成（使用纯色）
  // 实际项目中建议使用专业的图标生成工具
  
  // 这里我们使用 base64 编码的简单 PNG
  const pngBase64 = createSimplePng(width, height, color);
  
  const filePath = path.join(iconDir, filename);
  fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));
  console.log(`创建图标: ${filename}`);
}

// 创建简单的 PNG 数据
function createSimplePng(width, height, color) {
  // 这是一个简化的 PNG 生成器
  // 实际使用时建议使用 sharp 库或在线工具生成图标
  
  // 这里返回一个最小的有效 PNG
  // 为了简化，我们使用预定义的 PNG 结构
  
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // 简化的 PNG 数据（灰色占位符）
  // 注：这里使用一个更简单的方法 - 创建一个 1x1 的 PNG 然后让系统缩放
  
  // 最小的有效 PNG（1x1 灰色像素）
  const minimalPng = [
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, // bit depth: 8, color type: 2 (RGB)
    0x00, 0x00, 0x00, // compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, // compressed data
    0x00, 0x03, 0x00, 0x01, // 
    0x85, 0x3F, 0x5B, 0x14, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ];
  
  return Buffer.from(minimalPng).toString('base64');
}

// 图标配置
const icons = [
  { name: 'timer.png', color: '#999999' },
  { name: 'timer-active.png', color: '#4A90D9' },
  { name: 'history.png', color: '#999999' },
  { name: 'history-active.png', color: '#4A90D9' },
  { name: 'stats.png', color: '#999999' },
  { name: 'stats-active.png', color: '#4A90D9' },
  { name: 'settings.png', color: '#999999' },
  { name: 'settings-active.png', color: '#4A90D9' }
];

// 生成所有图标
console.log('开始生成 PNG 图标...');
icons.forEach(icon => {
  createPngIcon(icon.name, icon.color);
});

console.log('\n✅ 图标生成完成！');
console.log('📁 图标位置:', iconDir);
console.log('\n⚠️  提示：当前生成的是占位图标，建议后续替换为设计好的正式图标。');
console.log('📐 推荐尺寸：81x81 像素（微信小程序标准）');
