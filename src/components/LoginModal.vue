<template>
  <van-popup
    v-model:show="showModal"
    round
    position="bottom"
    :style="{ height: 'auto', minHeight: '60%' }"
    :close-on-click-overlay="true"
  >
    <div class="login-modal">
      <div class="modal-handle">
        <div class="handle-bar"></div>
      </div>

      <div class="modal-header">
        <h2 class="modal-title">登录后体验更多功能</h2>
        <p class="modal-subtitle">解锁点赞、收藏、评论、发布等精彩功能</p>
      </div>
      
      <div class="login-content">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="like-o" size="22" color="#6366f1" />
            </div>
            <span class="feature-text">点赞喜欢的冷知识</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="star-o" size="22" color="#6366f1" />
            </div>
            <span class="feature-text">收藏感兴趣的内容</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="chat-o" size="22" color="#6366f1" />
            </div>
            <span class="feature-text">发表评论互动交流</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="edit" size="22" color="#6366f1" />
            </div>
            <span class="feature-text">发布原创冷知识</span>
          </div>
        </div>

        <div class="login-buttons">
          <van-button 
            type="primary" 
            size="large" 
            block 
            class="login-btn" 
            @click="handleLogin"
          >
            <van-icon name="weapp" style="margin-right: 8px; font-size: 18px;" />
            微信登录
          </van-button>
          
          <van-button 
            type="default" 
            size="large" 
            block 
            class="guest-btn" 
            @click="closeModal"
          >
            先逛逛
          </van-button>
        </div>

        <p class="agreement-text">
          登录即表示同意
          <span class="link" @click.stop="showToast('用户协议查看中...')">用户协议</span>
          和
          <span class="link" @click.stop="showToast('隐私政策查看中...')">隐私政策</span>
        </p>
      </div>
    </div>
  </van-popup>

  <van-toast v-model:show="showToastMsg" :message="toastContent" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const showToastMsg = ref(false)
const toastContent = ref('')

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

function showToast(msg) {
  toastContent.value = msg
  showToastMsg.value = true
}
</script>

<style scoped>
.login-modal {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);
}

.modal-handle {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.handle-bar {
  width: 36px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
}

.modal-header {
  text-align: center;
  padding: 0 24px 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.5;
}

.login-content {
  flex: 1;
  padding: 0 24px 32px;
}

.feature-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 36px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 16px;
  background: #f9fafb;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.feature-item:active {
  transform: scale(0.98);
  background: #f3f4f6;
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f115 0%, #8b5cf615 100%);
  border-radius: 12px;
}

.feature-text {
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.login-btn {
  height: 50px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}

.guest-btn {
  height: 50px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  background: #fff !important;
  border: 1px solid #6366f1 !important;
  color: #6366f1 !important;
}

.agreement-text {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.6;
  margin-top: 8px;
}

.link {
  color: #6366f1;
  font-weight: 500;
  cursor: pointer;
}
</style>
