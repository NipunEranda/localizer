import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useStore } from "vuex";
import { key } from "../store";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to /*, from*/) => {
  const store = useStore(key);

  if (store.state.auth) {
    if (!store.state.auth.currentUser && to.name !== "index") return "/";
    if (store.state.auth.currentUser && to.name == "index")
      return "/workspaces";
  }

  if (to.name == "workspaces")
    if (store.state.workspace.defaultWorkspace) router.push("/dashboard");
});

export default router;
