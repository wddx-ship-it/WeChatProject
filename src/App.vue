<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 放大 TabBar 文字 */
.tab-bar {
  font-size: 28rpx !important;
}

.tab-bar-item {
  font-size: 28rpx !important;
}

/* 兼容不同平台的 TabBar 文字放大 */
uni-tabbar {
  font-size: 28rpx !important;
}

uni-tabbar .uni-tabbar__item {
  font-size: 28rpx !important;
}

.container {
  padding: 20rpx;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 16rpx;
  padding: 28rpx 0;
  font-size: 32rpx;
  text-align: center;
}

.btn-success {
  background: #52C41A;
  color: #fff;
  border-radius: 16rpx;
  padding: 28rpx 0;
  font-size: 32rpx;
  text-align: center;
}

.btn-danger {
  background: #FF4D4F;
  color: #fff;
  border-radius: 16rpx;
  padding: 28rpx 0;
  font-size: 32rpx;
  text-align: center;
}
</style>
