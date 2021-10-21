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

      const stationList = await $axios.$get(`${syokURL}/radio/streams/groups`);

      let reStation = []

      stationList.data.forEach((element) => {
        element.stations.forEach((station) => {
          reStation.push(station);
        });
      });

      return {
        stationList: reStation,
      };
    } catch (e) {
      error(e);
    }
  },
};
</script>

<style lang="postcss" scoped>
</style>
