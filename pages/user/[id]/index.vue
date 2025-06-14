<template>
  <div
    v-if="!user"
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
        <!-- <p v-if="photographer" class="text-lg">{{ photographer.name }}</p>
        <p v-if="photographer" class="text-lg">Ціна: {{ photographer.price }} грн</p>
        <LazyNuxtLink v-if="user.role !== 'guest' && photographer" :to="'/photographers/'+photographer.id" class="text-gray-400 hover:text-white duration-200">Перейти до профілю фотографа</LazyNuxtLink>
        <button @click="isCreatingPhotographer = true" v-if="user.id == store.userId && store.userRole != 'guest' && !photographer" to="/" class="text-gray-400 hover:text-white duration-200">Створити профіль фотографа</button> -->
      </div>
    </div>
  </div>

  <div
    v-else
    class="min-h-screen bg-gradient-to-br from-black to-gray-900 p-10 flex items-center justify-center"
  >
    <div
      class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl max-w-4xl w-full"
    >
      <h1 class="text-3xl font-light text-white mb-4 text-center">
        {{ user.name }}
      </h1>

      <div class="flex justify-center mb-6">
        <img
          :src="user.avatar"
          :alt="user.name"
          class="w-36 h-36 rounded-full object-cover border-2 border-blue-500/30 shadow-lg grayscale"
        />
      </div>

      <div class="text-center space-y-2 text-white/80 mb-6 flex flex-col">
        <p class="text-lg">
          {{
            user.role == "guest"
              ? ""
              : user.role == "photographer"
              ? "Фотограф"
              : "Адміністратор"
          }}
        </p>
        <p v-if="photographer" class="text-lg">{{ photographer.name }}</p>
        <p v-if="photographer" class="text-lg">
          Ціна: {{ photographer.price }} грн
        </p>
        <LazyNuxtLink
          v-if="user.role !== 'guest' && photographer"
          :to="'/photographers/' + photographer.id"
          class="text-gray-400 hover:text-white duration-200"
          >Перейти до профілю фотографа</LazyNuxtLink
        >
        <button
          @click="isCreatingPhotographer = true"
          v-if="
            user.id == store.userId &&
            store.userRole != 'guest' &&
            !photographer
          "
          to="/"
          class="text-gray-400 hover:text-white duration-200"
        >
          Створити профіль фотографа
        </button>
      </div>
    </div>

    <div
      ref="modalWindow"
      class="w-full overflow-hidden max-w-160 h-fit rounded-2xl bg-neutral-500/60 backdrop-blur-md absolute"
      v-if="user.id == store.userId && !photographer && isCreatingPhotographer"
    >
      <AddPhotographerForm :userId="user.id" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, useTemplateRef } from "vue";
import { useUserStore } from "../../../stores/user";
import AddPhotographerForm from "../../../components/AddPhotographerForm.vue";
import { onClickOutside } from "@vueuse/core";

const route = useRoute();
const user = ref(null);
const store = useUserStore();
const photographer = ref(null);
const isCreatingPhotographer = ref(false);
const modalWindow = useTemplateRef("modalWindow");

onMounted(async () => {
  try {
    const res = await fetch(`/api/getuser/${route.params.id}`);
    if (!res.ok) throw new Error("Користувач не знайдений");
    const data = await res.json();
    user.value = data.user;
    const response = await fetch(
      `/api/photographers/byuser/${route.params.id}`
    );
    if (!response.ok) throw new Error("Профіль фотографа не знайдено");
    const d = await response.json();
    if (d.photographer) photographer.value = d.photographer;
    else photographer.value = null;
  } catch (err) {
    console.error(err);
  }

  onClickOutside(
    modalWindow,
    (event) => (isCreatingPhotographer.value = false)
  );
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>
