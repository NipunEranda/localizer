<template>
  <div>
    <nav
      class="h-14 bg-white py-2 dark:bg-neutral-900 absolute left-0 right-0 border-b-[.1rem] border-neutral-200 dark:border-neutral-700 dark:border-opacity-80 z-10"
    >
      <div class="flex flex-wrap justify-between items-center mx-auto">
        <a href="/" class="flex items-center ml-4">
          <img :src="getIcon('logo')" class="mr-3 w-9" alt="Localizer Logo" />
          <span
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >Localizer</span
          >
        </a>
        <div class="flex items-center justify-center lg:order-2">
          <a
            href="#"
            class="text-neutral-800 dark:text-white font-medium rounded-lg text-sm ps-2 pe-2 hover:text-orange-600 dark:hover:text-orange-600"
            @click="toggleTheme"
            ><fai
              :icon="userTheme == 'light' ? 'fa-moon' : 'fa-sun'"
              class="size-6 justify-center items-center flex"
          /></a>
          <a
            href="#"
            class="text-neutral-800 dark:text-white font-medium rounded-lg text-sm ps-2 pe-2 hover:text-orange-600 dark:hover:text-orange-600"
            ><fai
              icon="fa-bell"
              class="size-6 justify-center items-center flex"
          /></a>
          <a
            id="header-profile"
            aria-expanded="true"
            aria-haspopup="true"
            href="#"
            class="text-white font-medium rounded-lg text-sm ps-2 pe-2 hidden lg:flex"
            ><img
              :src="user?.avatar_url"
              alt=""
              class="rounded-full w-7 hidden lg:flex"
              @click="jQuery(`#header-profile-menu`).toggleClass('hidden')"
            />
            <div
              class="hidden row-menues absolute right-0 z-10 mt-9 mr-5 w-56 origin-top-right rounded-md bg-white dark:bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
              id="header-profile-menu"
            >
              <div class="py-1" role="none">
                <a
                  href="#"
                  class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                  ><fai icon="fa-user" class="mr-2" />Profile</a
                >
                <a
                  href="#"
                  class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-1"
                  ><fai icon="fa-gear" class="mr-2" />Settings</a
                >
                <a
                  href="#"
                  class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-1"
                  @click="
                    store.dispatch('workspace/resetState', null);
                    $router.push('/workspaces');
                  "
                  ><fai icon="fa-network-wired" class="mr-2" />Switch
                  Workspace</a
                >
                <a
                  href="#"
                  class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-2"
                  @click="store.dispatch('logout')"
                  ><fai icon="fa-power-off" class="mr-2" />Logout</a
                >
              </div>
            </div>
          </a>
          <button
            name="mainMenuMobileButton"
            data-collapse-toggle="mobile-menu-2"
            type="button"
            class="mr-4 inline-flex items-center p-2 ml-1 text-sm text-neutral-500 rounded-lg lg:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
            @click="toggleMobileView(null, $event)"
          >
            <svg
              class="svg-inline--fa fa-bars text-2xl text-white"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="bars"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              name="mainMenuMobileButton"
            >
              <path
                name="mainMenuMobileButton"
                class=""
                fill="currentColor"
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
              ></path>
            </svg>
          </button>
        </div>
        <div
          class="justify-between items-center w-full hidden lg:flex lg:w-auto lg:order-1 dark:bg-neutral-900 mt-1 lg:m-0 p-4 lg:p-0"
          id="mobile-menu-2"
        >
          <ul
            class="flex flex-col font-medium lg:flex-row lg:space-x-8 lg:mt-0"
          >
            <li
              :class="{
                'bg-orange-600 bg-opacity-85 text-white p-2 pl-4 pr-4 rounded-xl':
                  activeTab == 'dashboard',
              }"
              class="hover:bg-orange-600 p-2 pl-4 pr-4 rounded-xl cursor-pointer text-black dark:text-white hover:text-white"
              @click="$router.push('/dashboard'), toggleMobileView('close')"
            >
              <a
                name="mainMenuItem"
                href="#"
                class="block py-2 pr-4 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0"
                aria-current="page"
                >Dashboard</a
              >
            </li>
            <li
              :class="{
                'bg-orange-600 bg-opacity-85 text-white  p-2 pl-4 pr-4 rounded-xl':
                  activeTab == 'repositories',
              }"
              class="hover:bg-orange-600 p-2 pl-4 pr-4 rounded-xl cursor-pointer text-black dark:text-white hover:text-white"
              @click="$router.push('/repositories'), toggleMobileView('close')"
            >
              <a
                name="mainMenuItem"
                href="#"
                class="block py-2 pr-4 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0"
                aria-current="page"
                >Repositories</a
              >
            </li>
            <li
              :class="{
                'bg-orange-600 bg-opacity-85 text-white  p-2 pl-4 pr-4 rounded-xl':
                  activeTab == 'files',
              }"
              class="hover:bg-orange-600 p-2 pl-4 pr-4 rounded-xl cursor-pointer text-black dark:text-white hover:text-white"
              @click="$router.push('/files'), toggleMobileView('close')"
            >
              <a
                name="mainMenuItem"
                href="#"
                class="block py-2 pr-4 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0"
                aria-current="page"
                >Files</a
              >
            </li>
            <li
              :class="{
                'bg-orange-600 bg-opacity-85 text-white  p-2 pl-4 pr-4 rounded-xl':
                  activeTab == 'languages',
              }"
              class="hover:bg-orange-600 p-2 pl-4 pr-4 rounded-xl cursor-pointer text-black dark:text-white hover:text-white"
              @click="$router.push('/languages'), toggleMobileView('close')"
            >
              <a
                name="mainMenuItem"
                href="#"
                class="block py-2 pr-4 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0"
                aria-current="page"
                >Languages</a
              >
            </li>
            <li
              :class="{
                'bg-orange-600 bg-opacity-85 text-white  p-2 pl-4 pr-4 rounded-xl':
                  activeTab == 'admin',
              }"
              class="hover:bg-orange-600 p-2 pl-4 pr-4 rounded-xl cursor-pointer text-black dark:text-white hover:text-white"
              @click="$router.push('/admin'), toggleMobileView('close')"
            >
              <a
                name="mainMenuItem"
                href="#"
                class="block py-2 pr-4 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0"
                aria-current="page"
                >Admin</a
              >
            </li>
            <li
              class="flex lg:hidden hover:bg-orange-600 p-2 pl-4 pr-4 rounded-xl cursor-pointer text-black dark:text-white hover:text-white"
              @click="store.dispatch('logout')"
            >
              <a
                name="mainMenuItem"
                href="#"
                class="block py-2 pr-4 pl-3 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0"
                aria-current="page"
                ><fai icon="fa-power-off" class="mr-2" />Logout</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { getIcon } from "@/utils";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { key } from "../store";
import jQuery from "jquery";

const store = useStore(key);
const route = useRoute();

const user = ref(store.state.auth.currentUser);

let userTheme = ref(localStorage.getItem("userTheme"));
let activeTab = ref(null);

watch(route, async () => {
  activeTab.value = route.name;
});

function toggleMobileView(override, event) {
  if (override == "close")
    jQuery("#mobile-menu-2").removeClass("hidden").addClass("hidden");
  else if (override == "open") jQuery("#mobile-menu-2").removeClass("hidden");
  else jQuery("#mobile-menu-2").toggleClass("hidden");
}

function toggleTheme() {
  if (userTheme.value == "dark") {
    userTheme.value = "light";
    document.documentElement.classList.remove("dark");
  } else {
    userTheme.value = "dark";
    document.documentElement.classList.add("dark");
  }
  localStorage.setItem("userTheme", userTheme.value);
}

onMounted(() => {
  activeTab.value = route.name;
});
</script>
