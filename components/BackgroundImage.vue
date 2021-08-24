<template>
  <div :style="bgImg" class="station-background-image">
    <div class="flex sponsored-container">
      <div class="station-logo-container start">
        <img class="station-logo start" :src="stationLogo" alt="syok" />
      </div>
      <div v-for="(el, index) in sponsored" :key="index">
        <div
          class="flex justify-center items-center sponsored-logo-container"
          :class="index !== sponsored.length - 1 ? 'mid' : 'end'"
        >
          <a :href="el.link" target="_blank" class="flex justify-center">
            <img
              class="sponsored-logo"
              :class="index !== sponsored.length - 1 ? 'mid' : 'end'"
              :src="el.image"
              :alt="el.name"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["backgroundImage", "stationLogo"],
  data() {
    return {
      sponsored: [
        {
          name: "syok",
          image:
            "https://i1.wp.com/prebiu.com/wp-content/uploads/2021/06/Logo_SYOK.png",
          link: "https://www.syok.my/",
        },
      ],
    };
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
  padding: 20px;
}
.station-logo-container {
  height: 80px;
  width: 80px;
  background-color: white;
}
.sponsored-logo-container {
  height: 80px;
  width: 80px;
  background-color: white;
  cursor: pointer;
}
.sponsored-logo {
  height: 100%;
  width: 100%;
}
.station-logo {
  height: 100%;
  width: 100%;
  border-right: solid 1px lightgrey;
}
.start {
  border-radius: 10% 0% 0% 10%;
}
.mid {
  border-radius: 0% 0% 0% 0%;
}
.end {
  border-radius: 0% 10% 10% 0%;
}
</style>