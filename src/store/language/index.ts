import axios from "axios";
import { State, store } from "../";
import { Commit, ActionContext } from "vuex";
import { Language } from "@/models/Language";

export interface LanguageState {
  languages: Language[];
  defaultLanguage: Language;
}

const LanguageModule = {
  namespaced: true,
  state: (): LanguageState => ({
    languages: [],
    defaultLanguage: Language.createEmptyObject(),
  }),
  getters: {
    getLanguages(state: LanguageState) {
      return state.languages;
    },
    getDefaultWorkspace(state: LanguageState) {
      return state.defaultLanguage;
    },
  },
  mutations: {
    resetState(state: LanguageState) {
      Object.assign(state, getDefaultState());
    },
    setWorkspaces(state: LanguageState, data: Language[]) {
      state.languages = data;
    },
    setDefaultWorkspace(state: LanguageState, data: Language) {
      state.defaultLanguage = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setWorkspaces(
      context: ActionContext<LanguageState, State>,
      data: Language[]
    ) {
      context.commit("setLanguages", data);
    },
    setDefaultWorkspace(
      context: ActionContext<LanguageState, State>,
      data: Language | null
    ) {
      context.commit("setDefaultLanguage", data);
    },
    async loadLanguages(
      context: ActionContext<LanguageState, State>
    ): Promise<Language[] | null> {
      try {
        const languages: Language[] = (
          await axios.get(`${process.env.VUE_APP_API_URL}/language`, {
            withCredentials: true,
          })
        ).data.data;
        // context.commit("setLanguages", languages);
        // return languages;
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
    languages: [],
    defaultLanguage: Language.createEmptyObject(),
  };
};

export default LanguageModule;
