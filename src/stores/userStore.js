import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { defaultUser, testUser, coldKnowledgeList, commentsData, categories } from '@/data/mockData'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('cold_knowledge_user')) || defaultUser)
  const favorites = ref(JSON.parse(localStorage.getItem('cold_knowledge_favorites')) || [])
  const history = ref(JSON.parse(localStorage.getItem('cold_knowledge_history')) || [])
  const myPosts = ref(JSON.parse(localStorage.getItem('cold_knowledge_my_posts')) || [])
  const likedItems = ref(JSON.parse(localStorage.getItem('cold_knowledge_liked')) || [])
  const showLoginModal = ref(false)

  const isLoggedIn = computed(() => user.value.isLoggedIn)

  const knowledgeList = ref([...coldKnowledgeList])
  const comments = ref({ ...commentsData })

  function login() {
    user.value = { ...testUser }
    saveUserToStorage()
    showLoginModal.value = false
  }

  function logout() {
    user.value = { ...defaultUser }
    saveUserToStorage()
  }

  function toggleLoginModal() {
    showLoginModal.value = !showLoginModal.value
  }

  function requireLogin(callback) {
    if (isLoggedIn.value) {
      callback()
    } else {
      showLoginModal.value = true
    }
  }

  function addToFavorites(item) {
    const index = favorites.value.findIndex(f => f.id === item.id)
    if (index === -1) {
      favorites.value.unshift({
        id: item.id,
        title: item.title,
        coverImage: item.coverImage,
        intro: item.intro,
        categoryName: item.categoryName,
        views: item.views,
        likes: item.likes,
        addTime: new Date().toLocaleString()
      })
      saveFavoritesToStorage()
      return true
    }
    return false
  }

  function removeFromFavorites(id) {
    const index = favorites.value.findIndex(f => f.id === id)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavoritesToStorage()
      return true
    }
    return false
  }

  function isFavorited(id) {
    return favorites.value.some(f => f.id === id)
  }

  function addToHistory(item) {
    const index = history.value.findIndex(h => h.id === item.id)
    if (index !== -1) {
      history.value.splice(index, 1)
    }
    history.value.unshift({
      id: item.id,
      title: item.title,
      coverImage: item.coverImage,
      intro: item.intro,
      categoryName: item.categoryName,
      views: item.views,
      likes: item.likes,
      viewTime: new Date().toLocaleString()
    })
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
    saveHistoryToStorage()
  }

  function clearHistory() {
    history.value = []
    saveHistoryToStorage()
  }

  function addMyPost(post) {
    const newPost = {
      id: knowledgeList.value.length + 1000 + myPosts.value.length,
      title: post.title,
      intro: post.intro,
      coverImage: post.coverImage,
      categoryId: post.categoryId,
      categoryName: categories.find(c => c.id === post.categoryId)?.name || '未分类',
      views: 0,
      likes: 0,
      createTime: new Date().toLocaleString(),
      author: {
        id: user.value.id,
        nickname: user.value.nickname,
        avatar: user.value.avatar
      },
      content: post.content
    }
    knowledgeList.value.unshift(newPost)
    myPosts.value.unshift({
      ...newPost,
      publishTime: newPost.createTime
    })
    comments.value[newPost.id] = []
    saveMyPostsToStorage()
    return newPost
  }

  function toggleLike(itemId) {
    const index = likedItems.value.indexOf(itemId)
    if (index === -1) {
      likedItems.value.push(itemId)
      const item = knowledgeList.value.find(k => k.id === itemId)
      if (item) {
        item.likes++
      }
    } else {
      likedItems.value.splice(index, 1)
      const item = knowledgeList.value.find(k => k.id === itemId)
      if (item && item.likes > 0) {
        item.likes--
      }
    }
    saveLikedToStorage()
  }

  function isLiked(itemId) {
    return likedItems.value.includes(itemId)
  }

  function addComment(itemId, content) {
    if (!comments.value[itemId]) {
      comments.value[itemId] = []
    }
    const newComment = {
      id: Date.now(),
      userId: user.value.id,
      nickname: user.value.nickname,
      avatar: user.value.avatar,
      content: content,
      createTime: new Date().toLocaleString(),
      likes: 0
    }
    comments.value[itemId].unshift(newComment)
    return newComment
  }

  function getComments(itemId) {
    return comments.value[itemId] || []
  }

  function incrementViews(itemId) {
    const item = knowledgeList.value.find(k => k.id === itemId)
    if (item) {
      item.views++
    }
  }

  function searchKnowledge(keyword) {
    if (!keyword.trim()) {
      return knowledgeList.value
    }
    const lowerKeyword = keyword.toLowerCase()
    return knowledgeList.value.filter(item => 
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.intro.toLowerCase().includes(lowerKeyword)
    )
  }

  function getKnowledgeByCategory(categoryId) {
    if (categoryId === 0) {
      return knowledgeList.value
    }
    return knowledgeList.value.filter(item => item.categoryId === categoryId)
  }

  function getKnowledgeById(id) {
    const idNum = parseInt(id)
    return knowledgeList.value.find(item => item.id === idNum)
  }

  function saveUserToStorage() {
    localStorage.setItem('cold_knowledge_user', JSON.stringify(user.value))
  }

  function saveFavoritesToStorage() {
    localStorage.setItem('cold_knowledge_favorites', JSON.stringify(favorites.value))
  }

  function saveHistoryToStorage() {
    localStorage.setItem('cold_knowledge_history', JSON.stringify(history.value))
  }

  function saveMyPostsToStorage() {
    localStorage.setItem('cold_knowledge_my_posts', JSON.stringify(myPosts.value))
  }

  function saveLikedToStorage() {
    localStorage.setItem('cold_knowledge_liked', JSON.stringify(likedItems.value))
  }

  return {
    user,
    favorites,
    history,
    myPosts,
    likedItems,
    showLoginModal,
    isLoggedIn,
    knowledgeList,
    comments,
    categories,
    login,
    logout,
    toggleLoginModal,
    requireLogin,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    addToHistory,
    clearHistory,
    addMyPost,
    toggleLike,
    isLiked,
    addComment,
    getComments,
    incrementViews,
    searchKnowledge,
    getKnowledgeByCategory,
    getKnowledgeById
  }
})
