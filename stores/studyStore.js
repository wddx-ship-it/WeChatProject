import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStudyStore = defineStore('study', () => {
  // 状态
  const records = ref([])
  const currentSession = ref(null)
  const isStudying = ref(false)
  const startTime = ref(null)
  const studyType = ref('')

  // 计算属性
  const currentDuration = computed(() => {
    if (!startTime.value) return 0
    return Math.floor((Date.now() - startTime.value) / 1000)
  })

  const weeklyStats = computed(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weekRecords = records.value.filter(record => {
      const recordDate = new Date(record.startTime)
      return recordDate >= weekAgo && recordDate <= now
    })

    return calculateStats(weekRecords)
  })

  const monthlyStats = computed(() => {
    const now = new Date()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const monthRecords = records.value.filter(record => {
      const recordDate = new Date(record.startTime)
      return recordDate >= monthAgo && recordDate <= now
    })

    return calculateStats(monthRecords)
  })

  // 方法
  function loadRecords() {
    try {
      const data = uni.getStorageSync('studyRecords')
      if (data) {
        records.value = JSON.parse(data)
      }
    } catch (e) {
      console.error('加载数据失败:', e)
    }
  }

  function saveRecords() {
    try {
      uni.setStorageSync('studyRecords', JSON.stringify(records.value))
    } catch (e) {
      console.error('保存数据失败:', e)
    }
  }

  function startStudy(type) {
    if (isStudying.value) return
    
    isStudying.value = true
    startTime.value = Date.now()
    studyType.value = type
    currentSession.value = {
      id: Date.now(),
      type: type,
      startTime: startTime.value,
      duration: 0
    }
  }

  function stopStudy() {
    if (!isStudying.value) return

    const endTime = Date.now()
    const duration = Math.floor((endTime - startTime.value) / 1000)
    
    if (currentSession.value && duration > 0) {
      currentSession.value.endTime = endTime
      currentSession.value.duration = duration
      
      records.value.unshift({ ...currentSession.value })
      saveRecords()
    }

    isStudying.value = false
    startTime.value = null
    currentSession.value = null
    studyType.value = ''
  }

  function deleteRecord(id) {
    const index = records.value.findIndex(r => r.id === id)
    if (index !== -1) {
      records.value.splice(index, 1)
      saveRecords()
    }
  }

  function exportData() {
    const dataStr = JSON.stringify(records.value, null, 2)
    const fileName = `study_records_${new Date().getTime()}.json`
    
    // #ifdef H5
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
    // #endif
    
    // #ifdef MP-WEIXIN
    uni.showToast({
      title: '请在H5端导出',
      icon: 'none'
    })
    // #endif
  }

  function importData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr)
      if (Array.isArray(data)) {
        records.value = data
        saveRecords()
        return true
      }
      return false
    } catch (e) {
      console.error('导入数据失败:', e)
      return false
    }
  }

  function calculateStats(data) {
    const totalDuration = data.reduce((sum, record) => sum + record.duration, 0)
    const totalCount = data.length
    
    const typeStats = {}
    data.forEach(record => {
      if (!typeStats[record.type]) {
        typeStats[record.type] = 0
      }
      typeStats[record.type] += record.duration
    })

    return {
      totalDuration,
      totalCount,
      typeStats,
      averageDuration: totalCount > 0 ? Math.floor(totalDuration / totalCount) : 0
    }
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟${secs}秒`
    } else {
      return `${secs}秒`
    }
  }

  return {
    records,
    currentSession,
    isStudying,
    startTime,
    studyType,
    currentDuration,
    weeklyStats,
    monthlyStats,
    loadRecords,
    saveRecords,
    startStudy,
    stopStudy,
    deleteRecord,
    exportData,
    importData,
    formatDuration
  }
})
