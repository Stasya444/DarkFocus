<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Непідтверджені фотографи</h1>

    <p v-if="photographers.length === 0" class="text-gray-500">
      Усі фотографи вже підтверджені ✅
    </p>

    <div
      v-for="photographer in photographers"
      :key="photographer.id"
      class="border rounded p-4 mb-4 flex justify-between items-center"
    >
      <div>
        <p class="font-semibold text-lg">{{ photographer.name }}</p>
        <p class="text-sm text-gray-500">
          {{ photographer.city || "Місто не вказано" }}
        </p>
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
  const response = await $fetch(
    "/api/photographers/get-unverified-photographers"
  );
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

  // Видаляємо фотографа зі списку після підтвердження
  photographers.value = photographers.value.filter((p) => p.id !== id);
};
</script>
