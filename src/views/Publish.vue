<template>
  <div class="publish-page">
    <div v-if="!isLoggedIn" class="login-prompt-section">
      <div class="prompt-content">
        <div class="prompt-icon">📝</div>
        <h2 class="prompt-title">登录后发布冷知识</h2>
        <p class="prompt-desc">登录后可以分享你的原创冷知识，让更多人看到你的精彩内容</p>
        <van-button type="primary" round size="large" block class="login-btn" @click="showLogin">
          立即登录
        </van-button>
        <van-button type="default" round size="large" block class="browse-btn" @click="goToHome">
          先逛逛
        </van-button>
      </div>
    </div>

    <div v-else class="publish-form-section">
      <div class="form-header">
        <h2 class="form-title">发布冷知识</h2>
        <p class="form-subtitle">分享你知道的有趣冷知识</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label class="form-label">
            <span class="label-text">选择分类</span>
            <span class="required">*</span>
          </label>
          <div class="category-chips">
            <span
              v-for="category in categories"
              :key="category.id"
              class="category-chip"
              :class="{ active: form.categoryId === category.id }"
              @click="selectCategory(category.id, category.name)"
            >
              <span class="chip-icon">{{ category.icon }}</span>
              <span class="chip-text">{{ category.name }}</span>
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-text">封面图片</span>
            <span class="optional">（可选）</span>
          </label>
          <div class="upload-section">
            <van-uploader
              v-model="form.coverImage"
              :max-count="1"
              :after-read="afterReadCover"
              :deletable="true"
              accept="image/*"
              capture
            >
              <div class="upload-placeholder">
                <div class="upload-icon">
                  <van-icon name="photograph" size="28" color="#9ca3af" />
                </div>
                <p class="upload-text">上传封面图片</p>
                <p class="upload-hint">支持 jpg、png 格式</p>
              </div>
            </van-uploader>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-text">冷知识标题</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              v-model="form.title"
              type="text"
              placeholder="请输入标题（最多50字）"
              maxlength="50"
              class="form-input"
            />
          </div>
          <div class="word-count">{{ form.title.length }}/50</div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-text">简介</span>
            <span class="required">*</span>
          </label>
          <div class="textarea-wrapper">
            <textarea
              v-model="form.intro"
              placeholder="用一句话概括这条冷知识..."
              maxlength="100"
              rows="2"
              class="form-textarea"
            ></textarea>
          </div>
          <div class="word-count">{{ form.intro.length }}/100</div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-text">详细内容</span>
            <span class="required">*</span>
          </label>
          <div class="textarea-wrapper">
            <textarea
              v-model="form.content"
              placeholder="详细介绍这条冷知识，让更多人了解这个有趣的知识点..."
              maxlength="2000"
              rows="8"
              class="form-textarea large"
            ></textarea>
          </div>
          <div class="word-count">{{ form.content.length }}/2000</div>
        </div>
      </div>

      <div class="form-footer">
        <div class="tips-box">
          <div class="tips-icon">💡</div>
          <div class="tips-text">
            <p>发布提示</p>
            <ul>
              <li>请确保内容为原创或已获得授权</li>
              <li>内容需真实可靠，有科学依据</li>
              <li>禁止发布违法违规内容</li>
            </ul>
          </div>
        </div>

        <van-button
          type="primary"
          round
          block
          size="large"
          class="submit-btn"
          @click="submitForm"
          :loading="isSubmitting"
        >
          发布冷知识
        </van-button>
      </div>
    </div>

    <van-tabbar v-model="activeTab">
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
      v-model:show="showSuccessDialog"
      title="🎉 发布成功"
      :message="successMessage"
      show-cancel-button
      confirm-button-text="去看看"
      cancel-button-text="继续发布"
      @confirm="goToMyPosts"
      @cancel="clearForm"
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

const activeTab = ref('publish')
const showSuccessDialog = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')

const form = ref({
  categoryId: 1,
  categoryName: '科学',
  coverImage: [],
  title: '',
  intro: '',
  content: ''
})

const isLoggedIn = computed(() => userStore.isLoggedIn)
const categories = computed(() => userStore.categories.filter(c => c.id !== 0))

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

function showLogin() {
  userStore.toggleLoginModal()
}

function selectCategory(categoryId, categoryName) {
  form.value.categoryId = categoryId
  form.value.categoryName = categoryName
}

function afterReadCover(file) {
  form.value.coverImage = [file]
}

