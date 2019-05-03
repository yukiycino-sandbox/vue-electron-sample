<template>
  <div>
    <button v-on:click="loginDialog">ログイン</button>
    <button v-on:click="logout">ログアウト</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { ipcRenderer, Event } from "electron"

import router from "../router"
import auth from "../modules/auth"

ipcRenderer.on("loginSuccess", (_e: Event, accessToken: string, accessSecret: string) => {
  alert("ログインに成功しました")

  auth.login({ accessToken, accessSecret })
  router.push("/")
})

@Component
export default class Login extends Vue {
  loginDialog(): void {
    ipcRenderer.send("loginDialog")
  }

  logout(): void {
    alert("ログアウトしました")

    auth.logout()
  }
}
</script>

<style scoped></style>
