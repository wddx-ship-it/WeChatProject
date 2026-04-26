<template>
  <view class="settings-page">
    <!-- 学习类型管理 -->
    <view class="section-card card">
      <view class="section-title">📚 学习类型管理</view>
      <view class="type-manager">
        <view class="type-list">
          <view 
            v-for="type in allTypes" 
            :key="type"
            class="type-item"
            :class="{ 'is-default': isDefaultType(type) }"
            @longpress="handleLongPress(type)"
          >
            <text class="type-name">{{ type }}</text>
            <text v-if="!isDefaultType(type)" class="type-badge">自定义</text>
          </view>
        </view>
        <view class="add-type-btn" @click="showAddTypeDialog">
          <text class="add-icon">+</text>
          <text>添加学习类型</text>
        </view>
      </view>
    </view>

    <!-- 数据管理 -->
    <view class="section-card card">
      <view class="section-title">📦 数据管理</view>
      
      <view class="action-list">
        <view class="action-item" @click="handleExport">
          <view class="action-info">
            <text class="action-title">导出数据</text>
            <text class="action-desc">将所有学习记录导出为JSON文件</text>
          </view>
          <view class="action-arrow">›</view>
        </view>
        
        <view class="action-item" @click="handleImport">
          <view class="action-info">
            <text class="action-title">导入数据</text>
            <text class="action-desc">从JSON文件导入学习记录</text>
          </view>
          <view class="action-arrow">›</view>
        </view>
        
        <view class="action-item" @click="handleClear">
          <view class="action-info">
            <text class="action-title">清空数据</text>
            <text class="action-desc">删除所有学习记录（不可恢复）</text>
          </view>
          <view class="action-arrow delete">›</view>
        </view>
      </view>
    </view>

    <!-- 关于 -->
    <view class="section-card card">
      <view class="section-title">ℹ️ 关于</view>
      <view class="about-content">
        <view class="version-item">
          <text class="version-label">版本</text>
          <text class="version-value">1.0.0</text>
        </view>
        <view class="description">
          <text>学习计时器是一款纯前端应用，所有数据存储在本地，支持数据导出和导入。</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()

// 获取所有学习类型
const allTypes = computed(() => store.getAllStudyTypes())

// 默认类型列表
const defaultTypesList = ['数学', '英语', '编程', '阅读', '其他']

// 判断是否为默认类型
function isDefaultType(type) {
  return defaultTypesList.includes(type)
}

