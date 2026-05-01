<template>
  <div class="detail-page">
    <van-nav-bar
      title="冷知识详情"
      left-arrow
      @click-left="goBack"
      class="nav-bar"
    >
      <template #right>
        <van-icon name="share-o" size="20" @click="handleShare" />
      </template>
    </van-nav-bar>

    <div v-if="knowledge" class="detail-content">
      <div class="detail-cover">
        <img :src="knowledge.coverImage" :alt="knowledge.title" />
        <div class="cover-mask"></div>
        <div class="cover-info">
          <h1 class="detail-title">{{ knowledge.title }}</h1>
          <div class="detail-meta">
            <span class="meta-item">
              <van-icon name="clock-o" />
              {{ knowledge.createTime.split(' ')[0] }}
            </span>
            <span class="meta-item">
              <van-icon name="eye-o" />
              {{ formatNumber(knowledge.views) }} 阅读
            </span>
          </div>
        </div>
      </div>

      <div class="detail-body">
        <div class="author-info">
          <img :src="knowledge.author.avatar" class="author-avatar" />
          <div class="author-text">
            <span class="author-name">{{ knowledge.author.nickname }}</span>
            <span class="author-desc">原创作者</span>
          </div>
          <van-tag type="primary" size="small" round>{{ knowledge.categoryName }}</van-tag>
        </div>

        <div class="detail-text">
          <p v-for="(paragraph, index) in paragraphs" :key="index" class="content-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <div class="action-bar">
          <div class="action-item" :class="{ active: isLiked(knowledge.id) }" @click="handleLike">
            <van-icon :name="isLiked(knowledge.id) ? 'like' : 'like-o'" size="22" />
            <span>{{ formatNumber(knowledge.likes) }}</span>
          </div>
          <div class="action-item" :class="{ active: isFavorited }" @click="handleFavorite">
            <van-icon :name="isFavorited ? 'star' : 'star-o'" size="22" />
            <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="action-item" @click="handleShare">
            <van-icon name="share-o" size="22" />
            <span>分享</span>
          </div>
        </div>
      </div>

      <div class="comments-section">
        <div class="section-header">
          <h3 class="section-title">评论 ({{ comments.length }})</h3>
        </div>

        <div class="comments-list">
          <div v-if="comments.length === 0" class="no-comments">
            <van-empty description="暂无评论，快来抢沙发吧～" />
          </div>
          <div v-else class="comment-item" v-for="comment in comments" :key="comment.id">
            <img :src="comment.avatar" class="comment-avatar" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-name">{{ comment.nickname }}</span>
                <span class="comment-time">{{ comment.createTime }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <span class="comment-like">
                  <van-icon name="like-o" size="14" />
                  {{ comment.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-empty v-else description="内容不存在" />

    <div class="comment-input-bar">
      <van-field
        v-model="commentInput"
        placeholder="说点什么..."
        readonly
        @click="handleCommentClick"
      />
      <van-button type="primary" size="small" round @click="handleCommentClick">
        发送
      </van-button>
    </div>

    <van-popup
      v-model:show="showCommentPopup"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="comment-popup">
        <div class="popup-header">
          <span class="popup-title">发表评论</span>
          <van-icon name="cross" size="20" @click="showCommentPopup = false" class="close-btn" />
        </div>
        <van-field
          v-model="newComment"
          type="textarea"
          placeholder="分享你的想法..."
          :autosize="{ maxHeight: 200 }"
          maxlength="200"
          show-word-limit
          class="comment-textarea"
        />
        <div class="popup-footer">
          <van-button type="primary" round block size="large" @click="submitComment">
            发布评论
          </van-button>
        </div>
      </div>
    </van-popup>

    <LoginModal />

    <van-toast v-model:show="showToast" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginModal from '@/components/LoginModal.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const knowledgeId = computed(() => parseInt(route.params.id))
const knowledge = ref(null)
const comments = ref([])
const commentInput = ref('')
const newComment = ref('')
const showCommentPopup = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const isFavorited = computed(() => knowledge.value ? userStore.isFavorited(knowledge.value.id) : false)

const paragraphs = computed(() => {
  if (!knowledge.value) return []
  return knowledge.value.content.split('\n').filter(p => p.trim())
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

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

function handleLike() {
  if (!knowledge.value) return
  userStore.requireLogin(() => {
    userStore.toggleLike(knowledge.value.id)
    showMessage(userStore.isLiked(knowledge.value.id) ? '点赞成功' : '已取消点赞')
  })
}

function handleFavorite() {
  if (!knowledge.value) return
  userStore.requireLogin(() => {
    if (isFavorited.value) {
      userStore.removeFromFavorites(knowledge.value.id)
      showMessage('已取消收藏')
    } else {
      userStore.addToFavorites(knowledge.value)
      showMessage('收藏成功')
    }
  })
}

function handleShare() {
  showMessage('分享功能开发中...')
}

function handleCommentClick() {
  userStore.requireLogin(() => {
    showCommentPopup.value = true
  })
}

function submitComment() {
  if (!newComment.value.trim()) {
    showMessage('请输入评论内容')
    return
  }
  if (!knowledge.value) return
  
  userStore.addComment(knowledge.value.id, newComment.value.trim())
  comments.value = userStore.getComments(knowledge.value.id)
  newComment.value = ''
  showCommentPopup.value = false
  showMessage('评论成功')
}

function goBack() {
  router.back()
}

function loadData() {
  const item = userStore.getKnowledgeById(knowledgeId.value)
  if (item) {
    knowledge.value = { ...item }
    userStore.incrementViews(item.id)
    userStore.addToHistory(item)
    comments.value = userStore.getComments(item.id)
  }
}

watch(knowledgeId, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 70px;
}

.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

.nav-bar :deep(.van-icon) {
  color: #fff;
}

.detail-cover {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.cover-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px;
  color: #fff;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 12px;
}

.detail-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-body {
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.author-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.author-desc {
  font-size: 12px;
  color: #999;
}

.detail-text {
  margin-bottom: 20px;
}

.content-paragraph {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
  margin-bottom: 16px;
  text-indent: 2em;
}

.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}

.action-item.active {
  color: #ff4d4f;
}

.action-item.active :deep(.van-icon) {
  color: #ff4d4f;
}

.comments-section {
  background: #fff;
  padding: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-left: 8px;
  border-left: 3px solid #667eea;
}

.no-comments {
  padding: 40px 0;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 11px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-like {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  z-index: 100;
}

.comment-input-bar :deep(.van-field) {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
}

.comment-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  position: relative;
  padding: 16px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
}

.comment-textarea {
  flex: 1;
  padding: 16px 20px;
}

.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.popup-footer :deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
</style>
