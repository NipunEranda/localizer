<template>
  <div class="grid place-items-center items-center justify-center h-screen">
    <div class="grid place-items-center -translate-y-32">
      <img :src="util.getIcon('logo')" alt="" class="w-72" />
      <button
        class="dark:bg-primary dark:hover:bg-primary-hover p-3 ps-5 pe-5 rounded-lg"
        @click="redirectGithubLogin()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          class="bi bi-github inline-flex"
          viewBox="0 0 17 17"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        <span class="ms-2">Login with GitHub</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useStore } from "vuex";
import { key } from "../store";
import { Login, _Login } from "@/models/Auth";
import * as util from "@/utils";

const store = useStore(key);

function redirectGithubLogin() {
  location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}&state=${process.env.VUE_APP_GITHUB_STATE}&redirect_uri=${process.env.VUE_APP_GITHUB_REDIRECT_URI}&scope=read:user,user:email`;
}

onMounted(async () => {
  try {
    const code: string = location.search.replace("?code=", "");
    if (code != "") {
      util.showLoadingScreen();
      const loginResponse: _Login = (
        await axios.get(
          `${process.env.VUE_APP_API_URL}/auth/github?code=${code}`
        )
      ).data.data;
      const lr = new Login(loginResponse);
      if (lr.token && lr.user) {
        Cookies.set("token", lr.token, {
          secure: true,
          sameSite: "strict",
          HttpOnly: true,
        });
        store.commit("auth/setCurrentUser", lr.user);
        store.commit("setLoggedIn", true);
        location.reload();
      } else {
        Cookies.remove("token");
        store.commit("auth/setCurrentUser", null);
        store.commit("setLoggedIn", false);
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    util.hideLoadingScreen();
  }
});
</script>
