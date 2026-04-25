# 快速开始指南

## 项目已创建完成 ✅

你现在拥有一个完整的学习计时器 uni-app 微信小程序项目！

## 📁 项目结构

```
weChatProject/
├── src/                     # 源代码目录
│   ├── pages/              # 4个页面
│   │   ├── timer/          # 计时页面（首页）
│   │   ├── history/        # 历史记录页面
│   │   ├── stats/          # 统计分析页面
│   │   └── settings/       # 设置页面
│   ├── stores/             # Pinia 状态管理
│   │   └── studyStore.js   # 学习记录核心逻辑
│   ├── static/             # 静态资源（图标等）
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口文件
│   ├── index.html          # H5 入口
│   ├── pages.json          # 页面路由和 TabBar 配置
│   └── manifest.json       # 应用配置
├── package.json            # 依赖配置
├── vite.config.js          # Vite 配置
├── project.config.json     # 微信开发者工具配置
└── README.md               # 详细文档
```

## 🚀 立即运行

### 方式一：H5 浏览器预览（推荐新手）

```bash
npm run dev:h5
```

然后在浏览器访问：**http://localhost:5173**

✅ 优点：实时热更新，开发体验好  
✅ 适合：日常开发、功能测试

### 方式二：微信小程序（最终目标）

#### 开发模式

1. **编译代码**
   ```bash
   npm run dev:mp-weixin
   ```
   编译输出在：`dist/dev/mp-weixin`

2. **导入到微信开发者工具**
   - 打开微信开发者工具
   - 选择"导入项目"
   - 项目目录选择：`dist/dev/mp-weixin`
   - AppID: `wx08098c72c3089cfc`
   - 点击"导入"

3. **预览效果**
   - 导入后自动编译
   - 在模拟器中查看效果
   - 可以使用真机调试

#### 生产发布

1. **构建生产版本**
   ```bash
   npm run build:mp-weixin
   ```
   构建输出在：`dist/build/mp-weixin`

2. **上传到微信后台**
   - 用微信开发者工具打开 `dist/build/mp-weixin`
   - 点击"上传"按钮
   - 填写版本号和备注
   - 在微信公众平台提交审核

## 💡 核心功能

### 1️⃣ 学习计时（timer 页面）
- 选择学习类型（数学、英语、编程、阅读、其他）
- 点击"开始学习"启动计时器
- 实时显示学习时长（HH:MM:SS 格式）
- 点击"停止学习"保存记录

### 2️⃣ 历史记录（history 页面）
- 查看所有学习记录
- 按日期筛选记录
- 删除不需要的记录
- 每条记录显示：类型、时长、开始/结束时间

### 3️⃣ 统计分析（stats 页面）
- **本周统计**: 最近 7 天的学习数据
- **本月统计**: 最近 30 天的学习数据
- **总体统计**: 所有记录的汇总
- **类型分布**: 各学习类型的时长占比（带进度条可视化）

### 4️⃣ 设置（settings 页面）
- **导出数据**: 将所有记录导出为 JSON 文件
- **导入数据**: 从 JSON 文件恢复记录
- **清空数据**: 删除所有记录（不可恢复）
- **关于信息**: 版本号和应用说明

## 🔧 常用操作

### 修改学习类型
编辑 `src/pages/timer/timer.vue`，找到 `studyTypes` 数组：
```javascript
const studyTypes = ['数学', '英语', '编程', '阅读', '其他']
```

### 修改主题颜色
编辑 `src/App.vue` 中的全局样式，修改颜色值：
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 添加新页面
1. 在 `src/pages/` 创建新页面文件夹
2. 在 `src/pages.json` 的 `pages` 数组中添加路由
3. 如需加入 TabBar，在 `tabBar.list` 中添加配置

### 替换 TabBar 图标
将 `src/static/tabbar/` 中的 SVG 文件替换为 PNG 文件，然后更新 `pages.json` 中的路径。

## 🐛 常见问题

### Q1: H5 页面空白？
A: 检查浏览器控制台是否有报错，确保 `npm run dev:h5` 正常运行。

### Q2: 微信开发者工具导入后报错？
A: 
1. 确保先执行了 `npm run dev:mp-weixin` 或 `npm run build:mp-weixin`
2. 导入的目录必须是 `dist/dev/mp-weixin` 或 `dist/build/mp-weixin`
3. 检查基础库版本设置为稳定版（3.4.0 或 3.6.0）

### Q3: 数据保存在哪里？
A: 所有数据存储在本地 Storage 中，键名为 `studyRecords`。清除浏览器缓存或小程序数据会导致数据丢失，请定期导出备份。

### Q4: 如何修改 AppID？
A: 编辑 `src/manifest.json` 中的 `mp-weixin.appid` 字段，改为你自己的 AppID。

### Q5: 计时器不准确？
A: 当前实现使用 `Date.now()` 计算时间差，每秒更新一次显示，精度足够使用。

## 📝 开发建议

1. **版本控制**: 建议使用 Git 管理代码，定期提交
2. **数据备份**: 重要数据记得通过"设置 > 导出数据"备份
3. **真机测试**: 在微信开发者工具中多使用真机调试功能
4. **性能优化**: 避免高频 setData，计时器已优化为 1 秒更新一次

## 🎯 下一步

- [ ] 在 H5 端测试所有功能（`npm run dev:h5`）
- [ ] 在微信小程序中测试（导入到微信开发者工具）
- [ ] 自定义学习类型
- [ ] 替换 TabBar 图标为正式设计
- [ ] 添加更多统计图表
- [ ] 部署到生产环境

## 📞 获取帮助

如有问题，请查看：
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

**祝你开发愉快！** 🎉
