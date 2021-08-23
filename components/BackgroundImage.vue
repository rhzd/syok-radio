<template>
  <div @click="openAds" :style="bgImg" class="station-background-image">
    <div class="flex sponsored-container">
      <div class="station-logo-container start">
        <img class="station-logo start" :src="stationLogo" alt="syok" />
      </div>
      <div v-for="(el, index) in sponsored" :key="el.name">
        <div
          class="sponsored-logo-container"
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
          name: "celcom",
          image: "https://www.celcom.com.my/assets/celcom_icon.svg",
          link: "https://www.celcom.com.my/",
        },
        {
          name: "goshop",
          image: "https://d3avoj45mekucs.cloudfront.net/rojakdaily/media/jessica-chua/news/2017/nov/astro%20goshop%20e-cod/goshop-logo.jpg",
          link: "https://www.goshop.com.my/",
        },
        {
          name: "celcom",
          image: "https://www.celcom.com.my/assets/celcom_icon.svg",
          link: "https://www.celcom.com.my/",
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