<template>
  <div class="min-h-screen bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Заголовок -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">Замовлення</h1>
        <p class="mt-2 text-lg text-gray-400">
          Список клієнтів, які замовили послуги
        </p>
      </div>

      <div
        v-if="!bookings?.length"
        class="text-center py-12 bg-neutral-800 rounded-xl"
      >
        <p class="text-gray-400 text-lg">Поки що немає замовлень</p>
      </div>

      <div v-if="store && store.userRole !== 'guest'" class="space-y-4">
        <div
          v-for="order in bookings"
          :key="order.id"
          class="bg-neutral-800 overflow-hidden rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200"
        >
          <div class="px-6 py-5 sm:p-6">
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            >
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-400 mb-2">ЗАМОВНИК</h3>
                <div class="flex items-center space-x-3">
                  <div
                    class="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center"
                  >
                    <span class="text-gray-300 font-medium">{{
                      order.name.charAt(0)
                    }}</span>
                  </div>
                  <div>
                    <LazyNuxtLink
                      :to="'/user/' + order.userId"
                      class="text-lg font-medium text-white hover:text-indigo-400 transition-colors"
                    >
                      {{ order.name }}
                    </LazyNuxtLink>
                    <p class="text-sm text-gray-400">
                      Номер телефону: {{ order.phone }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="sm:text-right">
                <h3 class="text-sm font-medium text-gray-400 mb-2">
                  ДАТА ТА ЧАС
                </h3>
                <div class="text-base text-white font-medium">
                  {{
                    new Date(order.date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                </div>
                <div class="text-sm text-gray-400">
                  на
                  {{
                    new Date(order.date).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "../stores/user";

const bookings = ref(null);
const store = useUserStore();

onMounted(async () => {
  try {
    const response = await $fetch("/api/photographers/orders/" + store.userId);
    bookings.value = response.booking;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
});
</script>
