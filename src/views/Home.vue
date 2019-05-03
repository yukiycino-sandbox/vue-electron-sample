<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import tweet from "../modules/tweet"

@Component
export default class Home extends Vue {
  constructor() {
    super()

    tweet.fetchTimeline()
  }
}
</script>
