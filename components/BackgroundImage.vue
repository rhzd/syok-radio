<template>
  <div>
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
    <img
      class="station-background-image max-player"
      :src="fetchImage('large')"
      alt="background image"
      height="480"
      width="850"
    />
    <img
      class="station-background-image med-player"
      :src="fetchImage('medium')"
      alt="background image"
      height="470"
      width="450"
    />
  </div>
</template>

<script>
export default {
  props: ["backgroundImage", "stationLogo", "stationCode"],
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
  methods: {
    openAds() {
      this.$root.$refs.MainPage.showAds();
    },
    fetchImage(size) {
      let image
      try {
        image = require(`~/assets/images/background-image/${size}/${this.stationCode}.png`)
      } catch (error) {
        image = require(`~/assets/images/background-image/${size}/fallback.png`)
      }
      return image
    },
  },
};
</script>

<style scoped>
.max-player {
  display: inline;
}
.med-player {
  display: none;
}
.station-background-image {
  background-color: grey;
}
.sponsored-container {
  padding: 20px;
  position: absolute;
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
@media only screen and (max-width: 1199px) {
  .max-player {
    display: none;
  }
  .med-player {
    display: inline;
  }
}

@media only screen and (max-width: 799px) {
  .max-player {
    display: none;
  }
  .med-player {
    display: none;
  }
}
</style>