<template>
  <div @click="openAds" :style="bgImg" class="station-background-image">
    <div class="flex">
      <div
        class="flex sponsored-container shadow-lg justify-center items-center"
      >
        <img class="sponsored-logo" :src="stationLogo" alt="syok" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["backgroundImage", "stationLogo"],
  data() {
    return {};
  },
  computed: {
    bgImg() {
      return {
        "background-image": `url(${this.backgroundImage})`,
      };
    },
  },
  methods: {
    openAds() {
      this.$root.$refs.MainPage.showAds();
    },
  },
};
</script>

<style scoped>
.station-background-image {
  background-size: contain;
  background-position: center;
  width: 100%;
  height: 100%;
}
.sponsored-container {
  background-color: white;
  border-radius: 5px;
  margin: 20px;
  height: 80px;
  width: 85px;
}
.sponsored-logo {
  height: 90%;
  width: 90%;
}
</style>