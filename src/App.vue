<template>
  <div>
    <div
      id="loading-screen"
      class="fixed inset-0 bg-black bg-opacity-30 min-h-full z-10 hidden"
    >
      <div
        class="m-auto b border-gray-300 h-40 w-40 animate-spin rounded-full border-x-8 border-t-blue-600"
      ></div>
    </div>
    <div class="p-5 min-h-svh">
      <router-view />
    </div>
  </div>
</template>
