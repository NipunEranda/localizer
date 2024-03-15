<template>
  <div class="relative overflow-x-auto p-1 pt-3">
    <Breadcrumb :paths="breadCrumbPaths" />
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
      >
        <fai icon="fa-plus" />
        <span class="hidden sm:inline ml-2">New File</span>
      </button>
    </div>
    <table
      v-if="filterredFiles.length > 0"
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto table-sort"
    >
      <thead
        class="text-xs text-neutral-700 uppercase bg-gray-200 dark:bg-neutral-700 dark:text-neutral-400 cursor-pointer border-b-[.1rem] border-neutral-600"
      >
        <tr class="select-none">
          <th
            name="name"
            scope="col"
            class="px-6 py-3"
            @click="util.sort($event, ref(files))"
          >
            Name
          </th>
          <th
            name="branch"
            scope="col"
            class="px-6 py-3"
            @click="util.sort($event, ref(files))"
          >
            Branch
          </th>
          <th
            name="type"
            scope="col"
            class="px-6 py-3"
            @click="util.sort($event, ref(files))"
          >
            Type
          </th>
          <th
            name="owner"
            scope="col"
            class="px-6 py-3 text-right"
            @click="util.sort($event, ref(files))"
          >
            Owner
          </th>
          <th
            name="createdOn"
            scope="col"
            class="px-6 py-3 text-right"
            @click="util.sort($event, ref(files))"
          >
            Created On
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody class="">
        <tr
          v-for="(file, f) in filterredFiles"
          :key="f"
          class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          <td
            scope="row"
            class="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white"
            v-text="file.name"
          ></td>
          <td v-text="file.branch" class="px-6 py-4"></td>
          <td v-text="file.type" class="px-6 py-4 text-right"></td>
          <td v-text="file.owner.name" class="px-6 py-4 text-right"></td>
          <td v-text="file.createdOn" class="px-6 py-4 text-right"></td>
          <td
            @click="jQuery(`#row-menu-${r}`).toggleClass('hidden')"
            id="menu-td"
          >
            <fai
              icon="fa-bars"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            />
            <div
              class="hidden row-menues absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
              :id="`row-menu-${r}`"
            >
              <div class="py-1" role="none">
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                <a
                  href="#"
                  class="text-gray-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                  >Edit</a
                >
                <a
                  href="#"
                  class="text-gray-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
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
    <div
      v-if="filterredFiles.length == 0"
      class="w-full text-sm text-center border-[.1rem] dark:border-neutral-700 min-h-32 dark:text-neutral-400 items-center justify-center grid"
    >
      Create a file
    </div>
  </div>
</template>

<script setup>
// import { getIcon } from "@/utils";
import { useRoute } from "vue-router";
import { onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../store";

const store = useStore(key);
const route = useRoute();
let searchText = ref("");

// Get the repository info
const repository = ref(
  route.query.repo
    ? store.state.repository.repositories.filter(
        (r) => r.id == route.query.repo
      )[0]
    : null
);

const files = ref(
  route.query.repo
    ? store.state.file.files.filter((f) => f.repository == route.query.repo)
    : store.state.file.files
);

const breadCrumbPaths = [
  { name: "Repositories", icon: "fa-home", url: "/repositories" },
  {
    name: `Files${repository.value ? ` (${repository.value.name})` : ""}`,
    icon: "fa-file",
    url: `/files${route.query.repo ? `?repo=${route.query.repo}` : ""}`,
  },
];

let filterredFiles = ref(files);
</script>
