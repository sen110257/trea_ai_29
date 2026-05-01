<template>
  <div class="publish-page">
    <van-nav-bar
      title="发布冷知识"
      left-arrow
      @click-left="goBack"
      class="nav-bar"
    >
      <template #right>
        <span class="publish-btn" @click="submitForm">发布</span>
      </template>
    </van-nav-bar>

    <div class="publish-content">
      <template v-if="isLoggedIn">
        <van-form @submit="onSubmit">
          <div class="form-section">
            <div class="form-item">
              <label class="form-label">选择分类</label>
              <van-picker
                :columns="categoryColumns"
                v-model:show="showCategoryPicker"
                @confirm="onCategoryConfirm"
              />
              <van-field
                v-model="form.categoryName"
                placeholder="请选择分类"
                readonly
                is-link
                @click="showCategoryPicker = true"
              />
            </div>

            <div class="form-item">
              <label class="form-label">上传封面</label>
              <van-uploader
                v-model="form.coverImage"
                :max-count="1"
                :after-read="afterReadCover"
                :deletable="true"
                accept="image/*"
              >
                <div class="upload-tip">
                  <van-icon name="plus" size="30" color="#999" />
                  <p>上传封面图片</p>
                  <span>支持 jpg、png 格式</span>
                </div>
              </van-uploader>
            </div>

            <div class="form-item">
              <label class="form-label">冷知识标题</label>
              <van-field
                v-model="form.title"
                placeholder="请输入标题（最多50字）"
                maxlength="50"
                show-word-limit
              />
            </div>

            <div class="form-item">
              <label class="form-label">简介</label>
              <van-field
                v-model="form.intro"
                type="textarea"
                placeholder="用一句话概括这条冷知识..."
                :autosize="{ maxHeight: 120 }"
                maxlength="100"
                show-word-limit
              />
            </div>

            <div class="form-item">
              <label class="form-label">详细内容</label>
              <van-field
                v-model="form.content"
                type="textarea"
                placeholder="详细介绍这条冷知识..."
                :autosize="{ maxHeight: 300 }"
                rows="6"
                maxlength="2000"
                show-word-limit
              />
            </div>
          </div>

          <div class="form-tips">
            <h4 class="tips-title">发布提示</h4>
            <ul class="tips-list">
              <li>请确保内容为原创或已获得授权</li>
              <li>内容需真实可靠，有科学依据</li>
              <li>禁止发布违法违规内容</li>
            </ul>
          </div>
        </van-form>
      </template>

      <div v-else class="login-prompt">
        <van-empty
          image="user"
          description="登录后发布冷知识"
        >
          <template #description>
            <p>登录后可以发布原创冷知识</p>
            <p>分享给更多喜欢冷知识的朋友</p>
          </template>
          <van-button type="primary" round @click="showLogin">
            立即登录
          </van-button>
        </van-empty>
      </div>
    </div>

    <van-tabbar v-model="activeTab" active-color="#667eea" inactive-color="#999">
      <van-tabbar-item icon="home-o" @click="goToHome">首页</van-tabbar-item>
      <van-tabbar-item icon="star-o" @click="goToFavorites">收藏</van-tabbar-item>
      <van-tabbar-item icon="plus" @click="goToPublish">发布</van-tabbar-item>
      <van-tabbar-item icon="user-o" @click="goToProfile">我的</van-tabbar-item>
    </van-tabbar>

    <LoginModal />

    <van-dialog
      v-model:show="showSuccessDialog"
      title="发布成功"
      message="你的冷知识已成功发布，可以在首页和我的发布中查看"
      show-cancel-button
      confirm-button-text="去看看"
      cancel-button-text="继续发布"
      @confirm="goToMyPosts"
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

const activeTab = ref(2)
const showCategoryPicker = ref(false)
const showSuccessDialog = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const form = ref({
  categoryId: 1,
  categoryName: '',
  coverImage: [],
  title: '',
  intro: '',
  content: ''
})

const isLoggedIn = computed(() => userStore.isLoggedIn)

const categoryColumns = computed(() => {
  return userStore.categories
    .filter(c => c.id !== 0)
    .map(c => ({ text: c.name, value: c.id }))
})

function showMessage(msg) {
  toastMessage.value = msg
  showToast.value = true
}

function afterReadCover(file) {
  form.value.coverImage = [file]
}

function onCategoryConfirm({ selectedOptions }) {
  form.value.categoryName = selectedOptions[0].text
  form.value.categoryId = selectedOptions[0].value
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

function goToMyPosts() {
  router.push('/my-posts')
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
  if (!form.value.intro.trim()) {
    showMessage('请输入简介')
    return false
  }
  if (!form.value.content.trim()) {
    showMessage('请输入详细内容')
    return false
  }
  return true
}

function submitForm() {
  if (!isLoggedIn.value) {
    showLogin()
    return
  }
  onSubmit()
}

function onSubmit() {
  if (!validateForm()) {
    return
  }

  let coverImage = ''
  if (form.value.coverImage.length > 0 && form.value.coverImage[0].content) {
    coverImage = form.value.coverImage[0].content
  } else {
    coverImage = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=knowledge%20idea%20lightbulb%20creative%20concept%20colorful%20background&image_size=landscape_4_3'
  }

  userStore.addMyPost({
    categoryId: form.value.categoryId,
    title: form.value.title.trim(),
    intro: form.value.intro.trim(),
    content: form.value.content.trim(),
    coverImage: coverImage
  })

  form.value = {
    categoryId: 1,
    categoryName: '',
    coverImage: [],
    title: '',
    intro: '',
    content: ''
  }

  showSuccessDialog.value = true
}

onMounted(() => {
  activeTab.value = 2
})
</script>

<style scoped>
.publish-page {
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

.publish-btn {
  font-size: 15px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}

.publish-content {
  padding: 12px;
}

.form-section {
  background: #fff;
  border-radius: 12px;
  padding: 0 12px;
  margin-bottom: 12px;
}

.form-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 12px;
}

.form-item :deep(.van-field) {
  padding: 0;
}

.upload-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 160px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px dashed #ddd;
}

.upload-tip p {
  font-size: 14px;
  color: #666;
  margin: 8px 0 4px;
}

.upload-tip span {
  font-size: 11px;
  color: #999;
}

.form-tips {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 12px;
  color: #999;
  line-height: 1.8;
  padding-left: 16px;
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 4px;
  color: #999;
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
