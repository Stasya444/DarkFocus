<template>
  <div v-if="!user" class="min-h-screen flex items-center justify-center bg-neutral-900 text-white text-xl">
    <!-- Loader -->
    <div class="bg-neutral-800/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full">
      <div class="w-1/2 bg-neutral-700 h-4 rounded-md mx-auto animate-pulse mb-6"></div>
      <div class="w-36 h-36 rounded-full bg-neutral-700 animate-pulse mx-auto mb-6"></div>
      <div class="w-1/3 bg-neutral-700 h-4 rounded-md mx-auto animate-pulse mb-2"></div>
      <div class="w-1/3 bg-neutral-700 h-4 rounded-md mx-auto animate-pulse"></div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gradient-to-br from-black to-neutral-900 p-10 flex items-center justify-center">
    <div class="bg-neutral-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl max-w-4xl w-full space-y-8">
      <div class="flex flex-col items-center">
        <img
            :src="user.avatar || defaultAvatar"
            :alt="user.name"
            class="w-36 h-36 rounded-full object-cover border-2 border-blue-400/30 shadow-lg mb-4 bg-neutral-800"
        />
        <h1 class="text-3xl font-light text-white mb-2 text-center">{{ user.name }}</h1>
        <div class="text-lg text-neutral-400">{{ user.email }}</div>
        <button
            v-if="isOwnProfile"
            @click="openEditModal"
            class="px-7 py-2 mt-5 text-white bg-blue-600/80 hover:bg-blue-700 rounded-full shadow-lg font-semibold transition"
        >
          Редагувати
        </button>
      </div>

      <!-- photographer role — карточка или создание профиля -->
      <div v-if="user.role === 'photographer'">
        <div v-if="photographer" class="text-center space-y-2 text-neutral-300 mb-2 flex flex-col">
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
        </div>
      </div>
    </div>

    <!-- MODAL редактирования профиля пользователя -->
    <Transition name="fade">
      <div
          v-if="showEditModal"
          class="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          @click.self="closeEditModal"
      >
        <form
            class="bg-neutral-900/95 rounded-2xl p-8 shadow-2xl max-w-md w-full flex flex-col gap-5 animate-pop border border-neutral-700"
            @submit.prevent="handleSave"
        >
          <div class="text-center mb-2">
            <h2 class="text-2xl font-bold text-white">Редагування профілю</h2>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-neutral-300">Імʼя</label>
            <input
                v-model="editForm.name"
                type="text"
                required
                class="rounded-lg px-4 py-2 border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring focus:ring-blue-700"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-neutral-300">Email</label>
            <input
                v-model="editForm.email"
                type="email"
                required
                class="rounded-lg px-4 py-2 border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring focus:ring-blue-700"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-neutral-300">Аватар</label>
            <input
                type="file"
                accept="image/*"
                class="block"
                @change="handleAvatarChange"
            />
            <img
                v-if="avatarPreview"
                :src="avatarPreview"
                class="w-20 h-20 rounded-full mx-auto mt-2 border border-neutral-700"
                alt="Avatar preview"
            />
          </div>
          <div v-if="errorMessage" class="text-red-400 text-sm text-center">{{ errorMessage }}</div>
          <div class="flex gap-3 justify-center mt-3">
            <button
                type="submit"
                class="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow font-semibold transition"
            >Зберегти</button>
            <button
                type="button"
                @click="closeEditModal"
                class="px-6 py-2 text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-full shadow transition"
            >Скасувати</button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- MODAL создания профиля фотографа -->
    <Transition name="fade">
      <div
          v-if="isCreatingPhotographer"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          @click.self="isCreatingPhotographer = false"
      >
        <div class="bg-neutral-900/95 rounded-2xl p-7 shadow-2xl max-w-xl w-full border border-neutral-700 animate-pop">
          <AddPhotographerForm
              :userId="user.id"
              @close="isCreatingPhotographer = false"
              @created="onPhotographerCreated"
          />
        </div>
      </div>
    </Transition>
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
const showEditModal = ref(false)
const isCreatingPhotographer = ref(false)
const errorMessage = ref(null)
const avatarPreview = ref(null)
const defaultAvatar = "/default-avatar.png"

const store = useUserStore()
const isOwnProfile = computed(() => user.value && store.userId == user.value.id)

const editForm = ref({
  name: "",
  email: "",
  avatar: null,
})

function openEditModal() {
  editForm.value.name = user.value.name
  editForm.value.email = user.value.email
  editForm.value.avatar = null
  avatarPreview.value = null
  errorMessage.value = null
  showEditModal.value = true
}
function closeEditModal() {
  editForm.value.name = user.value.name
  editForm.value.email = user.value.email
  editForm.value.avatar = null
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = null
  showEditModal.value = false
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
    closeEditModal()
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .28s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-pop {
  animation: pop-in .23s cubic-bezier(.4,2,.6,1);
}
@keyframes pop-in {
  0% { transform: scale(.92); opacity: 0;}
  100% { transform: scale(1); opacity: 1;}
}
body {
  font-family: "Inter", sans-serif;
  background: #0a0a0f;
}
</style>
