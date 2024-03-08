// store.ts
import { InjectionKey } from "vue";
import { createStore, Store, ActionContext } from "vuex";
import AuthModule, { AuthState } from "./auth";
import WorkspaceModule, { WorkspaceState } from "./workspace";
import createPersistedState from "vuex-persistedstate";
import router from "@/router";

// define your typings for the store state
export interface State {
  auth: AuthState;
  workspace: WorkspaceState;
  loggedIn: boolean;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: { loggedIn: false } as State,
  modules: {
    auth: AuthModule,
    workspace: WorkspaceModule,
  },
  mutations: {
    setLoggedIn(state: State, data: boolean) {
      state.loggedIn = data;
    },
  },
  actions: {
    handleRequestErrors(context: ActionContext<State, State>, data) {
      if (data.response.status == 400) {
        console.log(data.response.data.error);
      }
      if (data.response.status == 403) {
        this.commit("resetState");
        router.push("/");
      }
    },
  },
  plugins: [createPersistedState()],
});
