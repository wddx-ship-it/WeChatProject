<template>
  <view class="custom-tab-bar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="switchTab(index, item.pagePath)"
    >
      <text class="tab-emoji">{{ item.emoji }}</text>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentIndex = ref(0)

const tabList = [
  {
    pagePath: '/pages/timer/timer',
    emoji: '⏱️',
    text: '计时'
  },
  {
    pagePath: '/pages/history/history',
    emoji: '📝',
    text: '历史'
  },
  {
    pagePath: '/pages/stats/stats',
    emoji: '📊',
    text: '统计'
  },
  {
    pagePath: '/pages/settings/settings',
    emoji: '⚙️',
    text: '设置'
  }
]

function switchTab(index, pagePath) {
  if (currentIndex.value === index) return // 防止重复点击
  
  currentIndex.value = index
  uni.switchTab({
    url: pagePath
  })
}

// 根据当前页面路径设置初始选中状态
onMounted(() => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const currentRoute = '/' + currentPage.route
    const tabIndex = tabList.findIndex(item => item.pagePath === currentRoute)
    if (tabIndex !== -1) {
      currentIndex.value = tabIndex
    }
  }
})
</script>

<style scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1rpx solid #e8e8e8;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-emoji {
  font-size: 44rpx;
  color: #7A7E83;
  line-height: 1;
  margin-bottom: 6rpx;
  transition: all 0.3s ease;
}

.tab-text {
  font-size: 24rpx;
  color: #7A7E83;
  font-weight: 400;
  transition: all 0.3s ease;
}

/* 选中状态 - 整体变蓝 */
.tab-item.active .tab-emoji {
  font-size: 48rpx;
  color: #4A90D9;
  transform: scale(1.15);
}

.tab-item.active .tab-text {
  font-size: 28rpx;
  color: #4A90D9;
  font-weight: 600;
}
</style>
