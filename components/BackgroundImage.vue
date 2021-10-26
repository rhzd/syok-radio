<template>
  <div>
    <div class="flex sponsored-container">
      <div v-for="(el, index) in sponsored" :key="index">
        <div
          class="flex justify-center items-center sponsored-logo-container"
          :class="index !== sponsored.length - 1 ? 'single' : 'single'"
        >
          <a :href="el.link" target="_blank" class="flex justify-center" style="padding: 10px;">
            <img
              class="sponsored-logo"
              :class="index !== sponsored.length - 1 ? 'single' : 'single'"
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
          image: require(`~/assets/images/syok-logo.png`),
          link: "https://syok.my/"
        },
      ],
    };
  },
  methods: {
    openAds() {
      this.$root.$refs.MainPage.showAds();
    },
    fetchImage(size) {
      let image;
      try {
        if (size == "medium") {
          image = this.backgroundImage.find((x) => x.name === 'web_background_md').url;
        } else {
          image = this.backgroundImage.find((x) => x.name === 'web_background_lg').url;
        }
      } catch (error) {
        image = require(`~/assets/images/background-image/fallback-${size}.png`);
      }
      return image;
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
  border-right: solid 0.1px lightgrey;
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
.single {
  border-radius: 10%;
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