import axios from "axios";
import { store } from "../";

interface AuthState {
  currentUser: any;
  users: any[];
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
    },
    updateCurrentUser(state: AuthState, data: any) {
      state.currentUser = data;
      state.currentUser.theme = localStorage.getItem("theme")
        ? localStorage.getItem("theme")
        : data.theme;
    },
    setUserTheme(state: AuthState, data: any) {
      state.currentUser.theme = data;
      localStorage.setItem("theme", data);
    },
    setUsers(state: AuthState, data: any) {
      state.users = data;
    },
    setCurrentUser(state: AuthState, data: any) {
      state.currentUser = data;
    },
  },
  actions: {
    resetState({ commit }: any) {
      commit("resetState");
    },
    updateCurrentUser(context: any, data: any) {
      context.commit("updateCurrentUser", data);
    },
    async setUserTheme(context: any, data: any) {
      context.commit("setUserTheme", data);
      // Set themes in profile. Just set menu in local here to save request quota
      // axios.put(`${process.env.VUE_APP_API_URL}/user/theme?value=${data}`, {}, {
      //   headers: {
      //     Authorization: `Bearer ${this.getters.getCurrentUser.token}`
      //   }
      // });
    },
    async loadUsers(context: any, data: any) {
      try {
        const response: any = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/list`,
          {
            headers: {
              Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
            },
          }
        );
        context.commit("setUsers", response.data.data);
        return response.data;
      } catch (e) {
        console.log(e);
        store.dispatch("handleRequestErrors", e);
      }
    },
    // async deleteUser(context: any, data: any) {
    //   try {
    //     const response = await axios.delete(
    //       `${process.env.VUE_APP_API_URL}/user?id=${data._id}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
    //         },
    //       }
    //     );
    //     context.commit("setUsers", response.data.data);
    //     return response.data;
    //   } catch (e) {
    //     console.log(e);
    //     store.dispatch("handleRequestErrors", e);
    //   }
    // },
    // async updateUserRole(context: any, data: any) {
    //   try {
    //     const response = await axios.put(
    //       `${process.env.VUE_APP_API_URL}/user?id=${data.id}`,
    //       data,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
    //         },
    //       }
    //     );
    //     context.commit("setUsers", response.data.data);
    //     return response.data;
    //   } catch (e) {
    //     console.log(e);
    //     store.dispatch("handleRequestErrors", e);
    //   }
    // },
  },
};

const getDefaultState = () => {
  return {
    currentUser: null,
    users: [],
  };
};

export default AuthModule;
