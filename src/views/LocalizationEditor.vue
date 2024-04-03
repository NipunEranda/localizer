<template>
  <div class="pb-20 relative p-1 pt-3">
    <template v-if="filterredGithubContent">
      <div v-if="filterredGithubContent.length > 0">
        <Breadcrumb :paths="breadCrumbPaths" />
        <div class="w-100 flex">
          <input
            id="fileSearch"
            type="text"
            placeholder="&#128269; Search"
            v-model="searchText"
            class="fileSearch p-2 border text-neutral-900 dark:text-neutral-300 border-neutral-300 bg-neutral-50 text-xs dark:bg-neutral-800 dark:brightness-125 dark:border-neutral-600 dark:placeholder-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 mb-3 w-4/6"
          />
          <div class="w-2/6 flex">
            <button
              class="w-1/3 text-center bg-neutral-50 border-neutral-300 hover:brightness-95 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-primary dark:brightness-125 dark:hover:border-blue-400 dark:border-neutral-600 dark:text-white border ms-1 h-[2.125rem] text-sm"
              @click="saveFile()"
            >
              <fai icon="fa-save" />
              <span class="ms-1 lg:ms-2 hidden md:inline">Save</span>
            </button>
            <button
              class="w-1/3 text-center bg-neutral-50 border-neutral-300 hover:brightness-95 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-success dark:brightness-125 dark:hover:border-green-400 dark:border-neutral-600 dark:text-white border ms-1 h-[2.125rem] text-sm"
            >
              <fai icon="fa-file-import" />
              <span class="ms-1 lg:ms-2 hidden md:inline">Import</span>
            </button>
            <button
              class="w-1/3 text-center bg-neutral-50 border-neutral-300 hover:brightness-95 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-secondary dark:brightness-125 dark:hover:border-neutral-400 dark:border-neutral-600 dark:text-white border ms-1 h-[2.125rem] text-sm"
            >
              <fai icon="fa-file-export" />
              <span class="ms-1 lg:ms-2 hidden md:inline">Export</span>
            </button>
          </div>
        </div>
        <table
          class="h-full w-full text-sm text-left rtl:text-right text-neutral-500 dark:text-neutral-400 table-auto table-sort"
        >
          <thead
            class="text-xs text-neutral-700 uppercase bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 cursor-pointer border-b-[.1rem] border-neutral-600"
          >
            <tr class="select-none">
              <th
                name="name"
                scope="col"
                class="px-3 py-3"
                @click="
                  //@ts-ignore
                  util.sort($event, ref(githubContent))
                "
              >
                Key
              </th>
              <th
                name="name"
                scope="col"
                class="px-3 py-3"
                @click="
                  //@ts-ignore
                  util.sort($event, ref(githubContent))
                "
              >
                Value
              </th>
              <th
                name="name"
                scope="col"
                class="px-3"
                @click="
                  //@ts-ignore
                  util.sort($event, ref(githubContent))
                "
              >
                Translation
              </th>
              <th class="w-8"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(line, l) in filterredGithubContent"
              :key="l"
              class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              :class="{
                'opacity-50 cursor-not-allowed select-none': line.removed,
                'cursor-pointer': !line.removed,
              }"
            >
              <td class="pl-3">
                {{ line.name }}
                <fai
                  v-if="line.new || line.removed"
                  icon="fa-circle-info"
                  class="ms-1"
                  :class="{
                    'text-white': !line.removed,
                    'text-red-500': line.removed,
                  }"
                />
              </td>
              <td class="pl-3">{{ line.value }}</td>
              <td class="pt-2 pb-2 pl-3 pr-2">
                <input
                  type="text"
                  name="value"
                  id="value"
                  v-model="line.translation.value"
                  class="bg-neutral-50 border border-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 w-100"
                  :class="{ 'cursor-not-allowed select-none': line.removed }"
                  :disabled="line.removed"
                />
              </td>
              <td
                @click="jQuery(`#row-menu-${l}`).toggleClass('hidden')"
                id="menu-td"
              >
                <fai icon="fa-bars" class="m-auto flex" id="menu-button" />
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
                      @click="
                        translate(l, line.name, line.value, file.from, file.to)
                      "
                      >Translate</a
                    >
                    <a
                      href="#"
                      class="text-neutral-700 dark:text-white dark:bg-neutral-700 dark:hover:bg-neutral-600 block px-4 py-2 text-sm"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-0"
                      @click="openHistoryModal(line)"
                      >History</a
                    >
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <Modal
      :modalId="'lineHistoryModal'"
      :modalTitle="modal.modalTitle"
      :operation="modal.operation"
      :actionName="modal.actionName"
      :showCancel="modal.showCancel"
      :modalProcess="hideHistoryModal"
    >
      <table
        class="h-full w-full text-sm text-left rtl:text-right text-neutral-500 dark:text-neutral-400 table-auto table-sort"
        v-if="lineHistoryObject"
      >
        <thead
          class="text-xs text-neutral-700 uppercase bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 cursor-pointer border-b-[.1rem] border-neutral-600"
        >
          <tr>
            <th scope="col" class="px-3 py-3">Translation</th>
            <th scope="col" class="px-3 py-3 text-right">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(translation, t) in lineHistoryObject.history"
            :key="t"
            class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <td class="px-3 py-3">
              {{ translation.value }}
            </td>
            <td class="px-3 py-3 text-right">
              {{ translation.createdAt }}
            </td>
          </tr>
        </tbody>
      </table>
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
import { File, _File, _FileLine } from "@/models/File";
import DropDown from "@/components/DropDown.vue";
import jQuery from "jquery";
import { Repository, _Repository } from "@/models/Repository";
import axios from "axios";

