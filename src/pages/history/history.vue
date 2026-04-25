<template>
  <view class="history-page">
    <!-- 筛选器 -->
    <view class="filter-card card">
      <view class="section-title">筛选</view>
      <view class="filter-row">
        <picker mode="date" :value="filterDate" @change="onDateChange">
          <view class="date-picker">
            <text>{{ filterDate || '选择日期' }}</text>
          </view>
        </picker>
        
        <view v-if="filterDate" class="clear-btn" @click="clearFilter">
          <text>清除</text>
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="records-list">
      <view v-if="filteredRecords.length === 0" class="empty-state">
        <text>暂无学习记录</text>
      </view>
      
      <view v-for="record in filteredRecords" :key="record.id" class="record-item card">
        <view class="record-header">
          <view class="record-type">
            <text>{{ record.type }}</text>
          </view>
          <view class="record-duration">
            <text>{{ store.formatDuration(record.duration) }}</text>
          </view>
        </view>
        
        <view class="record-time">
          <text>{{ formatRecordTime(record.startTime) }} - {{ formatEndTime(record.startTime, record.duration) }}</text>
        </view>
        
        <view class="record-actions">
          <view class="delete-btn" @click="handleDelete(record.id)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()
const filterDate = ref('')

// 筛选后的记录 - 直接访问 store.records,不要 .value
const filteredRecords = computed(() => {
  const records = store.records
  
  console.log('计算 filteredRecords, store.records:', records)
  
  if (!records || !Array.isArray(records)) {
    console.warn('records 数据无效或不是数组')
    return []
  }
  
  console.log('records 数量:', records.length)
  
  if (!filterDate.value) {
    return records
  }
  
  const selectedDate = new Date(filterDate.value)
  const filtered = records.filter(record => {
    if (!record.startTime) return false
    const recordDate = new Date(record.startTime)
    return (
      recordDate.getFullYear() === selectedDate.getFullYear() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getDate() === selectedDate.getDate()
    )
  })
  
  console.log('筛选后记录数量:', filtered.length)
  return filtered
})

// 格式化记录时间
function formatRecordTime(timestamp) {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 格式化结束时间
function formatEndTime(startTime, duration) {
  const endTime = new Date(startTime + duration * 1000)
  const hours = String(endTime.getHours()).padStart(2, '0')
  const minutes = String(endTime.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 日期选择
function onDateChange(e) {
  filterDate.value = e.detail.value
}

// 清除筛选
function clearFilter() {
  filterDate.value = ''
}

// 删除记录
function handleDelete(id) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条记录吗？',
    success: (res) => {
      if (res.confirm) {
        store.deleteRecord(id)
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}

onMounted(() => {
  console.log('历史页面 onMounted')
  store.loadRecords()
  console.log('loadRecords 后 store.records:', store.records)
})
</script>

<style scoped>
.history-page {
  padding: 20rpx;
  min-height: 100vh;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.date-picker {
  flex: 1;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.clear-btn {
  padding: 20rpx 30rpx;
  background: #4A90D9;
  color: #fff;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.records-list {
  margin-top: 20rpx;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.record-item {
  padding: 30rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.record-type {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.record-duration {
  font-size: 28rpx;
  color: #4A90D9;
  font-weight: 500;
}

.record-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
}

.record-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  padding: 10rpx 20rpx;
  background: #fff;
  color: #FF4D4F;
  border: 2rpx solid #FF4D4F;
  border-radius: 12rpx;
  font-size: 24rpx;
}
</style>
