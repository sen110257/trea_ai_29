<template>
  <div class="favorites-page">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="goBack"
      class="nav-bar"
    />

    <div class="favorites-content">
      <template v-if="isLoggedIn">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <div v-if="favorites.length > 0" class="favorites-list">
            <div
              v-for="item in favorites"
              :key="item.id"
              class="favorite-card"
            >
              <div class="card-main" @click="goToDetail(item.id)">
                <div class="card-left" :class="getCategoryClass(item.categoryId)">
                  <span class="card-category-icon">{{ getCategoryIcon(item.categoryId) }}</span>
                </div>
                <div class="card-right">
                  <div class="card-header">
                    <span class="card-category">{{ item.categoryName }}</span>
                    <span class="card-add-time">收藏于: {{ item.addTime }}</span>
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
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-actions">
                <van-button
                  type="danger"
                  size="small"
                  plain
                  round
                  @click="removeFromFavorites(item.id)"
                >
                  取消收藏
                </van-button>
              </div>
            </div>
          </div>

          <van-empty
            v-else
            image="star"
            description="暂无收藏内容"
          >
            <template #description>
              <p>还没有收藏任何内容</p>
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
          description="登录后查看收藏"
        >
          <template #description>
            <p>登录后可以收藏喜欢的冷知识</p>
            <p>随时在收藏夹中查看</p>
          </template>
          <van-button type="primary" round @click="showLogin">
            立即登录
          </van-button>
        </van-empty>
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
      v-model:show="showDeleteDialog"
      title="确认取消收藏"
      message="确定要取消收藏这条冷知识吗？"
      show-cancel-button
      @confirm="confirmRemove"
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

const activeTab = ref('favorites')
const isRefreshing = ref(false)
const showDeleteDialog = ref(false)
const deleteItemId = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isLoggedIn = computed(() => userStore.isLoggedIn)
const favorites = computed(() => userStore.favorites)

function formatNumber(num) {
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

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

function removeFromFavorites(id) {
  deleteItemId.value = id
  showDeleteDialog.value = true
}

function confirmRemove() {
  if (deleteItemId.value !== null) {
    userStore.removeFromFavorites(deleteItemId.value)
    showMessage('已取消收藏')
  }
  showDeleteDialog.value = false
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

function goToHome() {
  router.push('/')
}

function goToFavorites() {
  router.push('/favorites')
}

function goToPublish() {
  router.push('/publish')
}

function goToProfile() {
  router.push('/profile')
}

function goToDetail(id) {
  router.push(`/detail/${id}`)
}

onMounted(() => {
  activeTab.value = 'favorites'
})
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 60px;
}

.favorites-content {
  padding: 16px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-card {
  background: #fff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
}

.card-main {
  display: flex;
  gap: 14px;
  cursor: pointer;
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

.card-add-time {
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

.card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #f3f4f6;
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
</style>
