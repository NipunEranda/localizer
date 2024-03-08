<template>
  <div>
    <div
      id="alert"
      class="mt-8 alert p-4 mb-4 absolute w-full cursor-pointer z-10 bottom-0 sm:bottom-auto sm:w-full sm:max-w-md sm:right-0 sm:me-3 rounded-lg bg-opacity-90"
      :class="{
        'bg-danger text-white': alert.type == 'error',
        'bg-success text-white': alert.type == 'success',
        'bg-warning text-white': alert.type == 'warning',
        'bg-info text-white': alert.type == 'info',
        hidden: !alert.type,
      }"
      @click="closeAlert()"
      role="alert"
    >
      <div class="text-sm font-medium w-full">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10"
          >
            <img
              v-if="alert.type == 'error' || alert.type == 'warning'"
              :src="util.icons.getIcon('triangleExclamation')"
              alt=""
              class="w-16 flex m-auto ml-0 mr-2 pl-4 dark:invert"
            />
            <img
              v-if="alert.type == 'success'"
              :src="util.icons.getIcon('checkCircle')"
              alt=""
              class="w-16 flex m-auto ml-0 mr-2 pl-4 dark:invert"
            />
            <img
              v-if="alert.type == 'info'"
              :src="util.icons.getIcon('circleExclamation')"
              alt=""
              class="w-16 flex m-auto ml-0 mr-2 pl-4 dark:invert"
            />
            <!-- <font-awesome-icon
              v-if="alert.type == 'error' || alert.type == 'warning'"
              icon="fas fa-triangle-exclamation"
              class="m-auto ml-0 mr-2 pl-4 h-7"
            />
            <font-awesome-icon
              v-if="alert.type == 'success'"
              icon="fas fa-check-circle"
              class="m-auto ml-0 mr-2 pl-4 h-7"
            />
            <font-awesome-icon
              v-if="alert.type == 'info'"
              icon="fas fa-circle-exclamation"
              class="m-auto ml-0 mr-2 pl-4 h-7"
            /> -->
          </div>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3
              class="text-base font-semibold leading-6"
              v-text="alert.title"
            ></h3>
            <div class="mt-2">
              <p class="text-sm" v-text="alert.text"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as utilImport from "@/utils";
import { /*toRefs,*/ defineProps } from "vue";

const util = utilImport;

const alert = defineProps({ alert: Object });

function closeAlert() {
  // eslint-disable-next-line no-undef
  $("#alert").addClass("hidden");
}

// export default {
//   setup: () => {},
//   data() {
//     return {
//       util: util,
//     };
//   },
//   props: {
//     alert: Object,
//   },
//   methods: {
//     closeAlert() {
//       // eslint-disable-next-line no-undef
//       $("#alert").addClass("hidden");
//     },
//   },
// };
</script>