const store = useStore(key),
  route = useRoute();

let githubContent: Ref<_FileLine[]> = ref([]);
let filterredGithubContent: Ref<_FileLine[]> = ref(githubContent),
  searchText: Ref<string> = ref(""),
  modal: Ref<{
    modalTitle: string;
    operation: string;
    actionName: string;
    showCancel: boolean;
  }> = ref({
    modalTitle: "",
    operation: "",
    actionName: "",
    showCancel: true,
  }),
  lineHistoryObject: Ref<_FileLine>,
  file: Ref<_File> = ref(
    File.createEmptyObject(
      store.state.auth.currentUser._id,
      store.state.workspace.defaultWorkspace._id
    )
  ),
  repository: Ref<_Repository> = ref(Repository.createEmptyObject()),
  breadCrumbPaths: Ref<{ name: string; icon: string; url: string }[]> = ref([]);

async function loadData() {
  util.showLoadingScreen();
  await store.dispatch(
    "language/loadLanguages",
    store.state.workspace.defaultWorkspace._id
  );
  await store.dispatch("repository/loadRepositories");
  await store.dispatch("file/loadFiles");

  file.value = store.state.file.files.filter(
    (f) => f._id == route.query.file
  )[0];
  repository.value = store.state.repository.repositories.filter(
    (r) => r.id == file.value.repository
  )[0];

  breadCrumbPaths.value = [
    {
      name: `Files${
        repository.value.name ? ` (${repository.value.name})` : ""
      }`,
      icon: "fa-folder-open",
      url: `/files${
        file.value.repository ? `?repo=${file.value.repository}` : ""
      }`,
    },
    {
      name: file.value.name,
      icon: "fa-file",
      url: `/editor?file=${file.value._id}`,
    },
  ];

  githubContent.value = await store.dispatch(
    "file/loadGithubContent",
    file.value
  );

  // Merge save file lines to githubContent and mark removed lines
  file.value.lines.map((line, l) => {
    if (
      !githubContent.value.filter(
        (gcl) => gcl.name == line.name && gcl.value == line.value
      )[0]
    ) {
      line.removed = true;
      githubContent.value.push(line);
    }
  });

  // Mark new lines
  githubContent.value.map((line, l) => {
    if (
      file.value.lines.filter(
        (fl) => fl.name == line.name && fl.value == line.value
      )[0]
    ) {
      githubContent.value[l] = file.value.lines.filter(
        (l) => l.name == line.name && l.value == line.value
      )[0];
      githubContent.value[l].new = false;
    } else githubContent.value[l].new = true;
  });

  filterredGithubContent.value = githubContent.value;
  util.hideLoadingScreen();
}

async function translate(
  index: number,
  name: string,
  value: string,
  from: string,
  to: string
) {
  util.showLoadingScreen();
  const translation: string = await store.dispatch("file/translate", {
    name,
    value,
    from: store.state.language.languages.filter((l) => l._id == from)[0],
    to: store.state.language.languages.filter((l) => l._id == to)[0],
  });
  githubContent.value[
    githubContent.value.indexOf(filterredGithubContent.value[index])
  ].translation.value = translation;
  filterredGithubContent.value[index].translation.value = translation;
  util.hideLoadingScreen();
}

async function saveFile() {
  const createdDate = new Date();
  util.showLoadingScreen();
  file.value.lines = githubContent.value.filter((c) => !c.removed);

  // Update translation createdDate
  file.value.lines.map((line, l) => {
    file.value.lines[l].translation.createdAt = createdDate;
    if (line.translation.value != "")
      if (
        !file.value.lines[l].history.filter(
          (h) => h.value == line.translation.value
        )[0]
      )
        file.value.lines[l].history.push({
          value: line.translation.value,
          createdAt: createdDate,
        });
  });

  const filesResponse: _File[] = await store.dispatch(
    "file/updateFile",
    file.value
  );
  await loadData();
  file.value = filesResponse.filter((f) => f._id == file.value._id)[0];
  util.hideLoadingScreen();
}

async function openHistoryModal(line: _FileLine) {
  if (line) lineHistoryObject = ref(line);
  modal.value = {
    modalTitle: `"${line.value.trim()}" translation history`,
    operation: "view",
    actionName: "Cancel",
    showCancel: false,
  };
  showModal("lineHistoryModal");
}

function hideHistoryModal() {
  util.hideModal("lineHistoryModal");
}

// Events
watch(searchText, (newValue) => {
  if (newValue.trim() != "") {
    filterredGithubContent = ref(
      githubContent.value.filter(
        (c) =>
          c.name.toLowerCase().includes(newValue.toLowerCase()) ||
          c.value?.toLowerCase().includes(newValue.toLowerCase())
      )
    );
  } else
    filterredGithubContent = ref(jQuery.extend(true, [], githubContent.value));
});

onMounted(async () => {
  await loadData();
});
</script>
