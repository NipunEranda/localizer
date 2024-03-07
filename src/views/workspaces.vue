<template>
  <div class="text-center pt-16">
    <span class="text-4xl font-bold">Select a Workspace</span>
    <div class="mt-7">
      <!-- Workspace list -->
      <div
        v-for="(workspace, w) in workspaces"
        :key="w"
        class="group cursor-pointer w-fit flex-grow m-auto text-center"
      >
        <div
          class="p-1 w-96 border-b-[0.1em] dark:border-b-neutral-600"
          :class="{ ' border-t-[0.1em] dark:border-neutral-600': w == 0 }"
        >
          <div class="inline-flex group">
            <div
              class="p-3 w-96 group-hover:dark:bg-neutral-700 group-hover:rounded-3xl"
              @click="navigateToWorkspace(workspace)"
              v-text="workspace.name"
            ></div>
            <div
              class="hidden align-middle items-center group-hover:inline-flex"
            >
              <fai
                icon="fa-trash"
                class="text-lg p-2 hover:bg-neutral-500 rounded-full ml-2"
                @click="openCreateModal('delete', workspace)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button
        class="bg-orange-600 p-2 ps-7 pe-7 rounded-xl mt-7"
        @click="openCreateModal('add')"
      >
        Create Workspace
      </button>
    </div>
  </div>

  <modal
    :modalId="'workspaceModal'"
    :modalTitle="modalTitle"
    :operation="operation"
    :modalProcess="modalProcess"
    :showCancel="true"
    :actionName="actionName"
  >
    <div v-if="operation == 'add' || operation == 'update'">
      <label
        for="name"
        class="block mb-2 text-xs font-medium text-neutral-700 dark:text-white"
        ><span>Name</span></label
      >
      <input
        type="text"
        id="name"
        v-model="workspace.name"
        class="bg-neutral-50 border border-neutral-300 text-gray-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-orange-600 dark:focus:border-orange-600"
      />
    </div>
    <div v-if="operation == 'delete'" v-html="modalContent"></div>
  </modal>
</template>

<script setup>
import * as util from "../utils";
import router from "@/router";
import { onBeforeMount, onMounted, ref } from "vue";
import { key } from "../store";
import { useStore } from "vuex";

const workspace = {
  name: "",
  deleted: false,
  isActive: true,
};

const store = useStore(key);
let workspaces = ref(store.state.workspace.workspaces);
let modalTitle = ref("Add Workspace");
let operation = ref("add");
let actionName = ref("Save");
let modalContent = ref("");
let selectedWorkspace = ref(null);

onMounted(async () => {
  // workspaces.value = await store.dispatch("workspace/loadWorkspaces");
});

async function modalProcess() {
  let response;
  util.showLoadingScreen();
  try {
    switch (operation.value) {
      case "add":
        response = await store.dispatch("addWorkspace", workspace);
        util.hideModal("workspaceModal");
        break;
      case "delete":
        response = await store.dispatch(
          "removeWorkspace",
          selectedWorkspace.value._id
        );
        util.hideModal("workspaceModal");
        break;
    }
    if (response) workspaces.value = response;
  } catch (e) {
    console.log(e);
  } finally {
    util.hideLoadingScreen();
  }
}

function openCreateModal(opt, obj) {
  operation = opt;
  switch (operation.value) {
    case "add":
      modalTitle.value = "Create Workspace";
      actionName.value = "Save";
      break;
    case "delete":
      modalTitle.value = "Remove Workspace";
      modalContent.value = `Do you want to remove <i><b>${obj.name}</b></i> workspace?`;
      actionName.value = "Remove";
      selectedWorkspace = obj;
      break;
  }

  util.showModal("workspaceModal");
}

function navigateToWorkspace(workspace) {
  store.commit("setDefaultWorkspace", workspace);
  router.push("/dashboard");
}
</script>
