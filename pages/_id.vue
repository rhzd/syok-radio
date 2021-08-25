<template>
  <div :style="{ 'background-color': station.color.primary }" v-if="station">
    <StationList v-show="isOpenStationList" />
    <div v-show="!isOpenStationList" class="flex my-container">
      <div class="left-panel overflow-hidden">
        <RadioPlayer
          :streamToken="streamToken"
          :stationData="stationData"
          :host="host"
          :gotPlayoutHistory="gotPlayoutHistory"
          :stationColor="stationColor"
        />
        <div
          class="custom-bg"
          :style="{
            'background-color': stationColor.secondary,
          }"
        >
          <Show
            v-if="!isOpenLastPlayed"
            :showsData="showsData"
            :stationName="stationData.name"
            :stationDesc="stationData.description"
            :stationColor="stationColor"
            :squareImage="
              stationData.images.find((x) => x.name === 'square_image').url
            "
          />
        </div>
        <div v-if="isOpenLastPlayed" class="last-played-left-panel">
          <LastPlayedSong
            :squareImage="
              stationData.images.find((x) => x.name === 'square_image').url
            "
            :playoutHistory="playoutHistory"
            :stationColor="stationColor"
          />
        </div>
      </div>
      <div class="right-panel overflow-hidden">
        <div class="radio-banner overflow-hidden">
          <BackgroundImage
            :backgroundImage="
              stationData.images.find((x) => x.name === 'background_images').url
            "
            :stationLogo="
              stationData.images.find((x) => x.name === 'square_image').url
            "
            :stationCode="stationCode"
          />
        </div>
        <div class="flex other-info overflow-hidden">
          <div v-if="playoutHistory.length > 0" class="last-played-song">
            <LastPlayedSong
              :squareImage="
                stationData.images.find((x) => x.name === 'square_image').url
              "
              :playoutHistory="playoutHistory"
              :stationColor="stationColor"
            />
          </div>
          <div
            :class="
              playoutHistory.length > 0 ? 'more-from-us' : 'more-from-us-full'
            "
          >
            <MoreFromUs :moreFromUs="moreFromUs" :stationColor="stationColor" />
          </div>
        </div>
      </div>
      <div v-if="isAds" id="overlay-ad" @click="hideAds">
        <div class="wrap">
          <div class="image">
            <a target="_blank" href="/">
              <div class="ad-image-container">
                <!-- <img
                src="https://www.rawshorts.com/blog/wp-content/uploads/2019/10/how-to-use-facebook-video-ads.png"
                class="ad-image"
              /> -->
              </div>
            </a>
            <div>
              <font-awesome-icon
                class="icon-close"
                icon="times"
                @click="hideAds"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.station.name,
      meta: [
        { hid: "title", property: "title", content: this.station.name },
        {
          hid: "description",
          name: "description",
          property: "description",
          content: this.station.description,
        },
        { hid: "robots", property: "robots", content: "index, follow" },

        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "og:url", property: "og:url", content: this.host },
        {
          hid: "og:title",
          property: "og:title",
          content: this.station.name,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.station.description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.station.images.landscapeImage,
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
          content: this.station.name,
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: this.station.description,
        },
        {
          hid: "twitter:image",
          property: "twitter:image",
          content: this.station.images.find(
            (x) => x.name === "landscape_image"
          ).url,
        },
      ],
    };
  },
  data() {
    return {
      isAds: false,
      isOpenLastPlayed: false,
      isOpenStationList: false,
      station: null
    };
  },
  watch: {
    "$route.query": "$fetch",
  },
  async fetch() {
    try {
      const station = await fetch(`http://localhost:3000/api/station/${this.$route.params.id}`).then(
        (res) => res.json()
      );
      this.station = station.data;
      console.log(this.$route.params.id);
      console.log(station);
    } catch (error) {
      throw new Error(error);
    }
  },
  created() {
    this.$root.$refs.MainPage = this;
  },
  mounted() {},
  methods: {
    showAds() {
      this.isAds = true;
    },
    hideAds() {
      this.isAds = false;
    },
    toggleLastPlayed() {
      this.isOpenLastPlayed = !this.isOpenLastPlayed;
    },
    toggleStationList() {
      this.isOpenStationList = !this.isOpenStationList;
    },
  },
};
</script>

<style scoped>
.custom-bg {
  height: 120px;
}
.my-container {
  height: 100%;
  position: relative;
}

.left-panel {
  width: 350px;
  height: 100%;
}

.right-panel {
  height: 100%;
  width: 850px;
}

.radio-banner {
  height: 480px;
}

.other-info {
  height: 220px;
}

.last-played-song {
  width: 260px;
}

.more-from-us {
  width: 590px;
}
.more-from-us-full {
  width: 850px;
}

/* Beyond this is for ads overlay */
#overlay-ad .image {
  position: relative;
}
#overlay-ad {
  position: fixed;
  text-align: center;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 9999;
}
#overlay-ad .wrap {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  height: 100vh;
}
#overlay-ad:before {
  content: "";
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
}
#overlay-ad .icon-close {
  color: #fff;
  cursor: pointer;
  float: right;
  height: 28px;
  width: 32px;
  position: absolute;
  top: 0px;
  right: -43px;
  background: #ed0f0f;
  border-radius: 4px;
  padding: 5px;
}
#overlay-ad .ad-image-container {
  width: 800px;
  height: 600px;
  background-color: grey;
  border-radius: 5px;
}
#overlay-ad .ad-image {
  border-radius: 5px;
}

@media only screen and (max-width: 1199px) {
  #overlay-ad .icon-close {
    top: 10px;
    right: 10px;
  }
  #overlay-ad .ad-image-container {
    border-radius: 0px;
  }
  #overlay-ad .ad-image {
    border-radius: 0px;
  }
  .right-panel {
    height: 100%;
    width: 450px;
  }
  .radio-banner {
    height: 470px;
  }
  .other-info {
    height: 130px;
  }
  .last-played-song {
    display: none;
  }
  .more-from-us {
    width: 450px;
  }
  .last-played-left-panel {
    border-radius: 0px 20px 20px 0px;
    display: inline;
    position: absolute;
    top: 0px;
    background-color: white;
    height: 600px;
    width: 340px;
  }
  .custom-bg {
    height: 30px;
  }
}

@media only screen and (max-width: 799px) {
  .last-played-left-panel {
    top: 0px;
    height: 550px;
  }
  .right-panel {
    display: none;
  }
  #overlay-ad .ad-image-container {
    width: 300px;
    height: 250px;
    background-color: grey;
    border-radius: 0px;
  }
  #overlay-ad .icon-close {
    top: -38px;
    right: 0px;
  }
}
</style>