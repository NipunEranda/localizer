// store.ts
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import AuthModule, { AuthState } from "./auth";
import WorkspaceModule, { WorkspaceState } from "./workspace";
import createPersistedState from "vuex-persistedstate";

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
  plugins: [createPersistedState()],
});
