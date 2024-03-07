import axios from "axios";
import { Workspace } from "@/models/Workspace";
import { State, store } from "../";
import { Commit, ActionContext } from "vuex";

export interface WorkspaceState {
  workspaces: Workspace[];
  defaultWorkspace: Workspace | null;
}

const WorkspaceModule = {
  namespaced: true,
  state: (): WorkspaceState => ({
    workspaces: [],
    defaultWorkspace: null,
  }),
  getters: {
    getWorkspaces(state: WorkspaceState) {
      return state.workspaces;
    },
    getDefaultWorkspace(state: WorkspaceState) {
      return state.defaultWorkspace;
    },
  },
  mutations: {
    resetState(state: WorkspaceState) {
      Object.assign(state, getDefaultState());
    },
    setWorkspaces(state: WorkspaceState, data: Workspace[]) {
      state.workspaces = data;
    },
    setDefaultWorkspace(state: WorkspaceState, data: Workspace) {
      state.defaultWorkspace = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setWorkspaces(
      context: ActionContext<WorkspaceState, State>,
      data: Workspace[]
    ) {
      context.commit("setWorkspaces", data);
    },
    async loadWorkspaces(
      context: ActionContext<WorkspaceState, State>
    ): Promise<void> {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/workspace`,
          {
            headers: {
              Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
            },
          }
        );
        context.commit("setWorkspaces", response.data.workspaces);
        return response.data.workspaces;
      } catch (e) {
        console.log(e);
        store.dispatch("handleRequestErrors", e);
      }
    },
    // async addWorkspace(context: any, data: any): Promise<any> {
    //   const response = await axios.post(
    //     `${process.env.VUE_APP_API_URL}/workspace`,
    //     data,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
    //       },
    //     }
    //   );
    //   if (response.data)
    //     context.commit("setWorkspaces", response.data.workspaces);
    //   return response.data.workspaces;
    // },
    // async removeWorkspace(context: any, data: any): Promise<any> {
    //   const response = await axios.delete(
    //     `${process.env.VUE_APP_API_URL}/workspace?id=${data}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
    //       },
    //     }
    //   );
    //   if (response.data)
    //     context.commit("setWorkspaces", response.data.workspaces);
    //   return response.data.workspaces;
    // },
  },
};

const getDefaultState = () => {
  return {
    workspaces: [],
    defaultWorkspace: null,
  };
};

export default WorkspaceModule;
