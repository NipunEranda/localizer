<template>
  <!-- Breadcrumb -->
  <nav
    class="flex px-5 py-3 text-neutral-700 border border-neutral-200 rounded-lg bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-700 mb-5"
    aria-label="Breadcrumb"
  >
    <ol
      class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"
    >
      <li class="inline-flex items-center" v-for="(path, p) in paths" :key="p">
        <a
          href="#"
          @click="path.url ? $router.push(path.url) : null"
          class="inline-flex items-center text-sm font-medium text-neutral-700 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
        >
          <span class="mr-2">
            <fai :icon="path.icon" class="mr-2" /> {{ path.name }}</span
          >
          <fai icon="fa-chevron-right" v-if="p != paths.length - 1" />
        </a>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import * as util from "@/utils";
import { /*toRefs,*/ defineProps, onMounted } from "vue";

const props = defineProps({
  paths: Array,
});

onMounted(() => {
  console.log(props.paths);
});
</script>
