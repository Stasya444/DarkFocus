<template>
  <div
      v-if="isLoading && !photographer"
      class="min-h-screen flex items-center justify-center bg-black text-white text-xl"
  >
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full"
    >
      <h1 class="text-3xl font-light text-white mb-4 text-center">
        <div
            class="w-1/2 bg-neutral-600 h-4 rounded-md flex mx-auto animate-pulse duration-200"
        ></div>
      </h1>
      <div class="flex justify-center mb-6">
        <div
            class="w-36 h-36 rounded-full bg-neutral-600 animate-pulse duration-200"
        ></div>
      </div>
      <div class="text-center space-y-2 text-white/80 mb-6 flex flex-col">
        <div class="my-2">
          <div
              class="w-1/2 bg-neutral-600 h-4 rounded-md flex mx-auto animate-pulse duration-200"
          ></div>
        </div>
        <div class="my-2">
          <div
              class="w-1/3 bg-neutral-600 h-4 rounded-md flex mx-auto animate-pulse duration-200"
          ></div>
        </div>
        <div class="my-2">
          <div
              class="w-1/3 bg-neutral-600 h-4 rounded-md flex mx-auto animate-pulse duration-200"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <div
      v-else-if="errorMessage && !photographer"
      class="min-h-screen flex items-center justify-center bg-black text-white text-xl"
  >
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full text-center"
    >
      <h1 class="text-2xl font-light text-red-400 mb-4">
        {{ errorMessage }}
      </h1>
      <button
          @click="fetchPhotographer"
          class="px-6 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-white rounded-full border border-blue-400/40"
      >
        Спробувати знову
      </button>
    </div>
  </div>
  <div
      v-else
      class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-10 flex flex-col gap-2 items-center justify-center"
  >
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full"
    >
      <!-- Error message for actions -->
      <div v-if="errorMessage" class="text-red-400 text-sm text-center mb-4">
        {{ errorMessage }}
      </div>
      <!-- Адмін кнопки -->
      <div
          v-if="store.userRole === 'admin'"
          class="flex justify-center items-center"
      >
        <button
            v-if="!photographer.isVerified"
            @click="handleVerifyProfile"
            class="px-6 py-2 flex mb-5 text-white bg-green-300/30 hover:bg-green-300/50 rounded-full border border-green-300/40 shadow-lg transition"
        >
          Верифікувати
        </button>
        <button
            v-if="photographer.isVerified"
            @click="handleDeverifyProfile"
            class="px-6 py-2 flex mb-5 text-white bg-red-300/30 hover:bg-red-300/50 rounded-full border border-red-300/40 shadow-lg transition"
        >
          Деверифікувати
        </button>
      </div>
      <!-- Кнопки фотографа -->
      <div class="flex mx-auto w-fit gap-2" v-if="isOwn">
        <button
            v-if="!isEditing"
            @click="handleEditProfile"
            class="px-6 py-2 flex mb-5 text-white bg-gray-600/30 hover:bg-gray-600/50 rounded-full border border-gray-400/40 shadow-lg transition"
        >
          Редагувати
        </button>
        <template v-else>
          <button
              @click="handleUpdateProfile"
              class="px-6 py-2 flex mb-5 text-white bg-blue-300/30 hover:bg-blue-300/50 rounded-full border border-blue-300/40 shadow-lg transition"
          >
            Зберегти
          </button>
          <button
              @click="handleEditProfile"
              class="px-6 py-2 flex mb-5 text-white bg-neutral-300/30 hover:bg-neutral-300/50 rounded-full border border-neutral-300/40 shadow-lg transition"
          >
            Відмінити
          </button>
        </template>
      </div>

      <h1
          v-if="!isEditing"
          class="text-3xl font-light text-white mb-2 text-center"
      >
        {{ photographer.name }}
      </h1>
      <input
          v-else
          class="text-3xl font-light text-white mb-2 text-center border mx-auto flex"
          v-model="editForm.name"
          type="text"
      />
      <div
          v-if="!photographer.isVerified"
          class="flex mx-auto mb-4 justify-center w-full"
      >
        <span class="text-red-400 text-sm text-center"
        >Фотограф не верифікований</span
        >
      </div>
      <div
          v-if="photographer.totalRating"
          class="flex mx-auto w-fit gap-2 mt-2 mb-4 text-md"
      >
        <span class="text-yellow-400"> ★ </span>
        <span class="text-gray-400 font-bold justify-center">
          {{ (+photographer.totalRating).toFixed(2) }}
        </span>
      </div>

      <!-- Аватар -->
      <div class="flex justify-center mb-6">
        <div v-if="!isEditing">
          <img
              :src="photographer.avatar"
              class="w-36 h-36 rounded-full object-cover border-2 border-white/30 shadow-lg"
          />
        </div>
        <div v-else class="flex flex-col items-center">
          <img
              :src="editForm.avatarPreview || photographer.avatar"
              class="w-36 h-36 rounded-full object-cover border-2 border-white/30 shadow-lg mb-2"
          />
          <label
              class="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-full border border-gray-400/40 cursor-pointer"
          >
            Змінити аватар
            <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
            />
          </label>
        </div>
      </div>

      <div class="text-center space-y-2 text-white/80 mb-6">
        <p v-if="!isEditing" class="text-lg italic opacity-80">
          “{{ photographer.about }}”
        </p>
        <textarea
            v-else
            v-model="editForm.about"
            class="border px-2 py-1 rounded-lg w-full"
        ></textarea>
        <p v-if="!isEditing">
          📍 {{ photographer.city }} • 🎭 {{ photographer.style }} • 💵
          {{ photographer.price }}₴
        </p>
        <p v-else>
          📍
          <input
              type="text"
              class="border px-2 py-1 rounded-md"
              v-model="editForm.city"
          />
          • 🎭
          <input
              type="text"
              class="border px-2 py-1 rounded-md"
              v-model="editForm.style"
          />
          • 💵
          <input
              type="text"
              class="border px-2 py-1 rounded-md"
              v-model="editForm.price"
          />₴
        </p>
      </div>

      <!-- Статистика -->
      <div class="flex mx-auto w-fit justify-center gap-5 text-md font-medium">
        <p v-if="photographer.bookings" class="text-sm text-gray-400">
          💼 {{ photographer.bookings.length }} замовлень
        </p>
        <p class="text-sm text-gray-400">
          🕒
          {{ differenceInYears(new Date(), new Date(photographer.createdAt)) }}
          років з нами
        </p>
      </div>

      <!-- Фото -->
      <div class="mt-6">
        <div v-if="!isEditing" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img
              v-for="(photo, i) in photographer.photos"
              :key="i"
              :src="photo.url"
              class="rounded-xl object-cover w-full h-40 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md"
              @click="openPhoto(i)"
          />
        </div>
        <div v-else class="flex flex-col items-center gap-4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <img
                v-for="(preview, i) in editForm.photoPreviews"
                :key="i"
                :src="preview"
                class="rounded-xl object-cover w-full h-40 shadow-md"
            />
          </div>
          <label
              class="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-full border border-gray-400/40 cursor-pointer"
          >
            Додати фото
            <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handlePhotoChange"
            />
          </label>
          <button
              @click="savePhotos"
              class="mt-2 px-4 py-2 bg-green-600 text-white rounded-full"
          >
            Зберегти фото
          </button>
        </div>
      </div>

      <!-- Кнопка бронювання -->
      <div class="mt-10 text-center">
        <button
            @click="showBooking = true"
            class="px-6 py-3 bg-blue-600/30 hover:bg-blue-600/50 text-white rounded-full border border-blue-400/40 shadow-lg transition"
        >
          📅 Забронювати
        </button>
      </div>
    </div>

    <!-- Відгуки -->
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full"
    >
      <h1 class="text-xl text-white mb-2 font-medium">Відгуки</h1>
      <hr class="border-white/10 mb-3" />
      <div
          v-if="store.isLoggedIn"
          class="flex flex-col gap-2 items-start justify-start w-full"
      >
        <h2 class="text-md text-white mb-1 font-light">Залишити відгук</h2>
        <div class="stars">
          <label
              v-for="i in 5"
              :key="i"
              class="cursor-pointer text-2xl transition-colors"
              :for="'star-' + i"
          >
            <input
                type="radio"
                :id="'star-' + i"
                name="star"
                :value="i"
                v-model="reviewForm.rating"
                class="hidden"
            />
            <span
                :class="{
                'text-yellow-400': reviewForm.rating >= i,
                'text-gray-400': reviewForm.rating < i,
              }"
            >★</span
            >
          </label>
        </div>
        <textarea
            v-model="reviewForm.comment"
            placeholder="Ваш коментар"
            class="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-white/50"
        ></textarea>
        <button
            @click="handleSubmitReview"
            class="px-6 py-2 flex text-white bg-neutral-300/30 hover:bg-neutral-300/50 rounded-full border border-neutral-300/40 shadow-lg transition"
        >
          Коментувати
        </button>
        <span v-if="reviewError" class="text-red-400 text-sm">{{
            reviewError
          }}</span>
      </div>
      <h3 class="text-gray-400" v-else>Зареєструйтесь, щоб залишати відгуки</h3>
      <template v-if="photographer.ratings">
        <div
            v-for="review in [...photographer.ratings].sort(
            (a, b) => b.id - a.id
          )"
            :key="review.id"
            class="bg-white/10 p-3 rounded-md text-white/80 flex justify-between mt-3"
        >
          <div v-if="review" class="flex flex-col gap-1">
            <span class="text-xs text-gray-400 mb-2"
            >{{ new Date(review.createdAt).toLocaleTimeString() }}
              {{ new Date(review.createdAt).toLocaleDateString() }}</span
            >
            <span v-if="review.author" class="text-md">
              <NuxtLink
                  :title="'Перейти до профілю користувача ' + review.author.name"
                  class="hover:underline"
                  :to="'/user/' + review.author.id"
              >{{ review.author.name }}</NuxtLink
              >
            </span>
            <span class="text-sm my-1">{{ review.comment }}</span>
            <span class="text-xs text-blue-400 mt-1">
              <label
                  v-for="i in 5"
                  :key="i"
                  class="cursor-pointer text-2xl transition-colors"
                  :for="'star-' + i"
              >
                <input
                    type="radio"
                    :id="'star-' + i"
                    name="star"
                    :value="i"
                    disabled
                    :checked="i === review.rating"
                    class="hidden"
                />
                <span
                    :class="{
                    'text-yellow-400': review.rating >= i,
                    'text-gray-400': review.rating < i,
                  }"
                >★</span
                >
              </label>
            </span>
          </div>
          <button
              v-if="store.userRole === 'admin'"
              @click="handleDeleteReview(review.id)"
              class="text-red-400 hover:text-red-300 hover:cursor-pointer text-xs transition"
          >
            Видалити
          </button>
        </div>
      </template>
    </div>
  </div>

  <!-- Модальне вікно бронювання -->
  <div
      v-if="showBooking"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
        ref="modalWindow"
        class="bg-neutral-900 p-6 rounded-xl w-full max-w-md text-white relative"
    >
      <h3 class="text-xl mb-4 text-center font-semibold">Бронювання</h3>
      <input
          v-if="!store || !store.userPhone"
          v-model="booking.phone"
          type="text"
          placeholder="Номер телефону"
          class="w-full mb-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/60"
      />
      <VueDatePicker
          v-model="booking.date"
          class="bg-neutral-600 rounded-md mt-1 mb-4"
          dark
          :min-date="new Date()"
          :disabled-dates="disabledDates"
      />
      <p v-if="errorMessage" class="text-red-500 text-sm mb-3">
        {{ errorMessage }}
      </p>
      <div class="flex justify-end gap-3">
        <button
            @click="showBooking = false"
            class="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
        >
          Скасувати
        </button>
        <button
            @click="handleSubmitBooking"
            class="px-4 py-2 rounded-xl bg-blue-600/40 hover:bg-blue-600/60 text-white transition"
        >
          Підтвердити
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { differenceInYears } from 'date-fns';

