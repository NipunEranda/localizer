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
import jQuery from "jquery";

const route = useRoute();
const store = useStore(key);

const user = ref(store.state.auth.currentUser);

let showHeader = ref(false);
let userTheme = ref(localStorage.getItem("userTheme"));

watch(route, async () => {
  if (!(route.name == "index" || route.name == "workspaces") && user.value)
    showHeader.value = true;

  userTheme = ref(localStorage.getItem("userTheme"));
  if (!userTheme.value) localStorage.setItem("userTheme", "dark");
  if (userTheme.value == "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
});

// Hide menues after clicking outside
document.addEventListener("mouseup", function (event) {
  if (!event.target.id.includes("header-profile")) {
    jQuery(`#header-profile-menu`).removeClass("hidden").addClass("hidden");
  }

  if (
    !(
      event.target.id.includes("menu-button") ||
      event.target.id.includes("menu-td")
    )
  ) {
    if (!event.target.id.includes("menu-item")) {
      jQuery(".row-menues").map((id) =>
        jQuery(`#row-menu-${id}`).removeClass("hidden").addClass("hidden")
      );
    }
  }
});
</script>
