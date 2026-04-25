<template>
  <view class="timer-page">
    <!-- 计时器显示 -->
    <view class="timer-card card">
      <view class="timer-display">
        <text class="time-text">{{ formatTime(store.currentDuration) }}</text>
      </view>
      
      <view class="status-info">
        <text v-if="store.isStudying" class="status-text">学习中...</text>
        <text v-else class="status-text idle">准备开始</text>
      </view>
    </view>

    <!-- 学习类型选择 -->
    <view class="type-selector card" v-if="!store.isStudying">
      <view class="section-title">选择学习类型</view>
      <view class="type-list">
        <view 
          v-for="type in studyTypes" 
          :key="type"
          class="type-item"
          :class="{ active: store.studyType === type }"
          @click="store.studyType = type"
        >
          <text>{{ type }}</text>
        </view>
      </view>
    </view>

    <!-- 控制按钮 -->
    <view class="control-section">
      <view v-if="!store.isStudying" class="btn-primary" @click="handleStartStudy">
        <text>开始学习</text>
      </view>
      <view v-else class="btn-danger" @click="handleStopStudy">
        <text>停止学习</text>
      </view>
    </view>

    <!-- 当前会话信息 -->
    <view v-if="store.isStudying && store.currentSession" class="session-info card">
      <view class="info-item">
        <text class="label">学习类型：</text>
        <text class="value">{{ store.currentSession.type }}</text>
      </view>
      <view class="info-item">
        <text class="label">开始时间：</text>
        <text class="value">{{ formatStartTime(store.currentSession.startTime) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()

const studyTypes = ['数学', '英语', '编程', '阅读', '其他']
let timerId = null

// 格式化时间显示
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return [hours, minutes, secs]
    .map(v => String(v).padStart(2, '0'))
    .join(':')
}

// 格式化开始时间
function formatStartTime(timestamp) {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 开始学习
function handleStartStudy() {
  if (!store.studyType) {
    uni.showToast({
      title: '请选择学习类型',
      icon: 'none'
    })
    return
  }
  
  store.startStudy(store.studyType)
  
  // 启动计时器更新
  timerId = setInterval(() => {
    store.updateCurrentDuration()
  }, 1000)
}

// 停止学习
function handleStopStudy() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  
  uni.showModal({
    title: '确认停止',
    content: `本次学习时长：${store.formatDuration(store.currentDuration)}，是否保存？`,
    success: (res) => {
      if (res.confirm) {
        store.stopStudy()
        uni.showToast({
          title: '已保存记录',
          icon: 'success'
        })
      } else {
        // 取消则不保存，直接重置
        store.stopStudy()
      }
    }
  })
}

onMounted(() => {
  store.loadRecords()
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
})
</script>

<style scoped>
.timer-page {
  padding: 20rpx;
  min-height: 100vh;
}

.timer-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 80rpx 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

.timer-display {
  text-align: center;
  margin-bottom: 40rpx;
}

.time-text {
  font-size: 96rpx;
  font-weight: bold;
  color: #fff;
  font-family: 'Courier New', monospace;
}

.status-info {
  text-align: center;
}

.status-text {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
}

.status-text.idle {
  color: rgba(255, 255, 255, 0.7);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.type-item {
  padding: 20rpx 40rpx;
  background: #f0f0f0;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s;
}

.type-item.active {
  background: #4A90D9;
  color: #fff;
}

.control-section {
  margin: 30rpx 0;
}

.session-info {
  margin-top: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  font-size: 28rpx;
}

.label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}
</style>
