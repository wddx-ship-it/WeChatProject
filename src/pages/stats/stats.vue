<template>
  <view class="stats-page">
    <!-- 周统计 -->
    <view class="stat-card card">
      <view class="card-title">📊 本周统计</view>
      <view class="stat-content">
        <view class="stat-item">
          <text class="stat-label">学习次数</text>
          <text class="stat-value">{{ weeklyStatsData.totalCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">总时长</text>
          <text class="stat-value">{{ store.formatDuration(weeklyStatsData.totalDuration) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均时长</text>
          <text class="stat-value">{{ store.formatDuration(weeklyStatsData.averageDuration) }}</text>
        </view>
      </view>
      
      <!-- 每日分布 -->
      <view v-if="weeklyDailyDistribution.length > 0" class="daily-distribution">
        <view class="distribution-title">每日学习分布</view>
        <view v-for="day in weeklyDailyDistribution" :key="day.name" class="distribution-item">
          <view class="distribution-header">
            <text>{{ day.name }}</text>
            <text>{{ store.formatDuration(day.duration) }} ({{ getPercentage(day.duration, weeklyStatsData.totalDuration) }}%)</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(day.duration, weeklyStatsData.totalDuration) + '%' }"
            ></view>
          </view>
        </view>
      </view>
      
      <!-- 类型分布 -->
      <view v-if="weeklyTypeDistribution.length > 0" class="type-distribution">
        <view class="distribution-title">学习类型分布</view>
        <view v-for="item in weeklyTypeDistribution" :key="item.type" class="distribution-item">
          <view class="distribution-header">
            <text>{{ item.type }}</text>
            <text>{{ store.formatDuration(item.duration) }} ({{ getPercentage(item.duration, weeklyStatsData.totalDuration) }}%)</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(item.duration, weeklyStatsData.totalDuration) + '%' }"
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
          <text class="stat-value">{{ monthlyStatsData.totalCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">总时长</text>
          <text class="stat-value">{{ store.formatDuration(monthlyStatsData.totalDuration) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均时长</text>
          <text class="stat-value">{{ store.formatDuration(monthlyStatsData.averageDuration) }}</text>
        </view>
      </view>
      
      <!-- 每周分布 -->
      <view v-if="monthlyWeeklyDistribution.length > 0" class="weekly-distribution">
        <view class="distribution-title">每周学习分布</view>
        <view v-for="week in monthlyWeeklyDistribution" :key="week.name" class="distribution-item">
          <view class="distribution-header">
            <text>{{ week.name }}</text>
            <text>{{ store.formatDuration(week.duration) }} ({{ getPercentage(week.duration, monthlyStatsData.totalDuration) }}%)</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(week.duration, monthlyStatsData.totalDuration) + '%' }"
            ></view>
          </view>
        </view>
      </view>
      
      <!-- 类型分布 -->
      <view v-if="monthlyTypeDistribution.length > 0" class="type-distribution">
        <view class="distribution-title">学习类型分布</view>
        <view v-for="item in monthlyTypeDistribution" :key="item.type" class="distribution-item">
          <view class="distribution-header">
            <text>{{ item.type }}</text>
            <text>{{ store.formatDuration(item.duration) }} ({{ getPercentage(item.duration, monthlyStatsData.totalDuration) }}%)</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(item.duration, monthlyStatsData.totalDuration) + '%' }"
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
          <text class="stat-value">{{ store.records ? store.records.length : 0 }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">累计时长</text>
          <text class="stat-value">{{ store.formatDuration(totalDuration) }}</text>
        </view>
      </view>
      
      <!-- 总体类型分布 -->
      <view v-if="totalTypeDistribution.length > 0" class="type-distribution">
        <view class="distribution-title">学习类型分布</view>
        <view v-for="item in totalTypeDistribution" :key="item.type" class="distribution-item">
          <view class="distribution-header">
            <text>{{ item.type }}</text>
            <text>{{ store.formatDuration(item.duration) }} ({{ getPercentage(item.duration, totalDuration) }}%)</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: getPercentage(item.duration, totalDuration) + '%' }"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()

// 计算总时长 - 修复:直接访问 store.records,不使用 .value
const totalDuration = computed(() => {
  const records = store.records || []
  if (!Array.isArray(records)) return 0
  return records.reduce((sum, record) => sum + (record.duration || 0), 0)
})

// 本周统计数据
const weeklyStatsData = computed(() => {
  return store.weeklyStats || {
    totalDuration: 0,
    totalCount: 0,
    typeStats: {},
    averageDuration: 0
  }
})

// 本月统计数据
const monthlyStatsData = computed(() => {
  return store.monthlyStats || {
    totalDuration: 0,
    totalCount: 0,
    typeStats: {},
    averageDuration: 0
  }
})

// 本周每日分布
const weeklyDailyDistribution = computed(() => {
  const records = store.records || []
  if (!Array.isArray(records) || records.length === 0) return []
  
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // 获取本周的记录
  const weekRecords = records.filter(record => {
    const recordDate = new Date(record.startTime)
    return recordDate >= weekAgo && recordDate <= now
  })
  
  // 按天分组
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const dayMap = {}
  
  weekRecords.forEach(record => {
    const date = new Date(record.startTime)
    const dayOfWeek = date.getDay()
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    
    if (!dayMap[dayKey]) {
      dayMap[dayKey] = {
        name: dayNames[dayOfWeek],
        duration: 0,
        date: date
      }
    }
    dayMap[dayKey].duration += record.duration || 0
  })
  
  // 转换为数组并排序
  return Object.values(dayMap).sort((a, b) => a.date - b.date)
})

// 本周类型分布
const weeklyTypeDistribution = computed(() => {
  const typeStats = weeklyStatsData.value.typeStats || {}
  return Object.entries(typeStats).map(([type, duration]) => ({
    type,
    duration
  }))
})

// 本月每周分布
const monthlyWeeklyDistribution = computed(() => {
  const records = store.records || []
  if (!Array.isArray(records) || records.length === 0) return []
  
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // 获取本月的记录
  const monthRecords = records.filter(record => {
    const recordDate = new Date(record.startTime)
    return recordDate >= monthAgo && recordDate <= now
  })
  
  // 按周分组
  const weekMap = {}
  
  monthRecords.forEach(record => {
    const date = new Date(record.startTime)
    // 计算这是第几周
    const weekNumber = Math.ceil((date.getDate()) / 7)
    const month = date.getMonth()
    const year = date.getFullYear()
    const weekKey = `${year}-${month}-W${weekNumber}`
    
    if (!weekMap[weekKey]) {
      weekMap[weekKey] = {
        name: `${month + 1}月第${weekNumber}周`,
        duration: 0,
        date: date
      }
    }
    weekMap[weekKey].duration += record.duration || 0
  })
  
  // 转换为数组并排序
  return Object.values(weekMap).sort((a, b) => a.date - b.date)
})

// 本月类型分布
const monthlyTypeDistribution = computed(() => {
  const typeStats = monthlyStatsData.value.typeStats || {}
  return Object.entries(typeStats).map(([type, duration]) => ({
    type,
    duration
  }))
})

// 总体类型分布
const totalTypeDistribution = computed(() => {
  const records = store.records || []
  if (!Array.isArray(records) || records.length === 0) return []
  
  const typeStats = {}
  records.forEach(record => {
    if (!typeStats[record.type]) {
      typeStats[record.type] = 0
    }
    typeStats[record.type] += record.duration || 0
  })
  
  return Object.entries(typeStats).map(([type, duration]) => ({
    type,
    duration
  }))
})

// 计算百分比
function getPercentage(value, total) {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 100)
}

onMounted(() => {
  store.loadRecords()
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

.daily-distribution,
.weekly-distribution,
.type-distribution {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 30rpx;
  margin-top: 30rpx;
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
