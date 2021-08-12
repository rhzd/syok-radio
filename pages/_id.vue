<template>
  <div v-if="stationData" class="grid grid-rows-6 grid-cols-12">
    <div
      class="
        col-span-12
        lg:col-span-4
        row-span-6
        lg:shadow-lg
        bg-player
        lg:rounded-3xl
      "
    >
      <RadioPlayer :streamToken="streamToken" :stationData="stationData" />
      <Show />
    </div>
    <div
      class="
        invisible
        lg:visible
        flex
        col-span-8
        row-span-3
        shadow-lg
        bg-banner
        rounded-3xl
        justify-center
        items-center
        text-white text-2xl
        font-extrabold
      "
    >
      <BackgroundImage
        :backgroundImage="
          stationData.images.find((x) => x.name === 'background_images').url
        "
      />
    </div>
    <div
      class="
        hidden
        lg:block
        col-span-8
        row-span-3
        text-white text-2xl
        font-extrabold
      "
    >
      <div class="h-full grid grid-rows-2 grid-cols-6 mt-6">
        <div class="last-played-song-container row-span-2 col-span-2">
          <LastPlayedSong
            :squareImage="
              stationData.images.find((x) => x.name === 'square_image').url
            "
            :playoutHistory="playoutHistory"
          />
        </div>
        <div class="row-span-1 col-span-4">
          <MoreFromUs :moreFromUs="moreFromUs" />
        </div>
        <div class="row-span-1 col-span-4">
          <RecommendedForYou :recommendedForYou="recommendedForYou" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: this.stationData.name,
      meta: [
        { hid: 'title', property: 'title', content: this.stationData.name },
        { hid: 'description', property: 'description', content: this.stationData.description },
        { hid: 'robots', property: 'robots', content: "index, follow" },

        { hid: 'og:type', property: 'og:type', content: "website" },
        { hid: 'og:url', property: 'og:url', content: this.host },
        { hid: 'og:title', property: 'og:title', content: this.stationData.name },
        { hid: 'og:description', property: 'og:description', content: this.stationData.description },
        { hid: 'og:image', property: 'og:image', content: this.stationData.images.find((x) => x.name === 'landscape_image').url },

        { hid: 'twitter:card', property: 'twitter:card', content: "summary_large_image" },
        { hid: 'twitter:url', property: 'twitter:url', content: this.host },
        { hid: 'twitter:title', property: 'twitter:title', content: this.stationData.name },
        { hid: 'twitter:description', property: 'twitter:description', content: this.stationData.description },
        { hid: 'twitter:image', property: 'twitter:image', content: this.stationData.images.find((x) => x.name === 'landscape_image').url },
      ]
    }
  },
  async asyncData({
    $config: { syokUsername, syokPassword, syokURL, baseURL },
    $axios,
    error,
    params,
    req
  }) {
    try {
      const streamToken = await $axios.$get(`${baseURL}/api/get-token`);
      $axios.setHeader(
        "Authorization",
        `Basic ${Buffer.from(`${syokUsername}:${syokPassword}`).toString(
          "base64"
        )}`
      );
      const syokToken = await $axios.$post(`${syokURL}/authenticate`);
      $axios.setHeader("Authorization", `Bearer ${syokToken.data}`);
      const stationData = await $axios.$get(
        `${syokURL}/radio/streams/${params.id}`
      );

      let playoutHistory = null;
      if (
        stationData.data.externalLinks.find((x) => x.key === "playoutHistory")
      ) {
        playoutHistory = await $axios.$get(
          `${
            stationData.data.externalLinks.find(
              (x) => x.key === "playoutHistory"
            ).url
          }&limit=6`
        );
      }

      let filteredStation = [];
      if (stationData.data.language !== "en") {
        let stationListTemp = await $axios.$get(
          `${syokURL}/radio/stations?language=${stationData.data.language}`
        );
        stationListTemp.data.forEach((el) => {
          filteredStation.push(el);
        });
      }
      let stationListTemp = await $axios.$get(
        `${syokURL}/radio/stations?language=en`
      );

      stationListTemp.data.forEach((el) => {
        filteredStation.push(el);
      });

      let recommendedForYou = filteredStation.filter(
        (item) => item.stationCode !== params.id
      );
      let moreFromUs = filteredStation.filter((item) =>
        item.stationCode.includes(params.id)
      );

      return {
        streamToken: streamToken.data,
        stationData: stationData.data,
        moreFromUs: moreFromUs.slice(0, 5),
        recommendedForYou: recommendedForYou.slice(0, 6),
        playoutHistory: playoutHistory ? playoutHistory.data : [],
        host: req.headers.referer
      };
    } catch (e) {
      error(e);
    }
  },
  created() {},
  mounted() {},
};
</script>

<style scoped>
.bg-player {
  background-color: transparent;
  background: transparent;
  width: auto;
}
.square {
  width: 100px;
  height: 100px;
}
.bg-banner {
  background-color: #fd0015;
}
.last-played-song-container {
  width: 85%;
}

@media only screen and (min-width: 1024px) {
  .bg-player {
    background-color: #f20b0b;
    background: linear-gradient(
      180deg,
      rgba(242, 11, 11, 1) 60%,
      rgba(222, 28, 28, 1) 100%
    );
    width: 90%;
  }
}
</style>