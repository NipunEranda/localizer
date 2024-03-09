import { RouteRecordRaw } from "vue-router";
import Index from "../views/Index.vue";
import Workspaces from "../views/workspaces.vue";

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
];

export default routes;
