<template>
  <div v-if="!photographer" class="min-h-screen flex items-center justify-center bg-black text-white">
    <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl max-w-lg w-full">
      <h1 class="text-4xl font-extralight text-center mb-6">
        <div class="w-3/4 bg-neutral-600 h-5 rounded-full mx-auto animate-pulse"></div>
      </h1>
      <div class="flex justify-center mb-8">
        <div class="w-40 h-40 rounded-full bg-neutral-600 animate-pulse"></div>
      </div>
      <div class="space-y-3 text-center">
        <div class="w-2/3 bg-neutral-600 h-4 rounded-full mx-auto animate-pulse"></div>
        <div class="w-1/2 bg-neutral-600 h-4 rounded-full mx-auto animate-pulse"></div>
        <div class="w-1/3 bg-neutral-600 h-4 rounded-full mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
        <div v-if="store.userRole == 'admin'" class="flex justify-center gap-4 mb-6">
          <button
              v-if="!photographer.isVerified"
              @click="handleVerifyProfile"
              class="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-white rounded-full border border-green-500/30 shadow-md transition-all duration-300"
          >
            Верифікувати
          </button>
          <button
              v-if="photographer.isVerified"
              @click="handleDeverifyProfile"
              class="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-full border border-red-500/30 shadow-md transition-all duration-300"
          >
            Деверифікувати
          </button>
        </div>

        <h1 v-if="!isEditing" class="text-4xl font-extralight text-white text-center mb-4">
          {{ photographer.name }}
        </h1>
        <input
            v-else
            v-model="editForm.name"
            type="text"
            class="text-4xl font-extralight text-white text-center bg-transparent border-b border-white/20 w-full py-2 mb-4 focus:outline-none focus:border-white/40"
        >
        <div v-if="!photographer.isVerified" class="text-center mb-4">
          <span class="text-red-400 text-sm font-medium">Фотограф не верифікований</span>
        </div>
        <div v-if="photographer.totalRating" class="flex justify-center gap-2 mb-6">
          <span class="text-yellow-400 text-lg">★</span>
          <span class="text-white font-semibold">{{ +photographer.totalRating.toFixed(2) }}</span>
        </div>

        <div class="flex justify-center mb-8">
          <img
              :src="photographer.avatar"
              class="w-40 h-40 rounded-full object-cover border-2 border-white/20 shadow-lg"
          />
        </div>

        <div class="text-center space-y-4 mb-8">
          <p v-if="!isEditing" class="text-lg italic text-white/80">
            “{{ photographer.about }}”
          </p>
          <textarea
              v-else
              v-model="editForm.about"
              class="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          ></textarea>
          <p v-if="!isEditing" class="text-lg text-white/80">
            📍 {{ photographer.city }} • 🎭 {{ photographer.style }} • 💵 {{ photographer.price }}₴
          </p>
          <div v-else class="flex flex-col sm:flex-row gap-3 justify-center">
            <input
                type="text"
                v-model="editForm.city"
                placeholder="Місто"
                class="bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-white/40"
            >
            <input
                type="text"
                v-model="editForm.style"
                placeholder="Стиль"
                class="bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-white/40"
            >
            <input
                type="text"
                v-model="editForm.price"
                placeholder="Ціна"
                class="bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-white/40"
            >
          </div>
        </div>

        <div class="flex justify-center gap-6 text-sm text-white/70 mb-8">
          <p v-if="photographer.bookings">💼 {{ photographer.bookings.length }} замовлень</p>
          <p>🕒 {{ differenceInYears(new Date(), new Date(photographer.createdAt)) }} років з нами</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <img
              v-for="(photo, i) in photographer.photos"
              :key="i"
              :src="photo.url"
              class="rounded-lg object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md"
              @click="openPhoto(i)"
          />
        </div>

        <div v-if="isOwn" class="flex justify-center gap-4 mt-10">
          <button
              v-if="!isEditing"
              @click="handleEditProfile"
              class="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-full border border-gray-500/30 shadow-md transition-all duration-300"
          >
            Редагувати
          </button>
          <template v-else>
            <button
                @click="handleUpdateProfile"
                class="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-full border border-blue-500/30 shadow-md transition-all duration-300"
            >
              Зберегти
            </button>
            <button
                @click="handleEditProfile"
                class="px-6 py-2 bg-neutral-500/20 hover:bg-neutral-500/30 text-white rounded-full border border-neutral-500/30 shadow-md transition-all duration-300"
            >
              Відмінити
            </button>
          </template>
        </div>

        <div class="mt-6 text-center">
          <button
              @click="showBooking = true"
              class="px-8 py-3 bg-neutral-500/20 hover:bg-neutral-500/30 text-white rounded-full border border-neutral-500/30 shadow-md transition-all duration-300"
          >
            📅 Забронювати
          </button>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
        <h1 class="text-2xl text-white font-semibold mb-4">Відгуки</h1>
        <hr class="border-white/20 mb-6" />
        <div v-if="store.isLoggedIn" class="space-y-4 mb-6">
          <h2 class="text-lg text-white font-light">Залишити відгук</h2>
          <div class="flex gap-1">
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
                  'text-gray-400': reviewForm.rating < i
                }"
              >★</span>
            </label>
          </div>
          <textarea
              v-model="reviewForm.comment"
              placeholder="Ваш коментар"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          ></textarea>
          <button
              @click="handleSubmitReview"
              class="px-6 py-2 bg-neutral-500/20 hover:bg-neutral-500/30 text-white rounded-full border border-neutral-500/30 shadow-md transition-all duration-300"
          >
            Коментувати
          </button>
          <span v-if="reviewError" class="text-red-400 text-sm">{{ reviewError }}</span>
        </div>
        <h3 v-else class="text-gray-400">Зареєструйтесь, щоб залишати відгуки</h3>
        <template v-if="photographer.ratings">
          <div
              v-for="review in [...photographer.ratings].sort((a, b) => b.id - a.id)"
              :key="review.id"
              class="bg-white/5 p-4 rounded-lg text-white/80 flex justify-between mt-4"
          >
            <div class="space-y-2">
              <span class="text-xs text-gray-400">
                {{ new Date(review.createdAt).toLocaleTimeString() }} {{ new Date(review.createdAt).toLocaleDateString() }}
              </span>
              <span v-if="review.author" class="text-md">
                <LazyNuxtLink
                    :title="'Перейти до профілю користувача ' + review.author.name"
                    class="hover:underline"
                    :to="'/user/' + review.author.id"
                >
                  {{ review.author.name }}
                </LazyNuxtLink>
              </span>
              <span class="text-sm">{{ review.comment }}</span>
              <div class="flex gap-1">
                <label
                    v-for="i in 5"
                    :key="i"
                    class="cursor-pointer text-xl"
                    :for="'star-' + i"
                >
                  <input
                      type="radio"
                      :id="'star-' + i"
                      name="star"
                      :value="i"
                      disabled
                      :checked="i == review.rating"
                      class="hidden"
                  />
                  <span
                      :class="{
                      'text-yellow-400': review.rating >= i,
                      'text-gray-400': review.rating < i
                    }"
                  >★</span>
                </label>
              </div>
            </div>
            <button
                v-if="store.userRole === 'admin'"
                @click="handleDeleteReview(review.id)"
                class="text-red-400 hover:text-red-300 text-xs transition-all duration-300"
            >
              Видалити
            </button>
          </div>
        </template>
      </div>
    </div>

    <div
        v-if="showBooking"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
          ref="modalWindow"
          class="bg-neutral-900 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
      >
        <h3 class="text-2xl font-semibold text-center mb-6">Бронювання</h3>
        <input
            v-if="!store || !store.userName"
            v-model="booking.name"
            type="text"
            placeholder="Ваше ім’я"
            class="w-full mb-4 px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/60 focus:outline-none focus:border-white/40"
        />
        <input
            v-if="!store || store.userPhone === ''"
            v-model="booking.phone"
            type="text"
            placeholder="Номер телефону"
            class="w-full mb-4 px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/60 focus:outline-none focus:border-white/40"
        />
        <VueDatePicker
            v-model="booking.date"
            class="bg-neutral-600 rounded-lg mt-1 mb-6"
            dark
            :min-date="new Date()"
            :disabled-dates="disabledDates"
        />
        <div class="flex justify-end gap-4">
          <button
              @click="showBooking = false"
              class="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
          >
            Скасувати
          </button>
          <button
              @click="handleSubmitBooking"
              class="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-white transition-all duration-300"
          >
            Підтвердити
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, useTemplateRef, computed } from "vue";
import {onClickOutside} from '@vueuse/core'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { differenceInYears } from 'date-fns';

