<template>
  <div>
    <div
      :id="props.modalId + '-modalOverlay'"
      class="relative hidden"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-neutral-50 dark:bg-neutral-700 bg-opacity-30 dark:bg-opacity-60"
      ></div>
      <div class="fixed inset-0 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            :id="props.modalId"
            class="relative overflow-hidden rounded-lg text-left w-full sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-6/12 shadow-md shadow-neutral-500 dark:shadow-neutral-950"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between p-4 md:p-5 bg-neutral-300 bg-opacity-50 dark:bg-neutral-800 border-b-2 border-neutral-200 dark:border-neutral-700"
            >
              <h3
                class="text-xl font-semibold text-neutral-900 dark:text-white"
                v-text="props.modalTitle"
              ></h3>
              <button
                @click="util.hideModal(props.modalId)"
                type="button"
                class="text-neutral-900 dark:text-neutral-50 bg-transparent rounded-lg text-lg w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 dark:bg-neutral-700"
                data-modal-hide="default-modal"
              >
                &times;
              </button>
            </div>
            <!-- Header -->

            <!-- Body -->
            <div class="bg-neutral-50 dark:bg-neutral-800 p-5">
              <slot />
            </div>
            <!-- Body -->

            <!-- Footer -->
            <div
              class="border-t-2 bg-neutral-300 bg-opacity-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
              <button
                @click="props.modalProcess()"
                type="button"
                v-text="props.actionName"
                v-if="props.modalProcess"
                :class="{
                  'ring-danger bg-danger hover:bg-danger-hover':
                    operation == 'delete',
                  'ring-primary bg-primary hover:bg-primary-hover':
                    operation == 'add',
                  'ring-success bg-success hover:bg-success-hover':
                    operation == 'update',
                }"
                class="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ml-2"
              ></button>
              <button
                v-if="props.showCancel"
                @click="util.hideModal(props.modalId)"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-secondary hover:bg-secondary-hover px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-secondary-hover sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
            <!-- Footer -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as util from "@/utils";
import { /*toRefs,*/ defineProps } from "vue";

const props = defineProps({
  modalId: String,
  modalTitle: String,
  operation: String,
  modalProcess: Function,
  actionName: String,
  showCancel: {
    default: false,
    type: Boolean,
  },
});
</script>
