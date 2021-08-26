<template>
  <div>
    <StationList />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Syok Radio",
      meta: [
        { hid: "title", property: "title", content: "Syok Radio" },
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
          content: "Syok Radio",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Everything Got!",
        },
        // {
        //   hid: "og:image",
        //   property: "og:image",
        //   content: this.station.images.landscapeImage,
        // },
        {
          hid: "twitter:card",
          property: "twitter:card",
          content: "summary_large_image",
        },
        { hid: "twitter:url", property: "twitter:url", content: this.host },
        {
          hid: "twitter:title",
          property: "twitter:title",
          content: "Syok Radio",
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: "Everything Got!",
        },
        // {
        //   hid: "twitter:image",
        //   property: "twitter:image",
        //   content: this.station.images.find((x) => x.name === "landscape_image")
        //     .url,
        // },
      ],
    };
  },
  data() {
    return {
      host: null,
    };
  },
  async fetch() {
    try {
      this.host = this.$config.baseURL;
    } catch (error) {
      return this.$nuxt.error({ statusCode: 404, message: 'Data not found' })
    }
  },
};
</script>

<style lang="postcss" scoped>
</style>
