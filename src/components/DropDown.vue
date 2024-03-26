<template>
  <div class="mb-3 relative" ref="modalForm">
    <input
      type="text"
      autocomplete="off"
      id="dropDownInput"
      :name="id"
      v-model="searchText"
      class="flex bg-neutral-50 border border-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
      :class="{ 'cursor-not-allowed': disabled }"
      :disabled="disabled"
      @click="clickEvent()"
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
        <li v-if="loading" class="flex justify-center items-center p-2">
          <div
            class="loader inline-flex justify-center items-center text-neutral-900 dark:invert"
          ></div>
        </li>
        <li
          v-else
          v-for="(item, i) in itemList"
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
  // toRefs,
  defineProps,
  // defineEmits,
  defineExpose,
  onMounted,
  PropType,
  Ref,
  ref,
  watch,
} from "vue";

let searchText: Ref = ref("");
let selectedItem: Ref = ref(null);
let itemList: Ref = ref([]);
let previousSelection: Ref = ref(null);
const modalForm: Ref = ref(null);

const props = defineProps({
  id: String || Number,
  items: {
    type: Array as PropType<
      { name: string | number; value: number | string }[]
    >,
  },
  passedItem: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

watch(searchText, (newValue) => {
  if (newValue.trim() != "") {
    itemList.value = props.items?.filter(
      (i) =>
        i.name
          .toString()
          .toLowerCase()
          .includes(newValue.trim().toLowerCase()) ||
        i.value.toString().toLowerCase().includes(newValue.trim().toLowerCase())
    );
  } else itemList.value = props.items;
});

// const emit = defineEmits(["output"]);
defineExpose({
  emptySearchValue,
});

onMounted(() => {
  itemList.value = props.items;
  if (props.passedItem) {
    searchText.value = props.passedItem;
  }
  // searchText.value = props.passedItem
  //   ? store.state.repository.repositories.filter(
  //       (r) => r.id == props.passedItem
  //     )[0].name
  //   : "";
});

function clickEvent() {
  previousSelection.value = selectedItem.value;
  itemList.value = props.items;
  jQuery(`#inputDropDown-${props.id}`).toggleClass("hidden");
}

function emptySearchValue() {
  searchText.value = "";
}
</script>
