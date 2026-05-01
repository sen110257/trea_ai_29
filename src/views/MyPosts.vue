<template>
  <div class="my-posts-page">
    <van-nav-bar
      title="我的发布"
      left-arrow
      @click-left="goBack"
      class="nav-bar"
    />

    <div class="my-posts-content">
      <template v-if="isLoggedIn">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <div v-if="myPosts.length > 0" class="posts-list">
            <div
              v-for="item in myPosts"
              :key="item.id"
              class="post-card"
              @click="goToDetail(item.id)"
            >
              <div class="card-left" :class="getCategoryClass(item.categoryId)">
                <span class="card-category-icon">{{ getCategoryIcon(item.categoryId) }}</span>
              </div>
              <div class="card-right">
                <div class="card-header">
                  <span class="card-category">{{ item.categoryName }}</span>
                  <div class="card-status">
                    <span class="publish-time">{{ item.publishTime }}</span>
                    <van-tag type="success" size="small">已发布</van-tag>
                  </div>
                </div>
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-intro">{{ item.intro }}</p>
                <div class="card-footer">
                  <div class="footer-stats">
                    <span class="stat-item">
                      <span class="stat-icon">👁️</span>
                      <span class="stat-num">{{ formatNumber(item.views) }}</span>
                    </span>
                    <span class="stat-item">
                      <span class="stat-icon">🤍</span>
                      <span class="stat-num">{{ formatNumber(item.likes) }}</span>
                    </span>
                    <span class="stat-item">
                      <span class="stat-icon">💬</span>
                      <span class="stat-num">{{ formatNumber(item.commentsCount || 0) }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <van-empty
            v-else
            image="edit"
            description="暂无发布内容"
          >
            <template #description>
              <p>还没有发布任何冷知识</p>
              <p>快来分享你知道的有趣知识吧～</p>
            </template>
            <van-button type="primary" round @click="goToPublish">
              去发布
            </van-button>
          </van-empty>
        </van-pull-refresh>
      </template>

      <div v-else class="login-prompt">
        <van-empty
          image="user"
          description="登录后查看我的发布"
        >
          <template #description>
            <p>登录后可以发布原创冷知识</p>
            <p>在这里查看和管理你发布的内容</p>
          </template>
          <van-button type="primary" round @click="showLogin">
            立即登录
          </van-button>
        </van-empty>
      </div>
    </div>

    <LoginModal />
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

const isLoggedIn = computed(() => userStore.isLoggedIn)
const myPosts = computed(() => userStore.myPosts)

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function getCategoryClass(categoryId) {
  const classMap = {
    1: 'category-placeholder-science',
    2: 'category-placeholder-history',
    3: 'category-placeholder-animal',
    4: 'category-placeholder-plant',
    5: 'category-placeholder-human',
    6: 'category-placeholder-space',
    7: 'category-placeholder-food',
    8: 'category-placeholder-art'
  }
  return classMap[categoryId] || 'category-placeholder-default'
}

function getCategoryIcon(categoryId) {
  const category = userStore.categories.find(c => c.id === categoryId)
  return category ? category.icon : '📚'
}

async function onRefresh() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  isRefreshing.value = false
}

function showLogin() {
  userStore.toggleLoginModal()
}

function goBack() {
  router.back()
}

function goToPublish() {
  router.push('/publish')
}

function goToDetail(id) {
  router.push(`/detail/${id}`)
}

onMounted(() => {
})
</script>

<style scoped>
.my-posts-page {
  min-height: 100vh;
  background: #fafafa;
}

.my-posts-content {
  padding: 16px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.card-left {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-category-icon {
  font-size: 32px;
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-category {
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.publish-time {
  font-size: 11px;
  color: #9ca3af;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-intro {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: 4px;
}

.footer-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9ca3af;
}

.stat-icon {
  font-size: 14px;
}

.stat-num {
  font-weight: 500;
}

.login-prompt {
  padding-top: 60px;
}

.login-prompt :deep(.van-empty__description p) {
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.8;
  margin: 0;
}

.login-prompt :deep(.van-button--primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
}

:deep(.van-pull-refresh__head) {
  color: #9ca3af;
}

:deep(.nav-bar) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
}

:deep(.nav-bar .van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

:deep(.nav-bar .van-icon) {
  color: #fff;
}

:deep(.van-tag--success) {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%) !important;
  border: none !important;
}
</style>