const route = useRoute();
const photographer = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);
const showBooking = ref(false);
const store = useUserStore();
const booking = ref({
  name: '',
  phone: '',
  date: '',
});
const isOwn = ref(false);
const isEditing = ref(false);
const reviewError = ref(null);
const modalWindow = useTemplateRef('modalWindow');

const editForm = ref({
  name: '',
  about: '',
  city: '',
  style: '',
  price: null,
  avatar: null,
  avatarPreview: null,
  photoFiles: [],
  photoPreviews: [],
});

const reviewForm = ref({
  comment: '',
  rating: null,
});

const disabledDates = computed(() => {
  if (!photographer.value?.bookings) return [];
  return photographer.value.bookings.map((booking) => new Date(booking.date));
});

const fetchPhotographer = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = null;

    if (!route.params.id) {
      throw new Error('Невалідний ID фотографа');
    }

    const res = await $fetch(`/api/photographers/${route.params.id}`, {
      method: 'GET',
    });

    if (!res.photographer) {
      throw new Error('Фотограф не знайдений');
    }

    photographer.value = res.photographer;
    editForm.value = {
      name: photographer.value.name || '',
      about: photographer.value.about || '',
      city: photographer.value.city || '',
      style: photographer.value.style || '',
      price: photographer.value.price || null,
      avatar: null,
      avatarPreview: null,
      photoFiles: [],
      photoPreviews: [],
    };
    isOwn.value = photographer.value.userId === store.userId;

    const ratingRes = await $fetch(`/api/photographers/rating/${route.params.id}`);
    const totalRating = formTotalRating(ratingRes.rating);
    photographer.value = {
      ...photographer.value,
      totalRating,
    };
  } catch (err) {
    console.error('Помилка завантаження фотографа:', err);
    errorMessage.value = err.message || 'Не вдалося завантажити дані фотографа';
    photographer.value = null;
  } finally {
    isLoading.value = false;
  }
};

