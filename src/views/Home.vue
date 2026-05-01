<template>
  <div class="home-page">
    <div class="header-section">
      <div class="header-bg"></div>
      <div class="header-content">
        <div class="header-top">
          <h1 class="app-title">冷知识百科</h1>
          <div class="header-action" @click="goToProfile">
            <van-icon name="user-o" size="24" />
          </div>
        </div>
        
        <div class="search-wrapper">
          <div class="search-box" @click="focusSearch">
            <van-icon name="search" size="18" color="#9ca3af" />
            <input
              ref="searchInputRef"
              v-model="searchKeyword"
              type="text"
              placeholder="搜索有趣的冷知识..."
              class="search-input"
              @input="handleSearch"
              @keyup.enter="handleSearch"
            />
            <van-icon
              v-if="searchKeyword"
              name="clear"
              size="18"
              color="#9ca3af"
              class="clear-btn"
              @click.stop="clearSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="category-section">
      <div class="category-scroll">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-chip"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="chip-icon">{{ category.icon }}</span>
          <span class="chip-text">{{ category.name }}</span>
        </div>
      </div>
    </div>

    <div class="list-section">
      <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="— 没有更多了 —"
          @load="onLoad"
        >
          <div class="knowledge-list">
            <div
              v-for="item in displayList"
              :key="item.id"
              class="knowledge-card"
              @click="goToDetail(item.id)"
            >
              <div class="card-left" :class="getCategoryClass(item.categoryId)">
                <span class="card-category-icon">{{ getCategoryIcon(item.categoryId) }}</span>
              </div>
              <div class="card-right">
                <div class="card-header">
                  <span class="card-category">{{ item.categoryName }}</span>
                  <span class="card-time">{{ formatTime(item.createTime) }}</span>
                </div>
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-intro">{{ item.intro }}</p>
                <div class="card-footer">
                  <div class="footer-stats">
                    <span class="stat-item">
                      <span class="stat-icon">👁️</span>
                      <span class="stat-num">{{ formatNumber(item.views) }}</span>
                    </span>
                    <span class="stat-item" :class="{ liked: isLiked(item.id) }" @click.stop="handleLike(item)">
                      <span class="stat-icon">{{ isLiked(item.id) ? '❤️' : '🤍' }}</span>
                      <span class="stat-num">{{ formatNumber(item.likes) }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <van-empty
            v-if="displayList.length === 0 && !loading"
            image="search"
            :description="searchKeyword ? '没有找到相关内容' : '暂无内容'"
          >
            <template #description>
              <p>{{ searchKeyword ? '换个关键词试试' : '去发布你的第一条冷知识吧' }}</p>
            </template>
            <van-button 
              v-if="!searchKeyword" 
              type="primary" 
              round 
              size="small"
              @click="goToPublish"
            >
              去发布
            </van-button>
          </van-empty>
        </van-list>
      </van-pull-refresh>
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

    <van-toast v-model:show="showToast" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const userStore = useUserStore()

const searchInputRef = ref(null)
const searchKeyword = ref('')
const activeCategory = ref(0)
const isRefreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const activeTab = ref('home')
const pageSize = 10
const currentPage = ref(1)
const showToast = ref(false)
const toastMessage = ref('')

const categories = computed(() => userStore.categories)

const filteredList = computed(() => {
  let list = searchKeyword.value.trim()
    ? userStore.searchKnowledge(searchKeyword.value)
    : userStore.getKnowledgeByCategory(activeCategory.value)
  return list
})

const displayList = computed(() => {
  return filteredList.value.slice(0, currentPage.value * pageSize)
})

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const date = new Date(timeStr.replace(/-/g, '/'))
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return timeStr.split(' ')[0]
  }
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
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.icon : '📚'
}

function isLiked(id) {
  return userStore.isLiked(id)
}

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

function handleLike(item) {
  userStore.requireLogin(() => {
    userStore.toggleLike(item.id)
    showMessage(userStore.isLiked(item.id) ? '点赞成功' : '已取消点赞')
  })
}

function focusSearch() {
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
}

function handleSearch() {
  currentPage.value = 1
  finished.value = false
}

function clearSearch() {
  searchKeyword.value = ''
  currentPage.value = 1
  finished.value = false
}

function selectCategory(categoryId) {
  activeCategory.value = categoryId
  currentPage.value = 1
  finished.value = false
  if (categoryId !== 0) {
    router.push(`/category/${categoryId}`)
  }
}

async function onLoad() {
  if (displayList.value.length >= filteredList.value.length) {
    finished.value = true
    loading.value = false
    return
  }
  
  await new Promise(resolve => setTimeout(resolve, 500))
  currentPage.value++
  
  if (displayList.value.length >= filteredList.value.length) {
    finished.value = true
  }
  loading.value = false
}

async function onRefresh() {
  currentPage.value = 1
  finished.value = false
  await new Promise(resolve => setTimeout(resolve, 1000))
  isRefreshing.value = false
}

function goToHome() {
  activeTab.value = 'home'
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

watch(searchKeyword, () => {
  currentPage.value = 1
  finished.value = false
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 60px;
}

.header-section {
  position: relative;
  padding-bottom: 24px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 0 0 32px 32px;
}

.header-content {
  position: relative;
  padding: 16px 20px 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.app-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.header-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}

.header-action :deep(.van-icon) {
  color: #fff;
}

.search-wrapper {
  padding: 0 4px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1f2937;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  cursor: pointer;
}

.category-section {
  margin-top: 8px;
  padding: 8px 0;
}

.category-scroll {
  display: flex;
  overflow-x: auto;
  padding: 0 16px;
  gap: 10px;
  scrollbar-width: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 10px 16px;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-chip:active {
  transform: scale(0.96);
}

.category-chip.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.chip-icon {
  font-size: 16px;
}

.chip-text {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.category-chip.active .chip-text {
  color: #fff;
}

.list-section {
  padding: 8px 16px;
  padding-bottom: 20px;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-card {
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

.knowledge-card:active {
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

.card-time {
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
  cursor: pointer;
  transition: all 0.2s;
}

.stat-item.liked {
  color: #ef4444;
}

.stat-icon {
  font-size: 14px;
}

.stat-num {
  font-weight: 500;
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

:deep(.van-list__finished-text) {
  color: #d1d5db;
  font-size: 12px;
  padding: 20px 0;
}

:deep(.van-empty__image) {
  margin-bottom: 12px;
}

:deep(.van-empty__description p) {
  color: #9ca3af;
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
}
</style>
