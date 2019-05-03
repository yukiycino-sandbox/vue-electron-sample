import { Mutation, Action, VuexModule, getModule, Module } from "vuex-module-decorators"
import Twitter from "twitter"

import store from "../store"

export interface State {
  items: Array<Tweet>
}

type Tweet = {
  text: string
}

@Module({ dynamic: true, store, name: "tweet" })
class TweetModule extends VuexModule implements State {
  items: Array<Tweet> = []

  @Mutation
  SET_TWEETS(tweets: Array<Tweet>) {
    this.items = tweets
  }

  @Action
  fetchTimeline() {
    const consumerKey = "W6n2eXjFNqfpZlMiz7XCw4Dli"
    const consumerSecret = "YEixmoVWJoeFPZ1dbHaFuqNkvpkYwc44voFQKhuKlCFw8e0LIA"
    const { accessToken, accessSecret } = store.state.auth

    if (!accessToken || !accessSecret) {
      this.SET_TWEETS([])
      return
    }

    const client = new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessToken,
      access_token_secret: accessSecret
    })

    const params = {
      count: 200
    }

    client.get("statuses/home_timeline", params, (error, tweets) => {
      if (!error) {
        console.log(
          tweets
            .filter(tweet => {
              return "extended_entities" in tweet
            })
            .filter(tweet => {
              return "media" in tweet.extended_entities
            })
            .filter(tweet => {
              return tweet.user.protected === false
            })
            .filter(tweet => {
              return tweet.extended_entities.media[0].expanded_url.match(/photo/)
            })
        )
      } else {
        console.error(error)
      }
    })
  }
}

export default getModule(TweetModule)
