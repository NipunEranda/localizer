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
    setDefaultWorkspace(
      context: ActionContext<WorkspaceState, State>,
      data: Workspace | null
    ) {
      context.commit("setDefaultWorkspace", data);
    },
    async loadWorkspaces(
      context: ActionContext<WorkspaceState, State>
    ): Promise<Workspace[] | null> {
      try {
        const workspaces: Workspace[] = (
          await axios.get(`${process.env.VUE_APP_API_URL}/workspace`, {
            withCredentials: true,
          })
        ).data.data;
        context.commit("setWorkspaces", workspaces);
        return workspaces;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async addWorkspace(
      context: ActionContext<WorkspaceState, State>,
      data: WorkspaceState
    ): Promise<Workspace[] | null> {
      try {
        const workspaces: Workspace[] = (
          await axios.post(`${process.env.VUE_APP_API_URL}/workspace`, data, {
            headers: {
              withCredentials: true,
            },
          })
        ).data.data;
        context.commit("setWorkspaces", workspaces);
        return workspaces;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async removeWorkspace(
      context: ActionContext<WorkspaceState, State>,
      data: WorkspaceState
    ): Promise<Workspace[] | null> {
      try {
        const workspaces: Workspace[] = (
          await axios.delete(
            `${process.env.VUE_APP_API_URL}/workspace?id=${data}`,
            {
              headers: {
                withCredentials: true,
              },
            }
          )
        ).data.data;
        context.commit("setWorkspaces", workspaces);
        return workspaces;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
  },
};

const getDefaultState = () => {
  return {
    workspaces: [],
    defaultWorkspace: null,
  };
};

export default WorkspaceModule;
