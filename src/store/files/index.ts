import axios from "axios";
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
    getFiles(state: FileState) {
      return state.files;
    },
  },
  mutations: {
    resetState(state: FileState) {
      Object.assign(state, getDefaultState());
    },
    setFiles(state: FileState, data: _File[]) {
      state.files = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setFiles(context: ActionContext<FileState, State>, data: _File[]) {
      context.commit("setFiles", data);
    },
    async loadFiles(
      context: ActionContext<FileState, State>
    ): Promise<_File[] | null> {
      try {
        if (context.state.files.length == 0) {
          const files: _File[] = (
            await axios.get(
              `${process.env.VUE_APP_API_URL}/file?owner=${store.state.auth.currentUser._id}&workspace=${store.state.workspace.defaultWorkspace._id}`,
              {
                withCredentials: true,
              }
            )
          ).data.data;
          context.commit("setFiles", files);
          return files;
        }
        return context.state.files;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async addFile(
      context: ActionContext<FileState, State>,
      data: FileState
    ): Promise<_File[] | null> {
      try {
        const files: _File[] = (
          await axios.post(`${process.env.VUE_APP_API_URL}/file`, data, {
            headers: {
              withCredentials: true,
            },
          })
        ).data.data;
        context.commit("setFiles", files);
        return files;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async removeFile(
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
    async updateFile(
      context: ActionContext<FileState, State>,
      data: FileState
    ): Promise<_File[] | null> {
      try {
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
