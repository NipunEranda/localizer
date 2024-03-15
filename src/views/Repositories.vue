<template>
  <div class="relative overflow-x-auto p-1 pt-3">
    <Breadcrumb :paths="breadCrumbPaths" />
    <input
      id="customerSearch"
      type="text"
      placeholder="&#128269; Search"
      v-model="searchText"
      class="customerSearch p-2 border text-neutral-900 dark:text-neutral-300 border-neutral-300 bg-neutral-50 text-xs dark:bg-neutral-800 dark:brightness-125 dark:border-neutral-600 dark:placeholder-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 w-full mb-3"
    />
    <table
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
            @click="util.sort($event, ref(repositories))"
          >
            Name
          </th>
          <th
            name="description"
            scope="col"
            class="px-6 py-3"
            @click="util.sort($event, ref(repositories))"
          >
            Description
          </th>
          <th
            name="ownerLogin"
            scope="col"
            class="px-6 py-3 text-right"
            @click="util.sort($event, ref(repositories))"
          >
            Owner
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody class="">
        <tr
          v-for="(repo, r) in filterredRepositories"
          :key="r"
          class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
          @dblclick="$router.push(`/files?repo=${repo.id}`)"
        >
          <td
            scope="row"
            class="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white"
          >
            <fai :icon="repo.private ? 'fa-lock' : 'fa-globe'" />
            <span v-text="repo.name" class="ms-2"></span>
          </td>
          <td v-text="repo.description" class="px-6 py-4"></td>
          <td v-text="repo.owner.login" class="px-6 py-4 text-right"></td>
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
                  >Open Repository</a
                >
                <a
                  href="#"
                  class="text-gray-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                  >Show Files</a
                >
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { key } from "@/store";
import { hideLoadingScreen, showLoadingScreen } from "@/utils";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import * as util from "@/utils";
import jQuery from "jquery";

const store = useStore(key);
const repositories = ref(store.state.repository.repositories);
let filterredRepositories = ref(repositories);
let searchText = ref("");
const breadCrumbPaths = [
  { name: "Repositories", icon: "fa-home", url: "/repositories" },
];

watch(searchText, (newValue) => {
  if (newValue.trim() != "") {
    filterredRepositories = ref(
      repositories.value.filter(
        (r) =>
          r.name.toLowerCase().includes(newValue.toLowerCase()) ||
          r.description?.toLowerCase().includes(newValue.toLowerCase()) ||
          r.ownerLogin?.toLowerCase().includes(newValue.toLowerCase())
      )
    );
  } else
    filterredRepositories = ref(jQuery.extend(true, [], repositories.value));
});

onMounted(async () => {
  showLoadingScreen();
  repositories.value = await store.dispatch("repository/loadRepositories");
  repositories.value.sort((a, b) => a.name.localeCompare(b.name));
  filterredRepositories = ref(repositories);
  hideLoadingScreen();
});
</script>