const handlePhotoChange = (event) => {
  const files = event.target.files;
  if (!files || !files.length) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validFiles = Array.from(files).filter((file) => {
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = `Непідтримуваний тип файлу: ${file.name}`;
      return false;
    }
    if (file.size > maxSize) {
      errorMessage.value = `Файл занадто великий: ${file.name}`;
      return false;
    }
    return true;
  });

  editForm.value.photoFiles = validFiles;
  editForm.value.photoPreviews = validFiles.map((file) => URL.createObjectURL(file));
};

const savePhotos = async () => {
  try {
    errorMessage.value = null;

    if (!isOwn.value && store.userRole !== 'admin') {
      throw new Error('Немає прав для завантаження фото');
    }

    if (!editForm.value.photoFiles.length) {
      throw new Error('Не вибрано жодного фото');
    }

    const formData = new FormData();
    editForm.value.photoFiles.forEach((file) => {
      formData.append('photos', file);
    });

    const res = await $fetch(`/api/photographers/photos/${route.params.id}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.success) {
      throw new Error(res.message || 'Помилка при збереженні фото');
    }

    photographer.value.photos = res.photos;

    editForm.value.photoFiles = [];
    editForm.value.photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    editForm.value.photoPreviews = [];

    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка збереження фото:', err);
    errorMessage.value = err.message || 'Не вдалося зберегти фото';
  }
};

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = `Непідтримуваний тип файлу: ${file.name}`;
    return;
  }
  if (file.size > maxSize) {
    errorMessage.value = `Файл занадто великий: ${file.name}`;
    return;
  }

  editForm.value.avatar = file;
  editForm.value.avatarPreview = URL.createObjectURL(file);
};

const handleSubmitBooking = async () => {
  try {
    errorMessage.value = null;
    const res = await $fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: store && store.userName ? store.userName : booking.value.name,
        phone: store && store.userPhone ? store.userPhone : booking.value.phone,
        date: new Date(booking.value.date).toISOString(),
        photographerId: route.params.id,
        userId: store.userId,
      }),
    });

    showBooking.value = false;
    booking.value = { name: '', phone: '', date: '' };
    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка бронювання:', err);
    errorMessage.value = err.message || 'Не вдалося створити бронювання';
  }
};

const handleSubmitReview = async () => {
  try {
    errorMessage.value = null;
    reviewError.value = null;

    if (!reviewForm.value.rating || !reviewForm.value.comment.trim()) {
      throw new Error('Заповніть рейтинг і коментар');
    }

    const res = await $fetch('/api/photographers/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: reviewForm.value.comment,
        rating: reviewForm.value.rating,
        author: store.userId,
        photographerId: route.params.id,
      }),
    });

    if (!res.success) {
      throw new Error(res.message || 'Помилка при відправленні відгуку');
    }

    reviewForm.value.comment = '';
    reviewForm.value.rating = null;
    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка відгуку:', err);
    reviewError.value = err.message || 'Не вдалося відправити відгук';
  }
};

const handleDeleteReview = async (id) => {
  if (!confirm('Ви впевнені, що хочете видалити цей відгук?')) return;
  try {
    errorMessage.value = null;
    const res = await $fetch('/api/photographers/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentId: id,
        photographerId: route.params.id,
      }),
    });

    if (!res.success) {
      throw new Error(res.message || 'Помилка при видаленні відгуку');
    }

    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка видалення відгуку:', err);
    errorMessage.value = err.message || 'Не вдалося видалити відгук';
  }
};

const handleEditProfile = () => {
  if (isEditing.value) {
    if (editForm.value.avatarPreview) {
      URL.revokeObjectURL(editForm.value.avatarPreview);
      editForm.value.avatarPreview = null;
      editForm.value.avatar = null;
    }
    editForm.value.photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    editForm.value.photoFiles = [];
    editForm.value.photoPreviews = [];
  } else {
    editForm.value = {
      name: photographer.value.name || '',
      about: photographer.value.about || '',
      city: photographer.value.city || '',
      style: photographer.value.style || '',
      price: photographer.value.price || null,
      avatar: null,
      avatarPreview: null,
      photoFiles: [],
      photoPreviews: [],
    };
  }
  isEditing.value = !isEditing.value;
};

const handleUpdateProfile = async () => {
  try {
    errorMessage.value = null;
    const formData = new FormData();
    for (const key in editForm.value) {
      if (key === 'avatar' && editForm.value.avatar) {
        formData.append('avatar', editForm.value.avatar);
      } else if (key !== 'avatarPreview' && key !== 'photoFiles' && key !== 'photoPreviews') {
        formData.append(key, editForm.value[key] || '');
      }
    }

    const res = await $fetch(`/api/photographers/edit/${route.params.id}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.photographer) {
      throw new Error(res.message || 'Помилка при оновленні профілю');
    }

    photographer.value = res.photographer;
    isEditing.value = false;

    if (editForm.value.avatarPreview) {
      URL.revokeObjectURL(editForm.value.avatarPreview);
      editForm.value.avatarPreview = null;
      editForm.value.avatar = null;
    }

    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка оновлення профілю:', err);
    errorMessage.value = err.message || 'Не вдалося оновити профіль';
  }
};

