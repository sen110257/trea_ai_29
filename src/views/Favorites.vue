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
              class="favorite-card card-item"
            >
              <div class="card-content" @click="goToDetail(item.id)">
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
                    <span class="add-time">
                      {{ item.addTime }}
                    </span>
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

    <van-tabbar v-model="activeTab" active-color="#667eea" inactive-color="#999">
      <van-tabbar-item icon="home-o" @click="goToHome">首页</van-tabbar-item>
      <van-tabbar-item icon="star" @click="goToFavorites">收藏</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="goToPublish">发布</van-tabbar-item>
      <van-tabbar-item icon="user-o" @click="goToProfile">我的</van-tabbar-item>
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

const activeTab = ref(1)
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
  activeTab.value = 1
})
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
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

.favorites-content {
  padding: 12px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-content {
  display: flex;
  gap: 12px;
  cursor: pointer;
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

.add-time {
  font-size: 10px;
  color: #ccc;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
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
