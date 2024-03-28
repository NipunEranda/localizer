<template>
  <div>
    Localization Editor

    {{ githubContent }}
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
import { File, _File } from "@/models/File";
import DropDown from "@/components/DropDown.vue";
import jQuery from "jquery";

const store = useStore(key),
  route = useRoute(),
  file: Ref<_File> = ref(
    store.state.file.files.filter((f) => f._id == route.query.file)[0]
  );

let githubContent: Ref = ref(null);

async function loadData() {
  await store.dispatch("file/loadFiles", null);
  file.value = store.state.file.files.filter(
    (f) => f._id == route.query.file
  )[0];

  githubContent.value = await store.dispatch(
    "file/loadGithubContent",
    file.value
  );
}

onMounted(async () => {
  await loadData();
});
</script>
