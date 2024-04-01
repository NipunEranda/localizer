import axios from "axios";
import { State, store } from "../";
import { Commit, ActionContext } from "vuex";
import { _File } from "@/models/File";
import { _Language } from "@/models/Language";

export interface FileState {
  files: _File[];
  fileContent: string;
}

const FileModule = {
  namespaced: true,
  state: (): FileState => ({
    files: [],
    fileContent: "",
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
    setFileContent(state: FileState, data: string) {
      state.fileContent = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setFiles(context: ActionContext<FileState, State>, data: _File[]) {
      context.commit("setFiles", data);
    },
    setFileContent(context: ActionContext<FileState, State>, data: string) {
      context.commit("setFileContent", data);
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
      data: _File
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
      data: _File
    ): Promise<_File[] | null> {
      try {
        const files: _File[] = (
          await axios.delete(
            `${process.env.VUE_APP_API_URL}/file?id=${data._id}&workspace=${store.state.workspace.defaultWorkspace._id}`,
            {
              headers: {
                withCredentials: true,
              },
            }
          )
        ).data.data;
        context.commit("setFiles", files);
        return files;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async updateFile(
      context: ActionContext<FileState, State>,
      data: _File
    ): Promise<_File[] | null> {
      try {
        const files: _File[] = (
          await axios.put(`${process.env.VUE_APP_API_URL}/file`, data, {
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
    async loadGithubContent(
      context: ActionContext<FileState, State>,
      data: _File
    ) {
      try {
        const githubResponse = (
          await axios.get(
            `${process.env.VUE_APP_API_URL}/file/content?id=${data._id}`,
            {
              headers: {
                withCredentials: true,
              },
            }
          )
        ).data.data;
        context.commit("setFileContent", githubResponse);
        return githubResponse;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async translate(
      context: ActionContext<FileState, State>,
      data: { name: string; value: string; from: _Language; to: _Language }
    ) {
      const translateResponse = (
        await axios.post(
          `${process.env.VUE_APP_API_URL}/file/translate`,
          data,
          {
            headers: {
              withCredentials: true,
            },
          }
        )
      ).data.data;
      return translateResponse;
    },
  },
};

const getDefaultState = () => {
  return {
    files: [],
  };
};

export default FileModule;
