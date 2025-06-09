<template>
  <section class="relative w-full h-auto md:h-[90vh] bg-black">
    <div class="flex flex-col md:grid md:grid-cols-2 h-full">
      <div class="hidden md:block relative h-full">
        <img
          src="/img/photo1.jpg"
          alt="Темна fashion фотографія"
          class="w-full h-full object-cover opacity-90"
        />
        <div class="absolute inset-0 bg-black/30"></div>
      </div>

      <div
        class="relative flex flex-col justify-center items-start text-white px-8 py-16 md:px-16 md:py-0 min-h-[90vh] md:h-full overflow-hidden"
      >
        <img
          src="/img/photo2.jpg"
          alt=""
          class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen pointer-events-none"
        />

        <h1 class="text-4xl md:text-5xl font-bold mb-6 relative z-10">
          Твоя історія через обʼєктив
        </h1>
        <p class="text-lg mb-8 max-w-md relative z-10">
          Поринь у світ fashion-фотографії, де кожен кадр — це витвір мистецтва.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
section {
  overflow: hidden;
}
</style>
