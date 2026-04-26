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
          v-for="type in allTypes" 
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStudyStore } from '@/stores/studyStore'

const store = useStudyStore()

// 获取所有学习类型（默认 + 自定义）
const allTypes = computed(() => store.getAllStudyTypes())

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