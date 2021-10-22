<template>
  <div>
    <StationList :stationList="stationList" />
  </div>
</template>

<script>
import tempData from "../static/data.json";
import syokImage from '../static/syok-logo-landscape.png';

export default {
  head() {
    return {
      title: "SYOK Radio",
      meta: [
        { hid: "title", property: "title", content: "SYOK Radio" },
        {
          hid: "description",
          name: "description",
          property: "description",
          content: "Everything Got!",
        },
        { hid: "robots", property: "robots", content: "index, follow" },

        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "og:url", property: "og:url", content: this.host },
        {
          hid: "og:title",
          property: "og:title",
          content: "SYOK Radio",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Everything Got!",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.host + syokImage,
        },

        {
          hid: "twitter:card",
          property: "twitter:card",
          content: "summary_large_image",
        },
        { hid: "twitter:url", property: "twitter:url", content: this.host },
        {
          hid: "twitter:title",
          property: "twitter:title",
          content: "SYOK Radio",
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: "Everything Got!",
        },
        {
          hid: "twitter:image",
          property: "twitter:image",
          content: this.host + syokImage,
        },
      ],
    };
  },
  async asyncData({
    $config: { syokUsername, syokPassword, baseURL, syokURL },
    $axios,
    error,
  }) {
    try {
      $axios.setHeader(
        "Authorization",
        `Basic ${Buffer.from(`${syokUsername}:${syokPassword}`).toString(
          "base64"
        )}`
      );
      const syokToken = await $axios.$post(`${syokURL}/authenticate`);
      $axios.setHeader("Authorization", `Bearer ${syokToken.data}`);

      const stationList = await $axios
        .$get(`${syokURL}/radio/streams/groups`)
        .catch((error) => {
          return tempData;
        });
      let reStation = [];

      stationList.data.forEach((element) => {
        element.stations.forEach((station) => {
          reStation.push(station);
        });
      });

      return {
        stationList: reStation,
        host: baseURL,
      };
    } catch (e) {
      error(e);
    }
  },
};
</script>

<style lang="postcss" scoped>
</style>
