<template>
  <div>
    <div
      id="loading-screen"
      class="fixed inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-40 min-h-full z-10 hidden"
    >
      <div
        class="m-auto b border-gray-800 dark:border-gray-300 h-20 w-20 animate-spin rounded-full border-x-8 absolute bottom-0 left-0 right-0 mb-32"
      ></div>
    </div>
    <Header v-if="showHeader" />
    <div :class="{ 'pt-16 p-4': user }" class="dark:bg-neutral-800 min-h-svh">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { key } from "./store";

const route = useRoute();
const store = useStore(key);

const user = ref(store.state.auth.currentUser);

let showHeader = ref(true);

watch(route, async () => {
  if (route.path == "/" && !user.value) showHeader.value = false;
  else if (route.path == "/workspaces" && user.value) showHeader.value = false;
  else showHeader.value = true;
});
</script>
