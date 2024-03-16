<template>
  <!-- <button
    id="dropdownDefaultButton"
    data-dropdown-toggle="dropdown"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-neutral-700 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    type="button"
    @click="jQuery('#inputDropDown').toggleClass('hidden')"
  >
    Dropdown button
    <svg
      class="w-2.5 h-2.5 ms-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m1 1 4 4 4-4"
      />
    </svg>
  </button> -->
  <div class="mb-3 relative">
    <input
      type="text"
      autocomplete="off"
      id="dropDownInput"
      name="dropDownInput"
      v-model="searchText"
      class="flex bg-neutral-50 border border-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
      :class="{ 'cursor-not-allowed': passedItem }"
      :disabled="!(passedItem == null || passedItem == 0)"
      @click="jQuery(`#inputDropDown-${id}`).toggleClass('hidden')"
      placeholder="Search and select an item"
    />

    <!-- Dropdown menu -->
    <div
      :id="`inputDropDown-${id}`"
      name="inputDropDown"
      class="inputDropDown z-10 hidden bg-white divide-y divide-neutral-100 rounded-lg shadow dark:bg-neutral-800 dark:brightness-150 absolute w-full mt-2 max-h-40 overflow-auto"
    >
      <ul
        class="py-2 text-sm text-neutral-700 dark:text-neutral-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li
          v-for="(item, i) in items"
          :key="i"
          @click="
            selectedItem = item;
            searchText = item.name;
            $emit('output', selectedItem);
          "
        >
          <a
            href="#"
            class="block px-4 py-2 bg-netral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-white"
            >{{ item.name }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "@/store";
import jQuery from "jquery";
import {
  /*toRefs,*/ defineProps,
  defineEmits,
  onMounted,
  PropType,
  Ref,
  ref,
} from "vue";

let searchText: Ref = ref("");
let selectedItem: Ref = ref(null);

const props = defineProps({
  id: String || Number,
  items: {
    type: Array as PropType<
      { name: string | number; value: number | string }[]
    >,
  },
  passedItem: {
    type: Number || String,
    default: 0 || null,
  },
});

const emits = defineEmits(["output"]);

onMounted(() => {
  searchText.value = props.passedItem
    ? store.state.repository.repositories.filter(
        (r) => r.id == props.passedItem
      )[0].name
    : "";
});
</script>
