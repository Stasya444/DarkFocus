<template>
  <div class="max-w-7xl mx-auto px-6 py-10 text-white">
    <!-- Фільтри -->
    <div
      class="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mb-10 shadow-md"
    >
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          v-model="search"
          placeholder="Пошук по імені або місту"
          class="px-4 py-2 rounded text-sm bg-white/10 border border-white/20 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        />

        <select
          v-model="styleFilter"
          class="px-4 py-2 rounded text-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Будь-який стиль</option>
          <option value="Wedding">Wedding</option>
          <option value="Portrait">Portrait</option>
          <option value="Family">Family</option>
          <option value="Fashion">Fashion</option>
          <option value="Street">Street</option>
          <option value="Studio">Studio</option>
          <option value="Nature">Nature</option>
          <option value="Reportage">Reportage</option>
          <option value="Newborn">Newborn</option>
          <option value="Travel">Travel</option>
          <option value="Artistic">Artistic</option>
          <option value="Event">Event</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select
          v-model="minExperience"
          class="px-4 py-2 rounded text-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option :value="0">Будь-який досвід</option>
          <option :value="1">1+ рік</option>
          <option :value="3">3+ роки</option>
          <option :value="5">5+ років</option>
          <option :value="10">10+ років</option>
        </select>

        <select
          v-model="minOrders"
          class="px-4 py-2 rounded text-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option :value="0">Час замовлень</option>
          <option :value="10">3+</option>
          <option :value="30">5+</option>
          <option :value="50">10+</option>
        </select>

        <select
          v-model="sort"
          class="px-4 py-2 rounded text-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Без сортування</option>
          <option value="rating">За рейтингом</option>
          <option value="price">За ціною</option>
        </select>
      </div>
    </div>

    <!-- Завантаження -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-600 dark:text-gray-300">Завантаження фотографів...</p>
    </div>

    <!-- Нічого не знайдено -->
    <div v-else-if="!filteredPhotographers.length" class="text-center py-10">
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Фотографів не знайдено
      </p>
      <p
        v-if="search || styleFilter || minExperience || minOrders"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        Спробуйте змінити параметри пошуку
      </p>
    </div>

    <!-- Список фотографів -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      <PhotographerCard
        v-for="photographer in filteredPhotographers"
        :key="photographer.id"
        :photographer="photographer"
      />
    </div>
  </div>
</template>

<style scoped>
option {
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
}
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import PhotographerCard from "~/components/PhotographerCard.vue";

const photographers = ref([]);
const search = ref("");
const sort = ref("");
const styleFilter = ref("");
const minExperience = ref(0);
const minOrders = ref(0);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("/api/photographers");
    const data = await res.json();
    photographers.value = data;
  } catch (err) {
    console.error("Помилка:", err);
    error.value = "Не вдалося завантажити фотографів";
  } finally {
    loading.value = false;
  }
});

const getAvgRating = (ratings) => {
  if (!ratings?.length) return 0;
  return ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
};

const filteredPhotographers = computed(() => {
  let result = [...photographers.value];

  if (search.value) {
    const term = search.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.city?.toLowerCase().includes(term)
    );
  }

  if (styleFilter.value) {
    result = result.filter(
      (p) => p.style?.toLowerCase() === styleFilter.value.toLowerCase()
    );
  }

  if (minExperience.value) {
    result = result.filter((p) => (p.experience || 0) >= minExperience.value);
  }

  if (minOrders.value) {
    result = result.filter((p) => (p.ordersCount || 0) >= minOrders.value);
  }

  if (sort.value === "rating") {
    result.sort((a, b) => getAvgRating(b.ratings) - getAvgRating(a.ratings));
  } else if (sort.value === "price") {
    result.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
  }

  return result;
});
</script>