// 长按删除自定义类型
function handleLongPress(type) {
  if (isDefaultType(type)) {
    uni.showToast({
      title: '默认类型不可删除',
      icon: 'none'
    })
    return
  }
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除"${type}"这个学习类型吗？`,
    confirmColor: '#FF4D4F',
    success: (res) => {
      if (res.confirm) {
        const success = store.removeCustomType(type)
        if (success) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    }
  })
}

// 显示添加类型对话框
function showAddTypeDialog() {
  // #ifdef H5
  const typeName = prompt('请输入学习类型名称：')
  if (typeName && typeName.trim()) {
    const success = store.addCustomType(typeName.trim())
    if (success) {
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: '该类型已存在',
        icon: 'none'
      })
    }
  }
  // #endif
  
  // #ifdef MP-WEIXIN
  // 小程序端使用输入型modal
  uni.showModal({
    title: '添加学习类型',
    editable: true,
    placeholderText: '请输入学习类型名称',
    success: (res) => {
      if (res.confirm && res.content) {
        const typeName = res.content.trim()
        
        if (!typeName) {
          uni.showToast({
            title: '类型名称不能为空',
            icon: 'none'
          })
          return
        }
        
        const success = store.addCustomType(typeName)
        if (success) {
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '该类型已存在',
            icon: 'none'
          })
        }
      }
    }
  })
  // #endif
}

// 导出数据
function handleExport() {
  uni.showModal({
    title: '确认导出',
    content: `将导出 ${store.records.length} 条学习记录`,
    success: (res) => {
      if (res.confirm) {
        store.exportData()
      }
    }
  })
}

// 导入数据
function handleImport() {
  // #ifdef H5
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const success = store.importData(event.target.result)
        if (success) {
          uni.showToast({
            title: '导入成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '导入失败',
            icon: 'none'
          })
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
  // #endif
  
  // #ifdef MP-WEIXIN
  importForWechat()
  // #endif
}

// 微信小程序端导入实现
function importForWechat() {
  uni.showModal({
    title: '导入说明',
    content: '请从微信聊天记录中选择JSON文件，或粘贴之前复制的导出数据',
    confirmText: '选择文件',
    cancelText: '粘贴数据',
    success: (res) => {
      if (res.confirm) {
        // 从聊天文件选择
        chooseFileFromChat()
      } else {
        // 从剪贴板粘贴
        pasteFromClipboard()
      }
    }
  })
}

// 从聊天文件选择
function chooseFileFromChat() {
  wx.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['json'],
    success: (res) => {
      const filePath = res.tempFiles[0].path
      const fs = uni.getFileSystemManager()
      
      fs.readFile({
        filePath: filePath,
        encoding: 'utf8',
        success: (fileRes) => {
          const success = store.importData(fileRes.data)
          if (success) {
            uni.showToast({
              title: '导入成功',
              icon: 'success'
            })
          } else {
            uni.showToast({
              title: '导入失败',
              icon: 'none'
            })
          }
        },
        fail: (err) => {
          console.error('读取文件失败:', err)
          uni.showToast({
            title: '读取失败',
            icon: 'none'
          })
        }
      })
    },
    fail: (err) => {
      console.error('选择文件失败:', err)
      if (err.errMsg !== 'chooseMessageFile:fail cancel') {
        uni.showToast({
          title: '选择文件失败',
          icon: 'none'
        })
      }
    }
  })
}

// 从剪贴板粘贴
function pasteFromClipboard() {
  uni.getClipboardData({
    success: (res) => {
      const data = res.data
      if (data && data.length > 0) {
        const success = store.importData(data)
        if (success) {
          uni.showToast({
            title: '导入成功',
            icon: 'success'
          })
        } else {
          uni.showModal({
            title: '导入失败',
            content: '数据格式不正确，请确认是有效的JSON格式学习记录',
            showCancel: false
          })
        }
      } else {
        uni.showToast({
          title: '剪贴板为空',
          icon: 'none'
        })
      }
    },
    fail: () => {
      uni.showToast({
        title: '读取剪贴板失败',
        icon: 'none'
      })
    }
  })
}

// 清空数据
function handleClear() {
  uni.showModal({
    title: '确认清空',
    content: '此操作将删除所有学习记录,且无法恢复!',
    confirmColor: '#FF4D4F',
    success: (res) => {
      if (res.confirm) {
        store.records = []
        store.saveRecords()
        uni.showToast({
          title: '已清空',
          icon: 'success'
        })
      }
    }
  })
}

</script>

<style scoped>
.settings-page {
  padding: 20rpx;
  min-height: 100vh;
  box-sizing: border-box;
}

.section-card {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.action-list {
  border-top: 2rpx solid #f0f0f0;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}

.action-info {
  flex: 1;
}

.action-title {
  display: block;
  font-size: 30rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.action-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.action-arrow {
  font-size: 48rpx;
  color: #ccc;
  line-height: 1;
}

.action-arrow.delete {
  color: #FF4D4F;
}

.type-manager {
  padding: 20rpx 0;
}

.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.type-item {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #f0f0f0;
  border-radius: 40rpx;
  min-width: 140rpx;
}

.type-item.is-default {
  background: #e3f2fd;
}

.type-name {
  font-size: 28rpx;
  color: #333;
}

.type-badge {
  font-size: 20rpx;
  color: #fff;
  background: #4A90D9;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-left: 10rpx;
}

.add-type-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  background: #fff;
  border: 2rpx dashed #4A90D9;
  border-radius: 40rpx;
  color: #4A90D9;
  font-size: 28rpx;
}

.add-icon {
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.about-content {
  padding: 20rpx 0;
}

.version-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.version-label {
  font-size: 28rpx;
  color: #666;
}

.version-value {
  font-size: 28rpx;
  color: #333;
}

.description {
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
}
</style>
