import axios from "axios";
import { State, store } from "../";
import { User } from "@/models/Auth";
import { Commit, ActionContext } from "vuex";
import Cookies from "js-cookie";

export interface AuthState {
  currentUser: User | null;
  users: User[];
}

const AuthModule = {
  namespaced: true,
  state: (): AuthState => ({
    currentUser: null,
    users: [],
  }),
  getters: {
    getCurrentUser(state: AuthState) {
      return state.currentUser;
    },
    getUsers(state: AuthState) {
      return state.users;
    },
  },
  mutations: {
    resetState(state: AuthState) {
      Object.assign(state, getDefaultState());
      Cookies.remove("local._token");
    },
    setUsers(state: AuthState, data: User[]) {
      state.users = data;
    },
    setCurrentUser(state: AuthState, data: User) {
      state.currentUser = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    updateCurrentUser(context: ActionContext<AuthState, State>, data: User) {
      context.commit("updateCurrentUser", data);
    },
    async loadUsers(context: ActionContext<AuthState, State>): Promise<void> {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/list`,
          {
            headers: {
              Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
              withCredentials: true,
            },
          }
        );
        context.commit("setUsers", response.data.data);
      } catch (e) {
        console.log(e);
        store.dispatch("handleRequestErrors", e);
      }
    },
  },
};

const getDefaultState = () => {
  return {
    currentUser: null,
    users: [],
  };
};

export default AuthModule;
