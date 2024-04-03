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
    setLanguages(state: LanguageState, data: Language[]) {
      state.languages = data;
    },
    setDefaultLanguage(state: LanguageState, data: Language) {
      state.defaultLanguage = data;
    },
  },
  actions: {
    resetState({ commit }: { commit: Commit }) {
      commit("resetState");
    },
    setLanguages(
      context: ActionContext<LanguageState, State>,
      data: Language[]
    ) {
      context.commit("setLanguages", data);
    },
    setDefaultLanguage(
      context: ActionContext<LanguageState, State>,
      data: Language | null
    ) {
      context.commit("setDefaultLanguage", data);
    },
    async loadLanguages(
      context: ActionContext<LanguageState, State>,
      data: string
    ): Promise<Language[] | null> {
      try {
        if (context.state.languages.length == 0) {
          const languages: Language[] = (
            await axios.get(
              `${process.env.VUE_APP_API_URL}/language?workspace=${data}`,
              {
                withCredentials: true,
              }
            )
          ).data.data;
          context.commit("setLanguages", languages);
        }
        return context.state.languages;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async addLanguage(
      context: ActionContext<LanguageState, State>,
      data: Language
    ): Promise<Language[] | null> {
      try {
        const languages: Language[] = (
          await axios.post(`${process.env.VUE_APP_API_URL}/language`, data, {
            withCredentials: true,
          })
        ).data.data;
        context.commit("setLanguages", languages);
        return languages;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async updateLanguage(
      context: ActionContext<LanguageState, State>,
      data: Language
    ): Promise<Language[] | null> {
      try {
        const languages: Language[] = (
          await axios.put(`${process.env.VUE_APP_API_URL}/language`, data, {
            withCredentials: true,
          })
        ).data.data;
        context.commit("setLanguages", languages);
        return languages;
      } catch (e) {
        store.dispatch("handleRequestErrors", e);
        return null;
      }
    },
    async removeLanguage(
      context: ActionContext<LanguageState, State>,
      data: Language
    ): Promise<Language[] | null> {
      try {
        const languages: Language[] = (
          await axios.delete(
            `${process.env.VUE_APP_API_URL}/language?id=${data._id}&workspace=${data.workspace}`,
            {
              withCredentials: true,
            }
          )
        ).data.data;
        context.commit("setLanguages", languages);
        return languages;
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
