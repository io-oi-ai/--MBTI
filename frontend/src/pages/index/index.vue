<template>
  <view class="container">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="title">AI头像MBTI性格分析</text>
      <text class="subtitle">上传你的头像，看看AI眼中的你</text>
    </view>

    <!-- 服务器状态提示 -->
    <view v-if="!serverStatus" class="server-warning">
      <text class="warning-text">⚠️ 后端服务未连接，请确保后端服务已启动</text>
    </view>

    <view class="content">
      <view v-if="!result.firstImpression" class="upload-section">
        <view class="preview-box" @click="chooseImage">
          <image v-if="previewImage" :src="previewImage" class="preview-image" mode="aspectFit"></image>
          <view v-else class="placeholder">
            <text class="placeholder-text">点击选择图片</text>
            <text class="placeholder-desc">支持JPG, PNG, WEBP</text>
          </view>
        </view>

        <view class="gender-selector">
          <text class="gender-label">你的性别是：</text>
          <radio-group @change="genderChange">
            <label class="gender-radio">
              <radio value="male" :checked="gender === 'male'" /><text>男生</text>
            </label>
            <label class="gender-radio">
              <radio value="female" :checked="gender === 'female'" /><text>女生</text>
            </label>
          </radio-group>
        </view>

        <button class="action-button" @click="analyze" :disabled="loading || !previewImage">
          {{ loading ? '分析中...' : '开始分析' }}
        </button>
      </view>

      <view v-else class="result-section">
        <view class="result-card">
          <image :src="previewImage" class="result-avatar" mode="aspectFit"></image>
          <view class="result-title">{{ result.firstImpression }}</view>
          <view class="result-sketch">{{ result.personalitySketch }}</view>
          <view class="result-hottake">"{{ result.hotTake }}"</view>
        </view>
        <button class="action-button" @click="reset">再试一次</button>
      </view>
    </view>

    <view class="footer">
      <text class="disclaimer">{{ result.disclaimer || '*本服务由AI生成，仅供娱乐参考，不构成专业心理建议。' }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const previewImage = ref(null);
const loading = ref(false);
const result = ref({});
const gender = ref('male'); // 默认性别
const serverStatus = ref(true); // 服务器状态

// 后端服务地址
const API_URL = 'http://localhost:3008/api/analyze';
const HEALTH_URL = 'http://localhost:3008/api/health';

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      previewImage.value = res.tempFilePaths[0];
      result.value = {}; // 清除旧结果
      
      // 显示选择成功提示
      uni.showToast({
        title: '图片选择成功',
        icon: 'success',
        duration: 1500
      });
    },
    fail: (err) => {
      console.error('选择图片失败:', err);
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
};

const genderChange = (e) => {
  gender.value = e.detail.value;
};

const analyze = () => {
  if (!previewImage.value) {
    uni.showToast({ title: '请先选择图片', icon: 'none' });
    return;
  }

  loading.value = true;

  uni.uploadFile({
    url: API_URL,
    filePath: previewImage.value,
    name: 'file',
    formData: {
      gender: gender.value
    },
    success: (uploadRes) => {
      try {
        const data = JSON.parse(uploadRes.data);
        result.value = data;
      } catch (e) {
        uni.showToast({ title: '分析失败，请稍后再试', icon: 'none' });
      }
    },
    fail: (err) => {
      console.error('Upload fail:', err);
      uni.showToast({ title: '网络错误，请检查后端服务', icon: 'none' });
    },
    complete: () => {
      loading.value = false;
    }
  });
};

// 检查服务器状态
const checkServerStatus = async () => {
  try {
    const res = await uni.request({
      url: HEALTH_URL,
      method: 'GET',
      timeout: 5000
    });
    serverStatus.value = res.statusCode === 200;
  } catch (error) {
    serverStatus.value = false;
    console.error('服务器连接失败:', error);
  }
};

// 页面加载时检查服务器状态
onMounted(() => {
  checkServerStatus();
});

const reset = () => {
  previewImage.value = null;
  result.value = {};
  loading.value = false;
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 20rpx;
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.logo {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 28rpx;
  color: #888;
  margin-top: 10rpx;
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.upload-section, .result-section {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-box {
  width: 400rpx;
  height: 400rpx;
  border: 2rpx dashed #ccc;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
  background-color: #fff;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.placeholder {
  text-align: center;
  color: #aaa;
}

.placeholder-text {
  font-size: 32rpx;
  display: block;
}

.placeholder-desc {
  font-size: 24rpx;
}

.gender-selector {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  font-size: 28rpx;
}

.gender-label {
  margin-right: 20rpx;
  color: #666;
}

.gender-radio {
  margin-right: 30rpx;
}

.action-button {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 45rpx;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.action-button[disabled] {
  background-image: none;
  background-color: #c8c7cc;
  box-shadow: none;
}

.result-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  margin-bottom: 40rpx;
  width: 100%;
  border: 1px solid #eee;
}

.result-avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  margin-bottom: 30rpx;
  border: 4rpx solid #eee;
}

.result-title {
  font-size: 42rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.result-sketch {
  font-size: 28rpx;
  color: #666;
  line-height: 1.7;
  margin-bottom: 30rpx;
  text-align: left;
}

.result-hottake {
  font-size: 30rpx;
  color: #2575fc;
  font-style: italic;
  padding: 20rpx;
  background-color: #f0f5ff;
  border-radius: 10rpx;
}

.footer {
  margin-top: 40rpx;
  padding: 0 20rpx;
  text-align: center;
}

.disclaimer {
  font-size: 24rpx;
  color: #aaa;
}

.server-warning {
  width: 100%;
  max-width: 600rpx;
  background-color: #fff3cd;
  border: 1rpx solid #ffeaa7;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  text-align: center;
}

.warning-text {
  font-size: 26rpx;
  color: #856404;
}
</style>
