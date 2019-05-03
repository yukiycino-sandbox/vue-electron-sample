import Vue from "vue"
import Vuex from "vuex"

import { State as AuthState } from "./modules/auth"
import { State as TweetState } from "./modules/tweet"

Vue.use(Vuex)

export type RootState = {
  auth: AuthState
  tweet: TweetState
}

export default new Vuex.Store<RootState>({})