function validateForm() {
  if (!form.value.categoryName) {
    showMessage('请选择分类')
    return false
  }
  if (!form.value.title.trim()) {
    showMessage('请输入标题')
    return false
  }
  if (form.value.title.trim().length < 5) {
    showMessage('标题至少需要5个字')
    return false
  }
  if (!form.value.intro.trim()) {
    showMessage('请输入简介')
    return false
  }
  if (!form.value.content.trim()) {
    showMessage('请输入详细内容')
    return false
  }
  if (form.value.content.trim().length < 20) {
    showMessage('详细内容至少需要20个字')
    return false
  }
  return true
}

async function submitForm() {
  if (!isLoggedIn.value) {
    showLogin()
    return
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  let coverImage = ''
  if (form.value.coverImage.length > 0 && form.value.coverImage[0].content) {
    coverImage = form.value.coverImage[0].content
  } else {
    const categoryColorMap = {
      1: 'science%20experiment%20blue',
      2: 'history%20ancient%20yellow',
      3: 'animal%20nature%20green',
      4: 'plant%20leaf%20green',
      5: 'human%20body%20pink',
      6: 'space%20stars%20purple',
      7: 'food%20delicious%20orange',
      8: 'art%20colorful%20purple'
    }
    const colorKey = categoryColorMap[form.value.categoryId] || 'knowledge%20lightbulb'
    coverImage = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${colorKey}%20creative%20background&image_size=landscape_4_3`
  }

  userStore.addMyPost({
    categoryId: form.value.categoryId,
    title: form.value.title.trim(),
    intro: form.value.intro.trim(),
    content: form.value.content.trim(),
    coverImage: coverImage
  })

  isSubmitting.value = false

  successMessage.value = `你的冷知识「${form.value.title.trim().substring(0, 15)}...」已成功发布！可以在首页和我的发布中查看。`
  showSuccessDialog.value = true
}

function clearForm() {
  form.value = {
    categoryId: 1,
    categoryName: '科学',
    coverImage: [],
    title: '',
    intro: '',
    content: ''
  }
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

function goToMyPosts() {
  router.push('/my-posts')
}

onMounted(() => {
  activeTab.value = 'publish'
})
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 60px;
}

.login-prompt-section {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.prompt-content {
  text-align: center;
  max-width: 320px;
}

.prompt-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.prompt-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.prompt-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 32px;
}

.login-btn {
  height: 48px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  margin-bottom: 12px !important;
}

.browse-btn {
  height: 48px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  background: #fff !important;
  border: 1px solid #6366f1 !important;
  color: #6366f1 !important;
}

.publish-form-section {
  padding-bottom: 100px;
}

.form-header {
  padding: 24px 20px 16px;
  background: #fff;
  margin-bottom: 12px;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.form-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.form-body {
  padding: 0 16px;
}

.form-group {
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.label-text {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
  font-size: 14px;
  margin-left: 4px;
}

.optional {
  color: #9ca3af;
  font-size: 12px;
  margin-left: 4px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: #f9fafb;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.category-chip:active {
  transform: scale(0.95);
}

.category-chip.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.chip-icon {
  font-size: 16px;
}

.chip-text {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.category-chip.active .chip-text {
  color: #fff;
}

.upload-section {
  display: flex;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-placeholder:active {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.upload-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

.upload-hint {
  font-size: 11px;
  color: #9ca3af;
  margin: 4px 0 0;
}

.input-wrapper {
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  color: #1f2937;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9ca3af;
}

.textarea-wrapper {
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.form-textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  color: #1f2937;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  line-height: 1.6;
  font-family: inherit;
}

.form-textarea.large {
  min-height: 120px;
}

.form-textarea::placeholder {
  color: #9ca3af;
}

.word-count {
  text-align: right;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}

.form-footer {
  padding: 20px 16px;
  margin-top: 8px;
}

.tips-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%);
  border-radius: 16px;
  margin-bottom: 20px;
}

.tips-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tips-text p {
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
  margin: 0 0 8px;
}

.tips-text ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-text li {
  font-size: 12px;
  color: #6366f1;
  line-height: 1.6;
  padding-left: 12px;
  position: relative;
}

.tips-text li::before {
  content: '•';
  position: absolute;
  left: 2px;
  color: #6366f1;
}

.submit-btn {
  height: 52px !important;
  font-size: 17px !important;
  font-weight: 600 !important;
}

.submit-btn:disabled {
  opacity: 0.5;
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

:deep(.van-uploader__upload) {
  width: 120px !important;
  height: 120px !important;
  margin: 0 !important;
}

:deep(.van-uploader__preview-image) {
  width: 120px !important;
  height: 120px !important;
  border-radius: 12px !important;
}

:deep(.van-uploader__preview-delete) {
  width: 24px !important;
  height: 24px !important;
}
</style>
