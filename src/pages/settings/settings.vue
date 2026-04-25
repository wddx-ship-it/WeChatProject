<template>
  <view class="settings-page">
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
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()

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
