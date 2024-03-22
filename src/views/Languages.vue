<template>
  <div class="relative p-1 pt-3">
    <Breadcrumb :paths="breadCrumbPaths" />

    <!-- Search bar and operations -->
    <div class="flex w-100">
      <input
        id="fileSearch"
        type="text"
        placeholder="&#128269; Search"
        v-model="searchText"
        class="fileSearch p-2 border text-neutral-900 dark:text-neutral-300 border-neutral-300 bg-neutral-50 text-xs dark:bg-neutral-800 dark:brightness-125 dark:border-neutral-600 dark:placeholder-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 mb-3 w-5/6"
      />
      <button
        class="w-1/6 bg-neutral-50 border-neutral-300 hover:brightness-95 text-neutral-600 dark:bg-neutral-800 dark:brightness-125 dark:hover:border-neutral-500 dark:border-neutral-600 dark:text-white border ms-1 h-[2.125rem] text-sm"
        @click="openFileModal('add')"
      >
        <fai icon="fa-plus" />
        <span class="hidden sm:inline ml-2">New File</span>
      </button>
    </div>

    <!-- Show loaded languages -->
    <div class="pb-20" v-if="filterredLanguages.length > 0">
      <table
        class="h-full w-full text-sm text-left rtl:text-right text-neutral-500 dark:text-neutral-400 table-auto table-sort"
      >
        <thead
          class="text-xs text-neutral-700 uppercase bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 cursor-pointer border-b-[.1rem] border-neutral-600"
        >
          <tr class="select-none">
            <th name="name" scope="col" class="px-6 py-3">Name</th>
            <th name="name" scope="col" class="px-6 py-3">Code</th>
            <th class="w-8"></th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            v-for="(language, l) in filterredLanguages"
            :key="l"
            class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <td
              scope="row"
              class="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white"
              v-text="language.name"
            ></td>
            <td scope="row" v-text="language.code" class="px-6 py-4"></td>
            <td
              @click="jQuery(`#row-menu-${l}`).toggleClass('hidden')"
              id="menu-td"
            >
              <fai
                icon="fa-bars"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                class="m-auto flex"
              />
              <div
                class="hidden row-menues absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
                :id="`row-menu-${l}`"
              >
                <div class="py-1" role="none">
                  <!-- Active: "bg-neutral-100 text-neutral-900", Not Active: "text-neutral-700" -->
                  <a
                    href="#"
                    class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-0"
                    >Edit</a
                  >
                  <a
                    href="#"
                    class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-0"
                    >Delete</a
                  >
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Show if no languages loaded -->
    <div
      v-if="filterredLanguages.length == 0"
      class="w-full text-sm text-center border-[.1rem] dark:border-neutral-700 min-h-32 dark:text-neutral-400 items-center justify-center grid"
    >
      Create a Language
    </div>

    <Modal
      :modalId="'languageModal'"
      :modalTitle="modal.modalTitle"
      :operation="modal.operation"
      :actionName="modal.actionName"
      :showCancel="modal.showCancel"
      :modalProcess="modalProcess"
    >
      <!-- Body -->
      <div>
        <div class="w-full px-3 mb-6">
          <label
            for="name"
            class="block mb-2 text-xs font-medium text-neutral-700 dark:text-white"
            ><span>Name</span><span class="text-danger"> *</span></label
          >
          <input
            type="text"
            id="name"
            autocomplete="off"
            v-model="language.name"
            class="bg-neutral-50 border border-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
            placeholder="English"
            required
          />
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            for="code"
            class="block mb-2 text-xs font-medium text-neutral-700 dark:text-white"
            ><span>Code</span><span class="text-danger"> *</span></label
          >
          <input
            type="text"
            id="code"
            autocomplete="off"
            v-model="language.code"
            class="bg-neutral-50 border border-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
            placeholder="EN"
            required
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import * as util from "@/utils";
import { useRoute } from "vue-router";
import { onMounted, watch, ref, Ref } from "vue";
import { useStore } from "vuex";
import { key } from "../store";
import Modal from "@/components/modals/Modal.vue";
import { clearDropDowns, showModal } from "@/utils";
import DropDown from "@/components/DropDown.vue";
import jQuery from "jquery";
import { Language } from "@/models/Language";

// Data
const store = useStore(key),
  route = useRoute(),
  user = store.state.auth.currentUser,
  workspace = store.state.workspace.defaultWorkspace;

let searchText = ref(""),
  modal = ref({
    modalTitle: "",
    operation: "",
    actionName: "",
    showCancel: true,
  }),
  breadCrumbPaths = ref([
    { name: "Languages", icon: "fa-language", url: "/languages" },
  ]),
  language = ref(Language.createEmptyObject()),
  languages = ref(store.state.language.languages),
  filterredLanguages = ref(languages); //Replace [] with loaded languages

// Methods
async function openFileModal(operation: string) {
  modal.value.operation = operation;
  switch (operation) {
    case "add":
      modal.value.modalTitle = "New Language";
      modal.value.actionName = "Save";
      modal.value.showCancel = true;
      break;
  }
  showModal("languageModal");
}

async function modalProcess() {
  let languageResponse = null;
  util.showLoadingScreen();
  switch (modal.value.operation) {
    case "add":
      language.value.workspace = workspace._id;
      language.value.createdOn = new Date();
      languageResponse = await store.dispatch(
        "language/addLanguage",
        language.value
      );
      if (languageResponse) {
        languages.value = languageResponse;
        filterredLanguages.value = languages.value;
      }
      break;
  }
  util.hideLoadingScreen();
  util.hideModal("languageModal");
}

async function loadData() {
  util.showLoadingScreen();
  const languageReponse = await store.dispatch(
    "language/loadLanguages",
    workspace._id
  );
  languages.value = languageReponse;
  filterredLanguages = ref(languages.value);
  util.hideLoadingScreen();
}

onMounted(async () => {
  await loadData();
});
</script>
