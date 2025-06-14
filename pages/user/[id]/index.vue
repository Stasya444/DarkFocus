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

        <div
          class="flex mx-auto w-fit gap-2"
          v-if="
            user.id === store.userId &&
            (store.userRole === 'admin' || store.userRole === 'photographer')
          "
        >
          <!-- Редагування -->
          <button
            v-if="!isEditing"
            @click="handleEditProfile"
            class="px-6 py-2 flex mb-5 text-white bg-gray-600/30 hover:bg-gray-600/50 rounded-full border border-gray-400/40 shadow-lg transition"
          >
            Редагувати
          </button>

          <button
            v-if="isEditing"
            @click="handleUpdateProfile"
            class="px-6 py-2 flex mb-5 text-white bg-blue-300/30 hover:bg-blue-300/50 rounded-full border border-blue-300/40 shadow-lg transition"
          >
            Зберегти
          </button>
          <button
            v-if="isEditing"
            @click="handleEditProfile"
            class="px-6 py-2 flex mb-5 text-white bg-neutral-300/30 hover:bg-neutral-300/50 rounded-full border border-neutral-300/40 shadow-lg transition"
          >
            Відмінити
          </button>
        </div>

        <button
          v-if="
            store.userRole === 'photographer' &&
            user.id === store.userId &&
            !photographer
          "
          @click="isCreatingPhotographer = true"
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
const isEditing = ref(false);
const modalWindow = useTemplateRef("modalWindow");
const errorMessage = ref(null);

const editForm = ref({
  name: "",
  about: "",
  city: "",
  style: "",
  price: null,
  avatar: null,
  avatarPreview: null,
});

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = "Непідтримуваний тип файлу";
    return;
  }
  if (file.size > maxSize) {
    errorMessage.value = "Файл занадто великий";
    return;
  }

  editForm.value.avatar = file;
  editForm.value.avatarPreview = URL.createObjectURL(file);
};

const handleEditProfile = () => {
  if (isEditing.value) {
    if (editForm.value.avatarPreview) {
      URL.revokeObjectURL(editForm.value.avatarPreview);
      editForm.value.avatarPreview = null;
      editForm.value.avatar = null;
    }
  } else {
    editForm.value = {
      name: photographer.value.name || "",
      about: photographer.value.about || "",
      city: photographer.value.city || "",
      style: photographer.value.style || "",
      price: photographer.value.price || null,
      avatar: null,
      avatarPreview: null,
    };
  }
  isEditing.value = !isEditing.value;
};

const handleUpdateProfile = async () => {
  try {
    errorMessage.value = null;
    const formData = new FormData();

    formData.append("name", editForm.value.name);
    formData.append("about", editForm.value.about);
    formData.append("city", editForm.value.city);
    formData.append("style", editForm.value.style);
    formData.append("price", editForm.value.price);

    if (editForm.value.avatar) {
      formData.append("avatar", editForm.value.avatar);
    }

    const res = await fetch(`/api/photographers/edit/${route.params.id}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.photographer) throw new Error("Помилка при оновленні профілю");

    photographer.value = data.photographer;
    isEditing.value = false;

    if (editForm.value.avatarPreview) {
      URL.revokeObjectURL(editForm.value.avatarPreview);
      editForm.value.avatar = null;
      editForm.value.avatarPreview = null;
    }
  } catch (err) {
    errorMessage.value = err.message || "Не вдалося оновити профіль";
  }
};

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
    if (d.photographer) {
      photographer.value = d.photographer;
      editForm.value = {
        name: d.photographer.name || "",
        about: d.photographer.about || "",
        city: d.photographer.city || "",
        style: d.photographer.style || "",
        price: d.photographer.price || null,
        avatar: null,
        avatarPreview: null,
      };
    } else {
      photographer.value = null;
    }
  } catch (err) {
    console.error(err);
  }

  onClickOutside(modalWindow, () => (isCreatingPhotographer.value = false));
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>
