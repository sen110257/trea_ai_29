<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="user-info">
        <img :src="user.avatar" class="user-avatar" @click="handleAvatarClick" />
        <div class="user-text" v-if="isLoggedIn">
          <h2 class="user-name">{{ user.nickname }}</h2>
          <p class="user-desc">趣味冷知识探索者</p>
        </div>
        <div class="user-text" v-else @click="showLogin">
          <h2 class="user-name">点击登录</h2>
          <p class="user-desc">登录后体验更多功能</p>
        </div>
      </div>
    </div>

    <div class="stats-card" v-if="isLoggedIn">
      <div class="stat-item" @click="goToMyPosts">
        <span class="stat-value">{{ myPosts.length }}</span>
        <span class="stat-label">我的发布</span>
      </div>
      <div class="stat-item" @click="goToFavorites">
        <span class="stat-value">{{ favorites.length }}</span>
        <span class="stat-label">我的收藏</span>
      </div>
      <div class="stat-item" @click="goToHistory">
        <span class="stat-value">{{ history.length }}</span>
        <span class="stat-label">浏览历史</span>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="goToFavorites">
          <span class="menu-icon-wrapper">
            <van-icon name="star-o" size="20" color="#6366f1" />
          </span>
          <span class="menu-text">我的收藏</span>
          <van-icon name="arrow" size="14" color="#d1d5db" />
        </div>
        <div class="menu-item" @click="goToHistory">
          <span class="menu-icon-wrapper">
            <van-icon name="clock-o" size="20" color="#6366f1" />
          </span>
          <span class="menu-text">浏览历史</span>
          <van-icon name="arrow" size="14" color="#d1d5db" />
        </div>
        <div class="menu-item" @click="goToMyPosts">
          <span class="menu-icon-wrapper">
            <van-icon name="edit" size="20" color="#6366f1" />
          </span>
          <span class="menu-text">我的发布</span>
          <van-icon name="arrow" size="14" color="#d1d5db" />
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-item" @click="handleSetting">
          <span class="menu-icon-wrapper">
            <van-icon name="setting-o" size="20" color="#6366f1" />
          </span>
          <span class="menu-text">设置</span>
          <van-icon name="arrow" size="14" color="#d1d5db" />
        </div>
        <div class="menu-item" @click="handleAbout">
          <span class="menu-icon-wrapper">
            <van-icon name="info-o" size="20" color="#6366f1" />
          </span>
          <span class="menu-text">关于我们</span>
          <van-icon name="arrow" size="14" color="#d1d5db" />
        </div>
      </div>

      <div class="logout-section" v-if="isLoggedIn">
        <div class="logout-btn" @click="handleLogout">
          退出登录
        </div>
      </div>
    </div>

    <van-tabbar v-model="activeTab" :border="false">
      <van-tabbar-item name="home" @click="goToHome">
        <template #icon="props">
          <van-icon :name="props.active ? 'home' : 'home-o'" size="22" />
        </template>
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item name="favorites" @click="goToFavorites">
        <template #icon="props">
          <van-icon :name="props.active ? 'star' : 'star-o'" size="22" />
        </template>
        <span>收藏</span>
      </van-tabbar-item>
      <van-tabbar-item name="publish" @click="goToPublish">
        <template #icon>
          <div class="publish-icon">
            <van-icon name="plus" size="20" color="#fff" />
          </div>
        </template>
        <span>发布</span>
      </van-tabbar-item>
      <van-tabbar-item name="profile" @click="goToProfile">
        <template #icon="props">
          <van-icon :name="props.active ? 'user' : 'user-o'" size="22" />
        </template>
        <span>我的</span>
      </van-tabbar-item>
    </van-tabbar>

    <LoginModal />

    <van-dialog
      v-model:show="showLogoutDialog"
      title="提示"
      message="确定要退出登录吗？"
      show-cancel-button
      @confirm="confirmLogout"
    />

    <van-toast v-model:show="showToast" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('profile')
const showLogoutDialog = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const user = computed(() => userStore.user)
const isLoggedIn = computed(() => userStore.isLoggedIn)
const favorites = computed(() => userStore.favorites)
const history = computed(() => userStore.history)
const myPosts = computed(() => userStore.myPosts)

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

function handleAvatarClick() {
  if (!isLoggedIn.value) {
    showLogin()
  }
}

function showLogin() {
  userStore.toggleLoginModal()
}

function goToHome() {
  router.push('/')
}

function goToFavorites() {
  if (isLoggedIn.value) {
    router.push('/favorites')
  } else {
    showLogin()
  }
}

function goToPublish() {
  router.push('/publish')
}

function goToProfile() {
  router.push('/profile')
}

function goToHistory() {
  if (isLoggedIn.value) {
    router.push('/history')
  } else {
    showLogin()
  }
}

function goToMyPosts() {
  if (isLoggedIn.value) {
    router.push('/my-posts')
  } else {
    showLogin()
  }
}

function handleSetting() {
  showMessage('设置功能开发中...')
}

function handleAbout() {
  showMessage('趣味冷知识百科 v1.0.0')
}

function handleLogout() {
  showLogoutDialog.value = true
}

function confirmLogout() {
  userStore.logout()
  showLogoutDialog.value = false
  showMessage('已退出登录')
}

onMounted(() => {
  activeTab.value = 'profile'
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 60px;
}

.profile-header {
  position: relative;
  padding: 40px 20px 50px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 0 0 32px 32px;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.user-text {
  cursor: pointer;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.user-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.stats-card {
  display: flex;
  background: #fff;
  margin: -25px 16px 20px;
  border-radius: 20px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.2s;
  border-right: 1px solid #f3f4f6;
}

.stat-item:last-child {
  border-right: none;
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.menu-section {
  padding: 12px 16px 20px;
}

.menu-group {
  background: #fff;
  border-radius: 20px;
  padding: 0 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 8px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f9fafb;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f9fafb;
  border-radius: 8px;
}

.menu-icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 10px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
}

.logout-section {
  margin-top: 24px;
}

.logout-btn {
  width: 100%;
  padding: 16px;
  background: #fff;
  border-radius: 20px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
}

.logout-btn:active {
  background: #fef2f2;
}

.publish-icon {
  width: 44px;
  height: 44px;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
}

:deep(.van-tabbar) {
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
}

:deep(.van-tabbar-item__icon) {
  margin-bottom: 2px;
}

:deep(.van-tabbar-item__text) {
  font-size: 11px;
}
</style>
