<template>
  <div id="app">
    <div>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Store from "electron-store"

import router from "./router"
import auth from "./modules/auth"

@Component
export default class App extends Vue {
  constructor() {
    super()

    const electronStore = new Store()
    const accessToken = electronStore.get("accessToken") as string | null
    const accessSecret = electronStore.get("accessSecret") as string | null

    if (!accessToken || !accessSecret) {
      router.push("/login")
      return
    }

    auth.login({ accessToken, accessSecret })
  }
}
</script>
