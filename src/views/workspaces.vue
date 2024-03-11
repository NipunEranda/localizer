<template>
  <div class="text-center pt-16">
    <span class="text-4xl font-bold">Select a Workspace</span>
    <div class="mt-7">
      <!-- Workspace list -->
      <div v-if="workspaces.length == 0">
        <small class="text-neutral-400" v-if="!loading['workspaces']"
          >Create a Workspace</small
        >
        <div v-if="loading['workspaces']">
          <div
            class="loader inline-flex justify-center items-center text-neutral-900 dark:invert"
          ></div>
        </div>
      </div>
      <div v-if="workspaces.length > 0">
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
                class="p-3 w-96 group-hover:dark:bg-neutral-700 group-hover:rounded-3xl hover:bg-neutral-200 hover:bg-opacity-90"
                @click="navigateToWorkspace(workspace)"
                v-text="workspace.name"
              ></div>
              <div
                class="hidden align-middle items-center group-hover:inline-flex"
              >
                <fai
                  icon="fa-trash"
                  class="text-lg p-2 hover:bg-neutral-200 rounded-full ml-2"
                  @click="openCreateModal('delete', workspace)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full inline-flex justify-center align-middle items-center">
      <div>
        <div
          class="p-2 w-56 rounded-xl mt-7 group-hover:dark:bg-neutral-700 group-hover:rounded-3xl bg-orange-600 bg-opacity-90 hover:bg-opacity-100 cursor-pointer text-white"
          @click="openCreateModal('add')"
        >
          New Workspace
        </div>
        <div
          class="p-2 mt-3 w-56 bg-danger hover:bg-danger-hover rounded-xl cursor-pointer text-white"
          @click="store.dispatch('logout')"
        >
          <fai icon="fa-power-off" class="text-lg" />
          <span class="ms-2">Sign Out</span>
        </div>
      </div>
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
import * as util from "@/utils";
import router from "@/router";
import { onMounted, ref } from "vue";
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
let loading = ref({
  workspaces: false,
});

onMounted(async () => {
  loading.value["workspaces"] = true;
  workspaces.value = await store.dispatch("workspace/loadWorkspaces");
  loading.value["workspaces"] = false;
});

async function modalProcess() {
  util.showLoadingScreen();
  try {
    let response;
    switch (operation.value) {
      case "add":
        response = await store.dispatch("workspace/addWorkspace", workspace);
        if (response) workspaces.value = response;
        util.hideModal("workspaceModal");
        break;
      case "delete":
        response = await store.dispatch(
          "workspace/removeWorkspace",
          selectedWorkspace.value._id
        );
        if (response) workspaces.value = response;
        util.hideModal("workspaceModal");
        break;
    }
  } catch (e) {
    console.log(e);
  } finally {
    util.hideLoadingScreen();
  }
}

function openCreateModal(opt, obj) {
  operation.value = opt;
  switch (operation.value) {
    case "add":
      modalTitle = ref("Create Workspace");
      actionName = ref("Save");
      break;
    case "delete":
      modalTitle = ref("Remove Workspace");
      modalContent = ref(
        `Do you want to remove <i><b>${obj.name}</b></i> workspace?`
      );
      actionName = ref("Remove");
      selectedWorkspace = ref(obj);
      break;
  }
  util.showModal("workspaceModal");
}

function navigateToWorkspace(workspace) {
  store.commit("workspace/setDefaultWorkspace", workspace);
  router.push("/dashboard");
}
</script>
