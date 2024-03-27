import { RouteRecordRaw } from "vue-router";
import Index from "@/views/Index.vue";
import Workspaces from "@/views/Workspaces.vue";
import Dashboard from "@/views/Dashboard.vue";
import Repositories from "@/views/Repositories.vue";
import Files from "@/views/Files.vue";
import Languages from "@/views/Languages.vue";
import AdminIndex from "@/views/Admin/Index.vue";
import LocalizationEditor from "@/views/LocalizationEditor.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: Index,
  },
  {
    path: "/workspaces",
    name: "workspaces",
    component: Workspaces,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/repositories",
    name: "repositories",
    component: Repositories,
  },
  {
    path: "/files",
    name: "files",
    component: Files,
  },
  {
    path: "/languages",
    name: "languages",
    component: Languages,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminIndex,
  },
  {
    path: "/editor",
    name: "editor",
    component: LocalizationEditor,
  },
];

export default routes;
