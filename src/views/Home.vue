<template>
  <div class="home-page">
    <van-nav-bar
      title="趣味冷知识百科"
      :left-arrow="false"
      class="nav-bar"
    >
      <template #right>
        <van-icon name="user-o" size="22" @click="goToProfile" />
      </template>
    </van-nav-bar>

    <div class="search-container">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索冷知识..."
        shape="round"
        @search="onSearch"
        @cancel="onCancel"
        show-action
      />
    </div>

    <div class="category-container">
      <div class="category-scroll">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </div>

    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="knowledge-list">
          <div
            v-for="item in displayList"
            :key="item.id"
            class="knowledge-card card-item"
            @click="goToDetail(item.id)"
          >
            <div class="card-image">
              <img :src="item.coverImage" :alt="item.title" />
              <span class="category-tag">{{ item.categoryName }}</span>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-intro">{{ item.intro }}</p>
              <div class="card-meta">
                <span class="meta-item">
                  <van-icon name="eye-o" />
                  {{ formatNumber(item.views) }}
                </span>
                <span class="meta-item" :class="{ liked: isLiked(item.id) }" @click.stop="handleLike(item)">
                  <van-icon :name="isLiked(item.id) ? 'like' : 'like-o'" />
                  {{ formatNumber(item.likes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-tabbar v-model="activeTab" active-color="#667eea" inactive-color="#999">
      <van-tabbar-item icon="home-o" @click="goToHome">首页</van-tabbar-item>
      <van-tabbar-item icon="star-o" @click="goToFavorites">收藏</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="goToPublish">发布</van-tabbar-item>
      <van-tabbar-item icon="user-o" @click="goToProfile">我的</van-tabbar-item>
    </van-tabbar>

    <LoginModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const activeCategory = ref(0)
const isRefreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const activeTab = ref(0)
const pageSize = 10
const currentPage = ref(1)

const categories = computed(() => userStore.categories)

const filteredList = computed(() => {
  let list = searchKeyword.value
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

function isLiked(id) {
  return userStore.isLiked(id)
}

function handleLike(item) {
  userStore.requireLogin(() => {
    userStore.toggleLike(item.id)
  })
}

function onSearch(value) {
  currentPage.value = 1
  finished.value = false
}

function onCancel() {
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

.search-container {
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.search-container :deep(.van-search) {
  padding: 0;
  background: transparent;
}

.search-container :deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
}

.category-container {
  background: #fff;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.category-scroll {
  display: flex;
  overflow-x: auto;
  padding: 0 12px;
  gap: 16px;
  scrollbar-width: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
}

.category-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-item.active .category-name {
  color: #fff;
  font-weight: 600;
}

.category-icon {
  font-size: 24px;
}

.category-name {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.knowledge-list {
  padding: 12px;
}

.knowledge-card {
  display: flex;
  gap: 12px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.knowledge-card:active {
  transform: scale(0.98);
}

.card-image {
  position: relative;
  width: 120px;
  height: 100px;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(102, 126, 234, 0.9);
  color: #fff;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 12px 12px 0;
  gap: 8px;
}

.card-title {
  font-size: 15px;
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
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.meta-item.liked {
  color: #ff4d4f;
}

.meta-item :deep(.van-icon) {
  font-size: 14px;
}
</style>
