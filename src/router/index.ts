import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "../views/Index.vue";
import routes from "./routes";
import { useStore } from "vuex";
import { key } from "../store";
import Cookies from "js-cookie";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const store = useStore(key);

  if (
    (!store.state.auth.currentUser || !Cookies.get("token")) &&
    to.name !== "index"
  )
    return "/";
  if (
    store.state.auth.currentUser &&
    Cookies.get("token") &&
    to.name == "index"
  )
    return "/workspaces";

  // if (to.name == "workspaces")
  //   if (store.getters.getDefaultWorkspace) router.push("/dashboard");
});

export default router;