const route = useRoute();
const photographer = ref(null);
const showBooking = ref(false);
const store = useUserStore();
const booking = ref({ 
  name: "", 
  phone: "", 
  date: "" 
});
const isOwn = ref(false);
const isEditing = ref(false);
const reviewError = ref(null);
const modalWindow = useTemplateRef('modalWindow')
const disabledDates = computed(() => {
  let dates = []
  for(let i = 0; i < photographer.value.bookings.length; i++) {
    dates.push(photographer.value.bookings[i].date)
  }

  return dates
})


const editForm = ref({
  name: "",
  about: "",
  city: "",
  style: "",
  price: null,
});

const reviewForm = ref({
  comment: "",
  rating: null,
});

const handleSubmitBooking = async () => {
  try {
    const res = await $fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: (store && store.userName) ? store.userName : booking.value.name,
        phone: (store && store.userPhone) ? store.userPhone : booking.value.phone,
        date: new Date(booking.value.date).toISOString(),
        photographerId: route.params.id,
        userId: store.userId
      }),
    });
      showBooking.value = false;
      booking.value = { name: "", phone: "", date: "" };
      photographer.value = res.photographer
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

const handleSubmitReview = async () => {
  reviewError.value = null;
  try {
    console.log(JSON.stringify({
        comment: reviewForm.value.comment,
        rating: reviewForm.value.rating,
        author: store.userId,
        photographerId: route.params.id,
      }))
    const res = await fetch("/api/photographers/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: reviewForm.value.comment,
        rating: reviewForm.value.rating,
        author: store.userId,
        photographerId: route.params.id,
      }),
    });
    const data = await res.json();
    if(!data.success) {
      reviewError.value = data.message || "Помилка при відправленні відгуку";
      throw new Error(data.message || "Помилка при відправленні відгуку");
    }
    console.log(res)
    console.log(data)
    if (res.ok) {
      reviewForm.value.comment = "";
      reviewForm.value.rating = null;
      
      photographer.value = data.photographer;
      const response = await $fetch(`/api/photographers/rating/${route.params.id}`)
      const totalRating = await formTotalRating(response.rating)
      photographer.value = {
        ...photographer.value,
        totalRating
      };
    } else {
      alert("Помилка при відправленні відгуку");
    }
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteReview = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити цей відгук?")) return;
  try {
    const res = await fetch(`/api/photographers/reviews`, 
    { 
      method: "DELETE", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        commentId: id, 
        photographerId: route.params.id 
      }),
    });
    if (res.ok) {
      const data = await res.json();
      photographer.value = data.photographer;
      const response = await $fetch(`/api/photographers/rating/${route.params.id}`)
      const totalRating = await formTotalRating(response.rating)
      photographer.value = {
        ...photographer.value,
        totalRating
      };
    } else {
      alert("Помилка при видаленні відгуку");
    }
  } catch (err) {
    console.error(err);
  }
};

