<template>
  <div
    class="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl text-white shadow-xl p-6 transition duration-300 hover:shadow-2xl hover:scale-[1.015]"
  >
    <div class="flex items-center gap-4 mb-6">
      <img
        :src="photographer.avatar || placeholder"
        alt="Аватар"
        class="w-20 h-20 rounded-full object-cover border border-white/20 shadow-md transition duration-300"
      />
      <div>
        <h2 class="text-2xl font-bold">{{ photographer.name }}</h2>
        <p class="text-sm text-white/60">
          {{ photographer.city || "Місто не вказано" }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3 mb-5">
      <img
        v-for="photo in photographer.photos.slice(0, 3)"
        :key="photo.id"
        :src="photo.url"
        alt="Фото"
        class="w-full h-28 object-cover rounded-lg border border-white/10 hover:scale-105 transition-transform duration-300"
      />
    </div>

    <div class="flex flex-wrap justify-between text-sm text-white/70 mb-4">
      <span>📆 {{ differenceInYears(new Date(), new Date(photographer.createdAt)) || 0 }} років з нами</span>
      <span>📸 {{ photographer.bookings.length || 0 }} замовлень</span>
    </div>

    <p class="text-sm text-white/80 mb-5">
      {{ photographer.about || "Опис не вказано" }}
    </p>

    <div class="flex justify-between items-center mb-6">
      <span class="text-lg font-semibold text-white">
        {{ photographer.price }} ₴ / год
      </span>
      <NuxtLink
        :to="`/photographers/${photographer.id}`"
        class="text-sm underline hover:text-white/90 transition"
      >
        Перейти до профілю →
      </NuxtLink>
    </div>

    <div class="grid sm:grid-cols-3 gap-3 mb-4">
      <button
        class="bg-[#a8996e] hover:bg-[#8a7d56] text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.13.99.38 1.95.73 2.87a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.92.35 1.88.6 2.87.73A2 2 0 0 1 22 16.92z"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Дзвінок
      </button>
      <button
        class="bg-white text-[#595246] border border-[#a8996e] hover:bg-[#f7f5f0] py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 3C9.373 3 4 8.373 4 15c0 2.65.81 5.09 2.32 7.18L4 29l7.09-2.28C12.95 27.57 14.44 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3z"
            stroke="#25D366"
            stroke-width="2"
            fill="white"
          />
          <path
            d="M22.23 19.16c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.32-.78 1-.96 1.2-.18.2-.36.24-.67.08-.31-.16-1.3-.48-2.5-1.54-.92-.82-1.54-1.84-1.72-2.16-.18-.32-.02-.5.13-.65.13-.13.29-.34.44-.51.15-.17.2-.29.31-.48.1-.2.05-.37-.03-.52-.08-.16-.68-1.64-.93-2.24-.24-.56-.49-.48-.68-.49-.17-.01-.37-.01-.57-.01-.2 0-.53.08-.82.37-.29.29-1.08 1.06-1.08 2.58 0 1.51 1.09 2.97 1.24 3.18.15.21 2.13 3.24 5.17 4.41.72.25 1.29.4 1.73.52.72.19 1.38.16 1.9.1.58-.07 1.82-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.21-.58-.37z"
            fill="#25D366"
          />
        </svg>
        WhatsApp
      </button>
      <button
        class="bg-[#595246] hover:bg-[#3e3a2f] text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            d="M21.753 3.623a1.42 1.42 0 0 0-1.473-.167L3.744 10.433c-1.11.462-1.059 2.073.08 2.473l3.888 1.344c.354.122.657.395.777.752l1.366 3.924c.405 1.162 2.04 1.195 2.478.053l7.082-17.037a1.417 1.417 0 0 0-.462-1.316zm-5.774 5.447l-6.18 6.012"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Telegram
      </button>
    </div>
  </div>
</template>

<script setup>
import { differenceInYears } from 'date-fns';
const props = defineProps({
  photographer: {
    type: Object,
    required: true,
  },
});

const placeholder = "https://via.placeholder.com/80";
</script>
