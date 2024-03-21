// store.ts
import { InjectionKey } from "vue";
import { createStore, Store, ActionContext } from "vuex";

import AuthModule, { AuthState } from "./auth";
import WorkspaceModule, { WorkspaceState } from "./workspace";
import RepositoryModule, { RepositoryState } from "./repositories";
import FileModule, { FileState } from "./files";
import LanguageModule, { LanguageState } from "./language";

import createPersistedState from "vuex-persistedstate";
import router from "@/router";

// define your typings for the store state
export interface State {
  auth: AuthState;
  workspace: WorkspaceState;
  repository: RepositoryState;
  file: FileState;
  language: LanguageState;
  loggedIn: boolean;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: { loggedIn: false } as State,
  modules: {
    auth: AuthModule,
    workspace: WorkspaceModule,
    repository: RepositoryModule,
    file: FileModule,
    language: LanguageModule,
  },
  mutations: {
    setLoggedIn(state: State, data: boolean) {
      state.loggedIn = data;
    },
  },
  actions: {
    handleRequestErrors(context: ActionContext<State, State>, data) {
      if (data.response.status == 401) {
        this.commit("auth/resetState");
        router.push("/");
      }
    },
    logout() {
      this.commit("auth/resetState");
      this.commit("workspace/resetState");
      this.commit("repository/resetState");
      this.commit("setLoggedIn", false);
      this.state.loggedIn = false;
      location.href = "/";
    },
  },
  plugins: [createPersistedState()],
});
