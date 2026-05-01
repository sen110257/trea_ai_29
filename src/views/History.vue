<template>
  <div class="history-page">
    <van-nav-bar
      title="浏览历史"
      left-arrow
      @click-left="goBack"
      class="nav-bar"
    >
      <template #right>
        <span class="clear-btn" v-if="history.length > 0" @click="showClearDialog">
          清空
        </span>
      </template>
    </van-nav-bar>

    <div class="history-content">
      <template v-if="isLoggedIn">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <div v-if="history.length > 0" class="history-list">
            <div
              v-for="item in history"
              :key="item.id"
              class="history-card card-item"
              @click="goToDetail(item.id)"
            >
              <div class="card-content">
                <div class="card-image">
                  <img :src="item.coverImage" :alt="item.title" />
                  <span class="category-tag">{{ item.categoryName }}</span>
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-intro">{{ item.intro }}</p>
                  <div class="card-meta">
                    <span class="meta-item">
                      <van-icon name="eye-o" />
                      {{ formatNumber(item.views) }}
                    </span>
                    <span class="meta-item">
                      <van-icon name="like-o" />
                      {{ formatNumber(item.likes) }}
                    </span>
                    <span class="view-time">
                      浏览于: {{ item.viewTime }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <van-empty
            v-else
            image="clock"
            description="暂无浏览记录"
          >
            <template #description>
              <p>还没有浏览任何内容</p>
              <p>去首页发现有趣的冷知识吧～</p>
            </template>
            <van-button type="primary" round @click="goToHome">
              去逛逛
            </van-button>
          </van-empty>
        </van-pull-refresh>
      </template>

      <div v-else class="login-prompt">
        <van-empty
          image="user"
          description="登录后查看浏览历史"
        >
          <template #description>
            <p>登录后自动记录浏览历史</p>
            <p>随时查看之前看过的冷知识</p>
          </template>
          <van-button type="primary" round @click="showLogin">
            立即登录
          </van-button>
        </van-empty>
      </div>
    </div>

    <LoginModal />

    <van-dialog
      v-model:show="showClearDialog"
      title="确认清空"
      message="确定要清空所有浏览历史吗？"
      show-cancel-button
      @confirm="confirmClear"
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

const isRefreshing = ref(false)
const showClearDialog = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const isLoggedIn = computed(() => userStore.isLoggedIn)
const history = computed(() => userStore.history)

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

async function onRefresh() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  isRefreshing.value = false
}

function showLogin() {
  userStore.toggleLoginModal()
}

function confirmClear() {
  userStore.clearHistory()
  showClearDialog.value = false
  showMessage('已清空浏览历史')
}

function goBack() {
  router.back()
}

function goToHome() {
  router.push('/')
}

function goToDetail(id) {
  router.push(`/detail/${id}`)
}

onMounted(() => {
})
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

.nav-bar :deep(.van-icon) {
  color: #fff;
}

.clear-btn {
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

.history-content {
  padding: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.card-content {
  display: flex;
  gap: 12px;
}

.card-image {
  position: relative;
  width: 100px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(102, 126, 234, 0.9);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-intro {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.view-time {
  font-size: 10px;
  color: #ccc;
}

.login-prompt {
  padding-top: 60px;
}

.login-prompt :deep(.van-empty__description p) {
  color: #999;
  font-size: 13px;
  line-height: 1.8;
  margin: 0;
}

.login-prompt :deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
</style>
