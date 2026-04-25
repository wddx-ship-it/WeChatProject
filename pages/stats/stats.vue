<template>
  <view class="stats-page">
    <!-- 周统计 -->
    <view class="stat-card card">
      <view class="card-title">📊 本周统计</view>
      <view class="stat-content">
        <view class="stat-item">
          <text class="stat-label">学习次数</text>
          <text class="stat-value">{{ weeklyStats.totalCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">总时长</text>
          <text class="stat-value">{{ formatDuration(weeklyStats.totalDuration) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均时长</text>
          <text class="stat-value">{{ formatDuration(weeklyStats.averageDuration) }}</text>
        </view>
      </view>
      
      <!-- 类型分布 -->
      <view v-if="Object.keys(weeklyStats.typeStats).length > 0" class="type-distribution">
        <view class="distribution-title">学习类型分布</view>
        <view v-for="(duration, type) in weeklyStats.typeStats" :key="type" class="distribution-item">
          <view class="distribution-header">
            <text>{{ type }}</text>
            <text>{{ formatDuration(duration) }}</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(duration, weeklyStats.totalDuration) + '%' }"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 月统计 -->
    <view class="stat-card card">
      <view class="card-title">📈 本月统计</view>
      <view class="stat-content">
        <view class="stat-item">
          <text class="stat-label">学习次数</text>
          <text class="stat-value">{{ monthlyStats.totalCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">总时长</text>
          <text class="stat-value">{{ formatDuration(monthlyStats.totalDuration) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均时长</text>
          <text class="stat-value">{{ formatDuration(monthlyStats.averageDuration) }}</text>
        </view>
      </view>
      
      <!-- 类型分布 -->
      <view v-if="Object.keys(monthlyStats.typeStats).length > 0" class="type-distribution">
        <view class="distribution-title">学习类型分布</view>
        <view v-for="(duration, type) in monthlyStats.typeStats" :key="type" class="distribution-item">
          <view class="distribution-header">
            <text>{{ type }}</text>
            <text>{{ formatDuration(duration) }}</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(duration, monthlyStats.totalDuration) + '%' }"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 总体统计 -->
    <view class="stat-card card">
      <view class="card-title">💡 总体统计</view>
      <view class="stat-content">
        <view class="stat-item">
          <text class="stat-label">总记录数</text>
          <text class="stat-value">{{ records.length }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">累计时长</text>
          <text class="stat-value">{{ formatDuration(totalDuration) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()
const { records, weeklyStats, monthlyStats, formatDuration, loadRecords } = store

// 计算总时长
const totalDuration = computed(() => {
  return records.value.reduce((sum, record) => sum + record.duration, 0)
})

// 计算百分比
function getPercentage(value, total) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.stats-page {
  padding: 20rpx;
  min-height: 100vh;
}

.stat-card {
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.stat-content {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #4A90D9;
}

.type-distribution {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 30rpx;
}

.distribution-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.distribution-item {
  margin-bottom: 25rpx;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.progress-bar {
  height: 20rpx;
  background: #f0f0f0;
  border-radius: 10rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10rpx;
  transition: width 0.3s;
}
</style>
