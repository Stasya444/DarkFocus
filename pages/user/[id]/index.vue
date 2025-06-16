<template>
  <div v-if="!user" class="min-h-screen flex items-center justify-center bg-black text-white text-xl">
    <!-- Loader -->
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full">
      <div class="w-1/2 bg-neutral-600 h-4 rounded-md mx-auto animate-pulse mb-6"></div>
      <div class="w-36 h-36 rounded-full bg-neutral-600 animate-pulse mx-auto mb-6"></div>
      <div class="w-1/3 bg-neutral-600 h-4 rounded-md mx-auto animate-pulse mb-2"></div>
      <div class="w-1/3 bg-neutral-600 h-4 rounded-md mx-auto animate-pulse"></div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-10 flex items-center justify-center">
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full space-y-6">

      <!-- Профиль пользователя -->
      <form class="flex flex-col items-center gap-4" @submit.prevent="handleSave">
        <div class="flex justify-center mb-4">
          <img
              :src="avatarPreview || user.avatar || defaultAvatar"
              :alt="user.name"
              class="w-36 h-36 rounded-full object-cover border-2 border-blue-500/30 shadow-lg"
          />
        </div>
        <div class="w-full max-w-xs">
          <label class="block mb-1 text-white/70" for="name">Імʼя</label>
          <input
              v-if="isEditing"
              v-model="editForm.name"
              id="name"
              type="text"
              class="w-full rounded-lg px-4 py-2 bg-white/20 border border-white/10 text-white"
              required
          />
          <div v-else class="text-xl">{{ user.name }}</div>
        </div>

        <div class="w-full max-w-xs">
          <label class="block mb-1 text-white/70" for="email">Email</label>
          <input
              v-if="isEditing"
              v-model="editForm.email"
              id="email"
              type="email"
              class="w-full rounded-lg px-4 py-2 bg-white/20 border border-white/10 text-white"
              required
          />
          <div v-else class="text-lg">{{ user.email }}</div>
        </div>

        <div class="w-full max-w-xs">
          <label class="block mb-1 text-white/70">Аватар</label>
          <input
              v-if="isEditing"
              type="file"
              accept="image/*"
              class="block"
              @change="handleAvatarChange"
          />
        </div>

        <div v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</div>

        <div class="flex gap-3 mt-4">
          <button
              v-if="!isEditing && isOwnProfile"
              type="button"
              class="px-6 py-2 text-white bg-gray-600/30 hover:bg-gray-600/50 rounded-full border border-gray-400/40 shadow-lg transition"
              @click="enableEdit"
          >
            Редагувати
          </button>
          <button
              v-if="isEditing"
              type="submit"
              class="px-6 py-2 text-white bg-blue-300/30 hover:bg-blue-300/50 rounded-full border border-blue-300/40 shadow-lg transition"
          >
            Зберегти
          </button>
          <button
              v-if="isEditing"
              type="button"
              class="px-6 py-2 text-white bg-neutral-300/30 hover:bg-neutral-300/50 rounded-full border border-neutral-300/40 shadow-lg transition"
              @click="cancelEdit"
          >
            Відмінити
          </button>
        </div>
      </form>

      <!-- photographer role — карточка или создание профиля -->
      <div v-if="user.role === 'photographer'">
        <div v-if="photographer" class="text-center space-y-2 text-white/80 mb-2 flex flex-col">
          <p class="text-lg font-semibold">{{ photographer.name }}</p>
          <p class="text-lg">Місто: {{ photographer.city }}</p>
          <p class="text-lg">Стиль: {{ photographer.style }}</p>
          <p class="text-lg">Про себе: {{ photographer.about }}</p>
          <p class="text-lg">Ціна: {{ photographer.price }} грн</p>
          <LazyNuxtLink
              :to="'/photographers/' + photographer.id"
              class="text-blue-400 hover:text-blue-200 duration-200 block mt-2"
          >
            Перейти до профілю фотографа
          </LazyNuxtLink>
        </div>
        <div v-else class="flex flex-col items-center mt-4">
          <button
              v-if="isOwnProfile"
              @click="isCreatingPhotographer = true"
              class="px-8 py-2 text-white bg-green-600 hover:bg-green-700 rounded-full shadow-lg font-semibold transition"
          >
            Створити профіль фотографа
          </button>
          <!-- Модальная форма создания профиля фотографа -->
          <AddPhotographerForm
              v-if="isCreatingPhotographer"
              :userId="user.id"
              @close="isCreatingPhotographer = false"
              @created="onPhotographerCreated"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { ref, onMounted, computed } from "vue"
import { useUserStore } from "../../../stores/user"
import AddPhotographerForm from "../../../components/AddPhotographerForm.vue"

const route = useRoute()
const user = ref(null)
const photographer = ref(null)
const isEditing = ref(false)
const errorMessage = ref(null)
const avatarPreview = ref(null)
const defaultAvatar = "/default-avatar.png"

const store = useUserStore()
const isOwnProfile = computed(() => user.value && store.userId == user.value.id)

const isCreatingPhotographer = ref(false)

const editForm = ref({
  name: "",
  email: "",
  avatar: null,
})

const enableEdit = () => {
  editForm.value.name = user.value.name
  editForm.value.email = user.value.email
  isEditing.value = true
}

const cancelEdit = () => {
  editForm.value.name = user.value.name
  editForm.value.email = user.value.email
  editForm.value.avatar = null
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = null
  isEditing.value = false
  errorMessage.value = null
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  const maxSize = 5 * 1024 * 1024
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = "Непідтримуваний тип файлу"
    return
  }
  if (file.size > maxSize) {
    errorMessage.value = "Файл занадто великий"
    return
  }
  editForm.value.avatar = file
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(file)
}

const handleSave = async () => {
  try {
    errorMessage.value = null
    const formData = new FormData()
    formData.append("name", editForm.value.name)
    formData.append("email", editForm.value.email)
    if (editForm.value.avatar) {
      formData.append("avatar", editForm.value.avatar)
    }
    const res = await fetch(`/api/users/edit/${user.value.id}`, {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (!data.user) throw new Error(data.message || "Помилка при оновленні профілю")
    user.value = data.user
    cancelEdit()
  } catch (err) {
    errorMessage.value = err.message || "Не вдалося оновити профіль"
  }
}

function onPhotographerCreated(newPhotographer) {
  photographer.value = newPhotographer
  isCreatingPhotographer.value = false
}

onMounted(async () => {
  const res = await fetch(`/api/getuser/${route.params.id}`)
  if (res.ok) {
    const data = await res.json()
    user.value = data.user
    editForm.value.name = data.user.name
    editForm.value.email = data.user.email
  } else {
    user.value = null
    return
  }

  if (user.value && user.value.role === "photographer") {
    const response = await fetch(`/api/photographers/byuser/${user.value.id}`)
    if (response.ok) {
      const d = await response.json()
      if (d.photographer) {
        photographer.value = Array.isArray(d.photographer) ? d.photographer[0] : d.photographer
      }
    }
  }
})
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>
