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
      <van-cell-group inset>
        <van-cell
          title="我的收藏"
          icon="star-o"
          is-link
          @click="goToFavorites"
        />
        <van-cell
          title="浏览历史"
          icon="clock-o"
          is-link
          @click="goToHistory"
        />
        <van-cell
          title="我的发布"
          icon="edit"
          is-link
          @click="goToMyPosts"
        />
      </van-cell-group>

      <van-cell-group inset class="second-group">
        <van-cell
          title="设置"
          icon="setting-o"
          is-link
          @click="handleSetting"
        />
        <van-cell
          title="关于我们"
          icon="info-o"
          is-link
          @click="handleAbout"
        />
      </van-cell-group>

      <van-cell-group inset class="logout-group" v-if="isLoggedIn">
        <van-cell
          title="退出登录"
          center
          class="logout-cell"
          @click="handleLogout"
        />
      </van-cell-group>
    </div>

    <van-tabbar v-model="activeTab" active-color="#667eea" inactive-color="#999">
      <van-tabbar-item icon="home-o" @click="goToHome">首页</van-tabbar-item>
      <van-tabbar-item icon="star-o" @click="goToFavorites">收藏</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="goToPublish">发布</van-tabbar-item>
      <van-tabbar-item icon="user" @click="goToProfile">我的</van-tabbar-item>
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

const activeTab = ref(3)
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
  activeTab.value = 3
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}

.profile-header {
  position: relative;
  padding: 40px 20px 30px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
}

.user-text {
  cursor: pointer;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.user-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.stats-card {
  display: flex;
  background: #fff;
  margin: -20px 16px 20px;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  border-right: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.menu-section {
  padding: 10px 0;
}

.second-group {
  margin-top: 12px;
}

.logout-group {
  margin-top: 30px;
}

.logout-cell {
  color: #ff4d4f !important;
  font-weight: 500;
}

.logout-cell :deep(.van-cell__title) {
  text-align: center;
}
</style>