const handleEditProfile = () => {
  isEditing.value = !isEditing.value;
};

const handleUpdateProfile = async () => {
  try {
    const formData = new FormData();
    for(const key in editForm.value) {
      formData.append(key, editForm.value[key]);
    }
    const res = await fetch(`/api/photographers/edit/${route.params.id}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Помилка при оновленні профілю");
    const data = await res.json();
    if(data.statusCode == 200) {
      photographer.value = data.photographer;
      isEditing.value = false;
      const response = await $fetch(`/api/photographers/rating/${route.params.id}`)
      const totalRating = await formTotalRating(response.rating)
      photographer.value = {
        ...photographer.value,
        totalRating
      };
    } else {
      throw new Error(data.statusMessage || "Помилка при оновленні профілю");
    }

  } catch (err) {
    alert("Не вдалося оновити профіль");
  }
};

const handleVerifyProfile = async () => {
  if(store.userRole !== 'admin') return;
  try {
    const res = await fetch(`/api/photographers/verify/${route.params.id}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Помилка при верифікації профілю");
    const data = await res.json();
    if(data.status == 200) {
      photographer.value = data.photographer
      const response = await $fetch(`/api/photographers/rating/${route.params.id}`)
      const totalRating = await formTotalRating(response.rating)
      photographer.value = {
        ...photographer.value,
        totalRating
      };
    } else {
      throw new Error(data.message || "Помилка при верифікації профілю");
    }
  } catch (err) {
    alert(err.message);
  }
};

const handleDeverifyProfile = async () => {
  if(store.userRole !== 'admin') return;
  try {
    const res = await fetch(`/api/photographers/unverify/${route.params.id}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Помилка при деверифікації профілю");
    const data = await res.json();
    if(data.status == 200) {
      photographer.value = data.photographer
      const response = await $fetch(`/api/photographers/rating/${route.params.id}`)
      const totalRating = await formTotalRating(response.rating)
      photographer.value = {
        ...photographer.value,
        totalRating
      };
    } else {
      throw new Error(data.message || "Помилка при деверифікації профілю");
    }
  } catch (err) {
    alert(err.message);
  }
};

const formTotalRating = async (allRatings) => {
  try {
    const allRatingsCount = allRatings.length
    let allRatingsSum = 0;

    for(let i = 0; i < allRatingsCount; i++) {
      allRatingsSum += allRatings[i].rating
    }

    return allRatingsSum / allRatingsCount
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  
  try {
    const res = await fetch(`/api/photographers/${route.params.id}`);
    if (!res.ok) throw new Error("Фотограф не знайдений");
    const data = await res.json();
    photographer.value = data.photographer;

    editForm.value = {
      name: photographer.value.name,
      about: photographer.value.about,
      city: photographer.value.city,
      style: photographer.value.style,
      price: photographer.value.price,
    };

    isOwn.value = photographer.value.userId === store.userId;

    const response = await $fetch(`/api/photographers/rating/${route.params.id}`)
    const totalRating = await formTotalRating(response.rating)
    photographer.value = {
      ...photographer.value,
      totalRating
    };


    // const ratingRes = await fetch(
    //   `/api/rating?photographerId=${route.params.id}`
    // ); 
    // const ratingData = await ratingRes.json();

    // photographer.value = { ...data, reviews: ratingData };

    // const user = await fetch("/api/user");
    // const userData = await user.json();
    // userRole.value = userData?.role || "guest";
  } catch (err) {
    console.error(err);
  }

  onClickOutside(modalWindow, event => showBooking.value = false)
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>
