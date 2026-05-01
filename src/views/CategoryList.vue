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

    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="knowledge-list" v-if="sortedList.length > 0">
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
        
        <van-empty
          v-else
          image="search"
          description="该分类暂无内容"
        />
      </van-list>
    </van-pull-refresh>

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

onMounted(() => {
  currentPage.value = 1
  finished.value = false
})
</script>

<style scoped>
.category-list-page {
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

.sort-tabs {
  display: flex;
  background: #fff;
  padding: 12px;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.sort-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #666;
  border-radius: 8px;
  background: #f5f5f5;
  transition: all 0.3s;
  cursor: pointer;
}

.sort-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 500;
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
