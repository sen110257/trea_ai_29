<template>
  <div class="detail-page">
    <div class="detail-content" v-if="knowledge">
      <div class="detail-cover">
        <div class="cover-placeholder" :class="getCategoryClass(knowledge.categoryId)">
          <span class="cover-icon">{{ getCategoryIcon(knowledge.categoryId) }}</span>
        </div>
        <div class="cover-overlay"></div>
        <div class="cover-info">
          <h1 class="detail-title">{{ knowledge.title }}</h1>
          <div class="detail-meta">
            <span class="meta-item">
              <van-icon name="clock-o" />
              {{ formatTime(knowledge.createTime) }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">👁️</span>
              {{ formatNumber(knowledge.views) }}
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
            <span class="action-icon">{{ isLiked(knowledge.id) ? '❤️' : '🤍' }}</span>
            <span class="action-text">{{ formatNumber(knowledge.likes) }}</span>
          </div>
          <div class="action-item" :class="{ active: isFavorited }" @click="handleFavorite">
            <span class="action-icon">{{ isFavorited ? '⭐' : '☆' }}</span>
            <span class="action-text">{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="action-item" @click="handleShare">
            <span class="action-icon">📤</span>
            <span class="action-text">分享</span>
          </div>
        </div>
      </div>

      <div class="comments-section">
        <div class="section-header">
          <h3 class="section-title">
            评论
            <span class="comment-count">({{ comments.length }})</span>
          </h3>
        </div>

        <div class="comments-list">
          <div v-if="comments.length === 0" class="no-comments">
            <div class="empty-icon">💬</div>
            <p class="empty-text">暂无评论，快来抢沙发吧～</p>
          </div>
          <div v-else class="comment-item" v-for="comment in comments" :key="comment.id">
            <img :src="comment.avatar" class="comment-avatar" @error="handleAvatarError($event)" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-name">{{ comment.nickname }}</span>
                <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-page">
      <van-empty description="内容不存在" />
    </div>

    <div class="comment-input-bar">
      <div class="input-wrapper" @click="handleCommentClick">
        <span class="input-placeholder">说点什么...</span>
      </div>
      <van-button type="primary" size="small" round class="send-btn" @click="handleCommentClick">
        发送
      </van-button>
    </div>

    <van-popup
      v-model:show="showCommentPopup"
      round
      position="bottom"
      :style="{ height: 'auto', minHeight: '45%' }"
    >
      <div class="comment-popup">
        <div class="popup-header">
          <span class="popup-title">发表评论</span>
          <van-icon name="cross" size="20" @click="closeCommentPopup" class="close-btn" />
        </div>
        
        <div class="popup-content">
          <div class="user-preview">
            <img :src="userStore.user.avatar" class="preview-avatar" />
            <span class="preview-name">{{ userStore.user.nickname }}</span>
          </div>
          
          <textarea
            v-model="newComment"
            class="comment-textarea"
            placeholder="分享你的想法..."
            maxlength="200"
            rows="4"
            ref="textareaRef"
          ></textarea>
          
          <div class="textarea-footer">
            <span class="word-count">{{ newComment.length }}/200</span>
          </div>
        </div>
        
        <div class="popup-footer">
          <van-button 
            type="primary" 
            round 
            block 
            size="large" 
            class="submit-btn"
            @click="submitComment"
            :disabled="!newComment.trim()"
          >
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginModal from '@/components/LoginModal.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const textareaRef = ref(null)
const knowledgeId = computed(() => parseInt(route.params.id))
const knowledge = ref(null)
const comments = ref([])
const newComment = ref('')
const showCommentPopup = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const isFavorited = computed(() => {
  return knowledge.value ? userStore.isFavorited(knowledge.value.id) : false
})

const categories = computed(() => userStore.categories)

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

function formatTime(timeStr) {
  if (!timeStr) return ''
  try {
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
  } catch (e) {
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

function handleAvatarError(event) {
  event.target.src = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20round%20simple%20design&image_size=square'
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
    newComment.value = ''
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.focus()
      }
    })
  })
}

function closeCommentPopup() {
  showCommentPopup.value = false
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
  background: #fafafa;
  padding-bottom: 80px;
}

.detail-content {
  padding-bottom: 20px;
}

.detail-cover {
  position: relative;
  width: 100%;
  height: 260px;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-icon {
  font-size: 80px;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%);
}

.cover-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 20px;
  color: #fff;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.detail-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  opacity: 0.95;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 14px;
}

.detail-body {
  background: #fff;
  margin: -20px 16px 0;
  border-radius: 24px;
  padding: 20px;
  position: relative;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 20px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
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
  color: #1f2937;
}

.author-desc {
  font-size: 12px;
  color: #9ca3af;
}

.detail-text {
  margin-bottom: 20px;
}

.content-paragraph {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 16px;
  text-indent: 2em;
}

.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 16px 0 8px;
  border-top: 1px solid #f3f4f6;
  margin-top: 8px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-item:active {
  transform: scale(0.95);
}

.action-icon {
  font-size: 22px;
}

.action-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.action-item.active .action-text {
  color: #ef4444;
}

.comments-section {
  background: #fff;
  margin: 16px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  padding-left: 12px;
  border-left: 4px solid #6366f1;
}

.comment-count {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 400;
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #9ca3af;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f9fafb;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.comment-time {
  font-size: 11px;
  color: #9ca3af;
}

.comment-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
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
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #f3f4f6;
  z-index: 1000;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
}

.input-wrapper {
  flex: 1;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.input-wrapper:active {
  background: #f3f4f6;
}

.input-placeholder {
  font-size: 14px;
  color: #9ca3af;
}

.send-btn {
  height: 40px !important;
  padding: 0 20px !important;
  font-weight: 600 !important;
}

.comment-popup {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  position: relative;
  padding: 16px 20px;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
}

.popup-content {
  padding: 16px 20px;
  flex: 1;
}

.user-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.preview-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.preview-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.comment-textarea {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #1f2937;
  line-height: 1.6;
  resize: none;
  outline: none;
  font-family: inherit;
}

.comment-textarea:focus {
  border-color: #6366f1;
  background: #fff;
}

.comment-textarea::placeholder {
  color: #9ca3af;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.word-count {
  font-size: 12px;
  color: #9ca3af;
}

.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
}

.submit-btn {
  height: 48px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}

.submit-btn:disabled {
  opacity: 0.5;
}

.empty-page {
  padding-top: 100px;
}

:deep(.van-empty__image) {
  margin-bottom: 16px;
}

:deep(.van-empty__description) {
  color: #9ca3af;
  font-size: 14px;
}
</style>
