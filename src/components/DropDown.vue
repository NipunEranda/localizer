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
      name="dropDownInput"
      class="flex bg-neutral-50 border border-neutral-300 text-gray-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
      @click="jQuery('#inputDropDown').toggleClass('hidden')"
    />

    <!-- Dropdown menu -->
    <div
      id="inputDropDown"
      name="inputDropDown"
      class="inputDropDown z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute w-full mt-2"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li>
          <a
            href="#"
            class="block px-4 py-2 bg-netral-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Dashboard</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 bg-netral-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Settings</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 bg-netral-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Earnings</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 bg-netral-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Sign out</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import jQuery from "jquery";
</script>
