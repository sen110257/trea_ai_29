<template>
  <van-popup
    v-model:show="showModal"
    round
    position="bottom"
    :style="{ height: '60%' }"
  >
    <div class="login-modal">
      <div class="modal-header">
        <h3 class="modal-title">登录后体验更多功能</h3>
        <van-icon name="cross" size="20" @click="closeModal" class="close-btn" />
      </div>
      
      <div class="login-content">
        <div class="feature-list">
          <div class="feature-item">
            <van-icon name="like-o" size="24" color="#667eea" />
            <span>点赞喜欢的冷知识</span>
          </div>
          <div class="feature-item">
            <van-icon name="star-o" size="24" color="#667eea" />
            <span>收藏感兴趣的内容</span>
          </div>
          <div class="feature-item">
            <van-icon name="chat-o" size="24" color="#667eea" />
            <span>发表评论互动交流</span>
          </div>
          <div class="feature-item">
            <van-icon name="edit" size="24" color="#667eea" />
            <span>发布原创冷知识</span>
          </div>
        </div>

        <div class="login-buttons">
          <van-button type="primary" size="large" block round class="login-btn" @click="handleLogin">
            <van-icon name="weapp" style="margin-right: 8px" />
            微信登录 (演示)
          </van-button>
          
          <van-button type="default" size="large" block round class="guest-btn" @click="closeModal">
            先逛逛
          </van-button>
        </div>

        <p class="agreement-text">
          登录即表示同意
          <span class="link">用户协议</span>
          和
          <span class="link">隐私政策</span>
        </p>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const showModal = computed({
  get: () => userStore.showLoginModal,
  set: (val) => {
    userStore.showLoginModal = val
  }
})

function closeModal() {
  userStore.toggleLoginModal()
}

function handleLogin() {
  userStore.login()
}
</script>

<style scoped>
.login-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
}

.login-content {
  flex: 1;
  padding: 24px 20px;
  overflow-y: auto;
}

.feature-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
}

.feature-item span {
  font-size: 13px;
  color: #666;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  font-size: 16px;
  font-weight: 500;
}

.guest-btn {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
  font-size: 14px;
}

.agreement-text {
  text-align: center;
  font-size: 11px;
  color: #999;
  line-height: 1.6;
}

.link {
  color: #667eea;
}
</style>
