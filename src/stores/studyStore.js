import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStudyStore = defineStore('study', () => {
  // 状态
  const records = ref([])
  const currentSession = ref(null)
  const isStudying = ref(false)
  const startTime = ref(null)
  const studyType = ref('')
  const currentDuration = ref(0)
  
  // 默认学习类型
  const defaultTypes = ['数学', '英语', '编程', '阅读', '其他']
  
  // 自定义学习类型（从本地存储加载）
  const customTypes = ref([])

  // 辅助函数（必须在计算属性之前定义）
  function calculateStats(data) {
    if (!data || !Array.isArray(data)) {
      return {
        totalDuration: 0,
        totalCount: 0,
        typeStats: {},
        averageDuration: 0
      }
    }
    
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

  // 计算属性
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
    console.log('loadRecords 开始')
    try {
      const data = uni.getStorageSync('studyRecords')
      console.log('从 Storage 读取的数据:', data, '类型:', typeof data)
      
      if (data && typeof data === 'string' && data.length > 0) {
        const parsed = JSON.parse(data)
        console.log('解析后的数据:', parsed)
        
        if (Array.isArray(parsed)) {
          records.value = parsed
          console.log('records 已更新,数量:', records.value.length)
        } else {
          console.warn('解析的数据不是数组格式')
          records.value = []
        }
      } else {
        console.log('Storage 中没有数据或数据为空')
        records.value = []
      }
    } catch (e) {
      console.error('加载数据失败:', e)
      records.value = []
    }
    
    // 加载自定义学习类型（放在try-catch外部，独立处理）
    loadCustomTypes()
  }
  
  // 加载自定义学习类型
  function loadCustomTypes() {
    try {
      const data = uni.getStorageSync('customStudyTypes')
      if (data && typeof data === 'string' && data.length > 0) {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          customTypes.value = parsed
        } else {
          customTypes.value = []
        }
      } else {
        customTypes.value = []
      }
    } catch (e) {
      console.error('加载自定义类型失败:', e)
      customTypes.value = []
    }
  }
  
  // 保存自定义学习类型
  function saveCustomTypes() {
    try {
      uni.setStorageSync('customStudyTypes', JSON.stringify(customTypes.value))
    } catch (e) {
      console.error('保存自定义类型失败:', e)
    }
  }
  
  // 添加自定义学习类型
  function addCustomType(typeName) {
    if (!typeName || typeName.trim() === '') {
      return false
    }
    
    const trimmedName = typeName.trim()
    
    // 检查是否已存在（包括默认类型和自定义类型）
    const allTypes = [...defaultTypes, ...customTypes.value]
    if (allTypes.includes(trimmedName)) {
      return false
    }
    
    customTypes.value.push(trimmedName)
    saveCustomTypes()
    return true
  }
  
  // 删除自定义学习类型
  function removeCustomType(typeName) {
    const index = customTypes.value.indexOf(typeName)
    if (index !== -1) {
      customTypes.value.splice(index, 1)
      saveCustomTypes()
      return true
    }
    return false
  }
  
  // 获取所有学习类型（默认 + 自定义）
  function getAllStudyTypes() {
    return [...defaultTypes, ...customTypes.value]
  }

  function saveRecords() {
    try {
      console.log('saveRecords 开始, records:', records.value)
      uni.setStorageSync('studyRecords', JSON.stringify(records.value))
      console.log('saveRecords 成功')
    } catch (e) {
      console.error('保存数据失败:', e)
    }
  }

  let durationTimer = null

  function startStudy(type) {
    if (isStudying.value) return
    
    isStudying.value = true
    startTime.value = Date.now()
    studyType.value = type
    currentDuration.value = 0  // 重置时长
    currentSession.value = {
      id: Date.now(),
      type: type,
      startTime: startTime.value,
      duration: 0
    }

    if (durationTimer) clearInterval(durationTimer)
    durationTimer = setInterval(() => {
      if (startTime.value) {
        currentDuration.value = Math.floor((Date.now() - startTime.value) / 1000)
      }
    }, 1000)
  }

  function stopStudy() {
    if (!isStudying.value) return

    if (durationTimer) {
      clearInterval(durationTimer)
      durationTimer = null
    }

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
    currentDuration.value = 0  // 重置时长
  }

  function updateCurrentDuration() {
    if (startTime.value) {
      currentDuration.value = Math.floor((Date.now() - startTime.value) / 1000)
    }
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
    // 使用微信文件系统保存文件
    const fs = uni.getFileSystemManager()
    const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`
    
    fs.writeFile({
      filePath: filePath,
      data: dataStr,
      encoding: 'utf8',
      success: () => {
        // 保存到剪贴板
        uni.setClipboardData({
          data: dataStr,
          success: () => {
            uni.showModal({
              title: '导出成功',
              content: '数据已复制到剪贴板，可以粘贴到备忘录或发送给朋友。',
              showCancel: false
            })
          },
          fail: () => {
            uni.showToast({
              title: '导出失败',
              icon: 'none'
            })
          }
        })
      },
      fail: (err) => {
        console.error('写入文件失败:', err)
        // 降级方案：复制到剪贴板
        uni.setClipboardData({
          data: dataStr,
          success: () => {
            uni.showModal({
              title: '导出成功',
              content: '数据已复制到剪贴板，可以粘贴到备忘录或发送给朋友。',
              showCancel: false
            })
          },
          fail: () => {
            uni.showToast({
              title: '导出失败',
              icon: 'none'
            })
          }
        })
      }
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
    customTypes,
    weeklyStats,
    monthlyStats,
    loadRecords,
    saveRecords,
    startStudy,
    stopStudy,
    updateCurrentDuration,
    deleteRecord,
    exportData,
    importData,
    formatDuration,
    addCustomType,
    removeCustomType,
    getAllStudyTypes
  }
})
