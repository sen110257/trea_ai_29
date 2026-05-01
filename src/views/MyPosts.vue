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
              class="post-card card-item"
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
                    <span class="publish-time">
                      {{ item.publishTime }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-status">
                <van-tag type="success" size="small">已发布</van-tag>
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
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
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

.my-posts-content {
  padding: 12px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
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

.publish-time {
  font-size: 10px;
  color: #ccc;
}

.card-status {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  margin-top: 12px;
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
