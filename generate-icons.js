const fs = require('fs')
const path = require('path')

// 创建 tabbar 图标目录
const iconDir = path.join(__dirname, 'static', 'tabbar')

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true })
}

// 创建简单的 SVG 图标（作为临时占位）
const icons = {
  'timer': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#999" stroke="#999" stroke-width="2"/><line x1="24" y1="12" x2="24" y2="26" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="26" x2="34" y2="30" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  'timer-active': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#4A90D9" stroke="#4A90D9" stroke-width="2"/><line x1="24" y1="12" x2="24" y2="26" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="26" x2="34" y2="30" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  'history': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="28" rx="2" fill="#999" stroke="#999" stroke-width="2"/><line x1="14" y1="18" x2="34" y2="18" stroke="#fff" stroke-width="2"/><line x1="14" y1="24" x2="34" y2="24" stroke="#fff" stroke-width="2"/><line x1="14" y1="30" x2="26" y2="30" stroke="#fff" stroke-width="2"/></svg>`,
  'history-active': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="28" rx="2" fill="#4A90D9" stroke="#4A90D9" stroke-width="2"/><line x1="14" y1="18" x2="34" y2="18" stroke="#fff" stroke-width="2"/><line x1="14" y1="24" x2="34" y2="24" stroke="#fff" stroke-width="2"/><line x1="14" y1="30" x2="26" y2="30" stroke="#fff" stroke-width="2"/></svg>`,
  'stats': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="6" y="28" width="8" height="12" fill="#999"/><rect x="20" y="20" width="8" height="20" fill="#999"/><rect x="34" y="12" width="8" height="28" fill="#999"/></svg>`,
  'stats-active': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="6" y="28" width="8" height="12" fill="#4A90D9"/><rect x="20" y="20" width="8" height="20" fill="#4A90D9"/><rect x="34" y="12" width="8" height="28" fill="#4A90D9"/></svg>`,
  'settings': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="6" fill="#999"/><path d="M24 8v4M24 36v4M8 24h4M36 24h4M12.5 12.5l2.8 2.8M32.7 32.7l2.8 2.8M12.5 35.5l2.8-2.8M32.7 15.3l2.8-2.8" stroke="#999" stroke-width="2"/></svg>`,
  'settings-active': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="6" fill="#4A90D9"/><path d="M24 8v4M24 36v4M8 24h4M36 24h4M12.5 12.5l2.8 2.8M32.7 32.7l2.8 2.8M12.5 35.5l2.8-2.8M32.7 15.3l2.8-2.8" stroke="#4A90D9" stroke-width="2"/></svg>`
}

// 写入图标文件
Object.entries(icons).forEach(([name, svg]) => {
  const filePath = path.join(iconDir, `${name}.png`)
  // 注意：这里我们实际上创建的是 SVG 文件，但命名为 PNG
  // 在实际项目中，应该使用真正的 PNG 图标
  fs.writeFileSync(filePath.replace('.png', '.svg'), svg)
})

console.log('图标已创建到:', iconDir)
console.log('注意：请替换为实际的 PNG 图标文件')
