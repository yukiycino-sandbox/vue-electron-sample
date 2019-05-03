import { Mutation, Action, VuexModule, getModule, Module } from "vuex-module-decorators"
import ElectronStore from "electron-store"

import store from "../store"

export interface State {
  accessToken: string | null
  accessSecret: string | null
}

@Module({ dynamic: true, store, name: "auth" })
class AuthModule extends VuexModule implements State {
  accessToken: string | null = null
  accessSecret: string | null = null

  @Mutation
  SET_ACCESS_TOKEN(token: string | null) {
    const electronStore = new ElectronStore()

    if (token) {
      electronStore.set("accessToken", token)
    } else {
      electronStore.delete("accessToken")
    }

    this.accessToken = token
  }

  @Mutation
  SET_ACCESS_SECRET(accessSecret: string | null) {
    const electronStore = new ElectronStore()

    if (accessSecret) {
      electronStore.set("accessSecret", accessSecret)
    } else {
      electronStore.delete("accessSecret")
    }

    this.accessSecret = accessSecret
  }

  @Action
  login({ accessToken, accessSecret }: { accessToken: string; accessSecret: string }) {
    this.SET_ACCESS_TOKEN(accessToken)
    this.SET_ACCESS_SECRET(accessSecret)
  }

  @Action
  logout() {
    this.SET_ACCESS_TOKEN(null)
    this.SET_ACCESS_SECRET(null)
  }
}

export default getModule(AuthModule)
