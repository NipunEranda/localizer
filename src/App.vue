<template>
  <div>
    <div
      id="loading-screen"
      class="fixed inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-40 min-h-full z-10 hidden"
    >
      <div
        class="m-auto b border-neutral-800 dark:border-neutral-300 h-20 w-20 animate-spin rounded-full border-x-8 absolute bottom-0 left-0 right-0 mb-32"
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
import "@/utils/uiTools";
import Cookies from "js-cookie";

const route = useRoute();
const store = useStore(key);

const user = ref(store.state.auth.currentUser);

let showHeader = ref(false);
let userTheme = ref(localStorage.getItem("userTheme"));

watch(route, async () => {
  if (
    !(route.name == "index" || route.name == "workspaces") &&
    Cookies.get("local._token")
  )
    showHeader.value = true;
  else showHeader.value = false;

  userTheme = ref(localStorage.getItem("userTheme"));
  if (!userTheme.value) localStorage.setItem("userTheme", "dark");
  if (userTheme.value == "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
});
</script>