const handleVerifyProfile = async () => {
  if (store.userRole !== 'admin') return;
  try {
    errorMessage.value = null;
    const res = await $fetch(`/api/photographers/verify/${route.params.id}`, {
      method: 'POST',
    });

    if (!res.photographer) {
      throw new Error(res.message || 'Помилка при верифікації профілю');
    }

    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка верифікації:', err);
    errorMessage.value = err.message || 'Не вдалося верифікувати профіль';
  }
};

const handleDeverifyProfile = async () => {
  if (store.userRole !== 'admin') return;
  try {
    errorMessage.value = null;
    const res = await $fetch(`/api/photographers/unverify/${route.params.id}`, {
      method: 'POST',
    });

    if (!res.photographer) {
      throw new Error(res.message || 'Помилка при деверифікації профілю');
    }

    await fetchPhotographer();
  } catch (err) {
    console.error('Помилка деверифікації:', err);
    errorMessage.value = err.message || 'Не вдалося деверифікувати профіль';
  }
};

const formTotalRating = (allRatings) => {
  if (!allRatings || allRatings.length === 0) return 0;
  const sum = allRatings.reduce((acc, rating) => acc + rating.rating, 0);
  return sum / allRatings.length;
};

const openPhoto = (index) => {
  console.log('Відкрити фото:', photographer.value.photos[index]);
};

onMounted(async () => {
  await fetchPhotographer();
  onClickOutside(modalWindow, () => (showBooking.value = false));
});
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>