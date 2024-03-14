import axios from "axios";
import { store, State } from "../";
import { Commit, ActionContext } from "vuex";
import { _Repository } from "@/models/Repository";

export interface RepositoryState {
  repositories: _Repository[];
}

const RepositoryModule = {
  namespaced: true,
  state: (): RepositoryState => ({
    repositories: [],
  }),
  getters: {
    getRepositories(state: RepositoryState) {
      return state.repositories;
    },
  },
  mutations: {
    resetState(state: RepositoryState) {
      Object.assign(state, getDefaultState());
    },
    setRepositories(state: RepositoryState, data: _Repository[]) {
      state.repositories = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setRepositories(
      context: ActionContext<RepositoryState, State>,
      data: _Repository[]
    ) {
      context.commit("setRepositories", data);
    },
    async loadRepositories(
      context: ActionContext<RepositoryState, State>
    ): Promise<_Repository[] | null> {
      try {
        if (context.state.repositories.length == 0) {
          const repositoriesResponse: _Repository[] = (
            await axios.get(`${process.env.VUE_APP_API_URL}/repository`, {
              withCredentials: true,
            })
          ).data.data;
          context.commit("setRepositories", repositoriesResponse);
          return repositoriesResponse;
        } else return context.state.repositories;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
  },
};

const getDefaultState = () => {
  return {
    repositories: [],
  };
};

export default RepositoryModule;
