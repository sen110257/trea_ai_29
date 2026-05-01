<template>
  <div class="category-list-page">
    <van-nav-bar
      :title="categoryName"
      left-arrow
      @click-left="goBack"
      class="nav-bar"
    />

    <div class="sort-tabs">
      <div
        class="sort-tab"
        :class="{ active: sortType === 'latest' }"
        @click="sortType = 'latest'"
      >
        最新
      </div>
      <div
        class="sort-tab"
        :class="{ active: sortType === 'hot' }"
        @click="sortType = 'hot'"
      >
        热门
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
          <div class="knowledge-list" v-if="sortedList.length > 0">
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
            v-else
            image="search"
            description="该分类暂无内容"
          >
            <template #description>
              <p>还没有相关的冷知识</p>
              <p>去发布你的第一条冷知识吧～</p>
            </template>
            <van-button type="primary" round size="small" @click="goToPublish">
              去发布
            </van-button>
          </van-empty>
        </van-list>
      </van-pull-refresh>
    </div>

    <LoginModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginModal from '@/components/LoginModal.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const categoryId = computed(() => parseInt(route.params.id))
const sortType = ref('latest')
const isRefreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const pageSize = 10
const currentPage = ref(1)

const categoryName = computed(() => {
  const category = userStore.categories.find(c => c.id === categoryId.value)
  return category ? category.name : '分类'
})

const filteredList = computed(() => {
  return userStore.getKnowledgeByCategory(categoryId.value)
})

const sortedList = computed(() => {
  const list = [...filteredList.value]
  if (sortType.value === 'hot') {
    list.sort((a, b) => b.likes - a.likes)
  }
  return list
})

const displayList = computed(() => {
  return sortedList.value.slice(0, currentPage.value * pageSize)
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
  const now = Date.now()
  const time = new Date(timeStr).getTime()
  if (isNaN(time)) return timeStr.split(' ')[0]
  
  const diff = now - time
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
  const category = userStore.categories.find(c => c.id === categoryId)
  return category ? category.icon : '📚'
}

function isLiked(id) {
  return userStore.isLiked(id)
}

function handleLike(item) {
  userStore.requireLogin(() => {
    userStore.toggleLike(item.id)
  })
}

async function onLoad() {
  if (displayList.value.length >= sortedList.value.length) {
    finished.value = true
    loading.value = false
    return
  }
  
  await new Promise(resolve => setTimeout(resolve, 500))
  currentPage.value++
  
  if (displayList.value.length >= sortedList.value.length) {
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

function goBack() {
  router.back()
}

function goToDetail(id) {
  router.push(`/detail/${id}`)
}

function goToPublish() {
  router.push('/publish')
}

onMounted(() => {
  currentPage.value = 1
  finished.value = false
})
</script>

<style scoped>
.category-list-page {
  min-height: 100vh;
  background: #fafafa;
}

.sort-tabs {
  display: flex;
  background: #fff;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.sort-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #6b7280;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.3s;
  cursor: pointer;
  font-weight: 500;
}

.sort-tab.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.list-section {
  padding: 16px;
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
