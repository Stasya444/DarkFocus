<template>
  <div class="min-h-screen bg-black py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <div v-if="reviews.length === 0" class="text-center text-white/60">
        Ще немає відгуків
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" v-else>
        <div
          v-for="review in reviews"
          :key="review.id"
          class="p-6 rounded-xl bg-white/10 text-white border border-white/10"
        >
          <div class="flex items-center gap-4 mb-4">
            <img
              :src="review.photographer?.avatar || placeholder"
              class="w-14 h-14 rounded-full object-cover"
              alt="аватар"
            />
            <div>
              <p class="font-semibold">
                {{ review.photographer?.name || "Анонімний фотограф" }}
              </p>
              <p class="text-sm text-white/60">
                {{ review.photographer?.specialty || "Фотограф" }}
              </p>
            </div>
          </div>
          <p class="italic mb-4">"{{ review.comment }}"</p>
          <div class="flex justify-between items-center text-sm text-white/50">
            <div>
              <span v-for="i in 5" :key="i">
                {{ i <= review.value ? "★" : "☆" }}
              </span>
            </div>
            <span>{{ formatDate(review.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const reviews = ref([]);
const placeholder = "https://via.placeholder.com/150/333333/FFFFFF?text=PH";

onMounted(async () => {
  const response = await $fetch("/api/rating");
  reviews.value = response || [];
});

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("uk-UA", options);
};
</script>
