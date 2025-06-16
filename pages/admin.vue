<template>
  <div class="p-6 max-w-4xl mx-auto bg-neutral-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-white">Непідтверджені фотографи</h1>

    <p v-if="photographers.length === 0" class="text-neutral-400">
      Усі фотографи вже підтверджені ✅
    </p>

    <div
        v-for="photographer in photographers"
        :key="photographer.id"
        class="border border-neutral-700 bg-neutral-800 rounded-2xl p-5 mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow"
    >
      <div>
        <p class="font-semibold text-xl text-white mb-1">{{ photographer.name }}</p>
        <div class="mb-1 text-neutral-300 text-sm">
          <span class="block">Місто: {{ photographer.city || "не вказано" }}</span>
          <span class="block">Стиль: {{ photographer.style || "не вказано" }}</span>
          <span class="block">Про себе: {{ photographer.about || "—" }}</span>
          <span class="block">Досвід: {{ photographer.experience ? photographer.experience + " років" : "—" }}</span>
          <span class="block">Ціна: {{ photographer.price ? photographer.price + " грн" : "—" }}</span>
        </div>
        <div class="mb-1 text-neutral-400 text-sm">
          <span class="block">Email: {{ photographer.user?.email || "—" }}</span>
          <span class="block">Телефон: {{ photographer.user?.phone || "—" }}</span>
        </div>
      </div>

      <div class="flex gap-2">
        <button
            @click="verifyPhotographer(photographer.id)"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Підтвердити
        </button>
        <button
            @click="deletePhotographer(photographer.id)"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🗑️ Видалити
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const photographers = ref([]);

onMounted(async () => {
  const response = await $fetch("/api/photographers/get-unverified-photographers");
  photographers.value = response || [];
});

const deletePhotographer = async (id) => {
  await $fetch("/api/photographers/delete", {
    method: "POST",
    body: { id },
  });
  photographers.value = photographers.value.filter((p) => p.id !== id);
};

const verifyPhotographer = async (id) => {
  await $fetch("/api/photographers/verify-photographer", {
    method: "POST",
    body: { id },
  });
  photographers.value = photographers.value.filter((p) => p.id !== id);
};
</script>
