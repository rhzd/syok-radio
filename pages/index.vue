<template>
  <div>
    <StationList :stationList="stationList" />
  </div>
</template>

<script>
export default {
  head() {},
  async asyncData({
    $config: { syokUsername, syokPassword, syokURL },
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

      let stationList = await $axios.$get(`${syokURL}/radio/stations`);

      return {
        stationList: stationList.data,
      };
    } catch (e) {
      error(e);
    }
  },
};
</script>

<style lang="postcss" scoped>
</style>
