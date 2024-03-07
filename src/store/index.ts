// store.ts
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import AuthModule from "./auth";
import WorkspaceModule from "./workspace";
import createPersistedState from "vuex-persistedstate";

// define your typings for the store state
export interface State {
  [x: string]: any;
  loggedIn: boolean;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store: any = createStore<State>({
  state: {
    loggedIn: false,
  },
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
