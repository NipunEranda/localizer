import { RouteRecordRaw } from "vue-router";
import Index from "@/views/Index.vue";
import Workspaces from "@/views/Workspaces.vue";
import Dashboard from "@/views/Dashboard.vue";
import Projects from "@/views/Projects.vue";
import Files from "@/views/Files.vue";
import Languages from "@/views/Languages.vue";
import AdminIndex from "@/views/Admin/Index.vue";

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
    path: "/projects",
    name: "projects",
    component: Projects,
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
];

export default routes;
