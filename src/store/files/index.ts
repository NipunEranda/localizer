import axios from "axios";
import { Workspace } from "@/models/Workspace";
import { State, store } from "../";
import { Commit, ActionContext } from "vuex";
import { _File } from "@/models/File";

export interface FileState {
  files: _File[];
}

const FileModule = {
  namespaced: true,
  state: (): FileState => ({
    files: [],
  }),
  getters: {
    getWorkspaces(state: FileState) {
      return state.files;
    },
  },
  mutations: {
    resetState(state: FileState) {
      Object.assign(state, getDefaultState());
    },
    setWorkspaces(state: FileState, data: _File[]) {
      state.files = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setWorkspaces(context: ActionContext<FileState, State>, data: _File[]) {
      context.commit("setWorkspaces", data);
    },
    async loadWorkspaces(
      context: ActionContext<FileState, State>
    ): Promise<FileState[] | null> {
      try {
        // const workspaces: Workspace[] = (
        //   await axios.get(`${process.env.VUE_APP_API_URL}/workspace`, {
        //     withCredentials: true,
        //   })
        // ).data.data;
        // context.commit("setWorkspaces", workspaces);
        // return workspaces;
        return [];
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async addWorkspace(
      context: ActionContext<FileState, State>,
      data: FileState
    ): Promise<_File[] | null> {
      try {
        // const workspaces: Workspace[] = (
        //   await axios.post(`${process.env.VUE_APP_API_URL}/workspace`, data, {
        //     headers: {
        //       withCredentials: true,
        //     },
        //   })
        // ).data.data;
        // context.commit("setWorkspaces", workspaces);
        // return workspaces;
        return [];
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async removeWorkspace(
      context: ActionContext<FileState, State>,
      data: FileState
    ): Promise<_File[] | null> {
      try {
        // const workspaces: Workspace[] = (
        //   await axios.delete(
        //     `${process.env.VUE_APP_API_URL}/workspace?id=${data}`,
        //     {
        //       headers: {
        //         withCredentials: true,
        //       },
        //     }
        //   )
        // ).data.data;
        // context.commit("setWorkspaces", workspaces);
        // return workspaces;
        return [];
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
  },
};

const getDefaultState = () => {
  return {
    files: [],
  };
};

export default FileModule;
