<template>
  <div
    :id="modalId"
    class="relative z-10 hidden"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-neutral-950 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg text-left transition-all w-full sm:max-w-lg"
        >
          <div
            class="text-black bg-white dark:bg-neutral-800 dark:text-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
          >
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="text-base font-semibold leading-6"
                  id="modal-title"
                  v-text="modalTitle"
                ></h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500" v-text="modalContent"></p>
                </div>
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div
            class="bg-gray-50 dark:bg-neutral-800 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6"
          >
            <button
              v-text="processText"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
              @click="modalProcess"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { /*toRefs,*/ defineProps } from "vue";

const props = defineProps({
  modalTitlealert: String,
  modalContent: String,
  modalId: String,
  modalProcess: Function,
  processText: String,
});

console.log(props);
</script>
