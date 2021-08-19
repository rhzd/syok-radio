<template>
  <div v-if="stationData" class="flex my-container">
    <div class="left-panel overflow-hidden shadow-2xl">
      <RadioPlayer :streamToken="streamToken" :stationData="stationData" />
      <Show
        :showsData="showsData"
        :stationName="stationData.name"
        :stationDesc="stationData.description"
      />
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
        />
      </div>
      <div class="flex other-info overflow-hidden">
        <div v-if="playoutHistory.length > 0" class="last-played-song">
          <LastPlayedSong
            :squareImage="
              stationData.images.find((x) => x.name === 'square_image').url
            "
            :playoutHistory="playoutHistory"
          />
        </div>
        <div
          :class="
            playoutHistory.length > 0 ? 'more-from-us' : 'more-from-us-full'
          "
        >
          <MoreFromUs :moreFromUs="moreFromUs" />
        </div>
      </div>
    </div>
    <div v-if="ads" id="overlay-ad" @click="hideAds">
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
</template>

<script>
export default {
  head() {
    return {
      title: this.stationData.name,
      meta: [
        { hid: "title", property: "title", content: this.stationData.name },
        {
          hid: "description",
          property: "description",
          content: this.stationData.description,
        },
        { hid: "robots", property: "robots", content: "index, follow" },

        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "og:url", property: "og:url", content: this.host },
        {
          hid: "og:title",
          property: "og:title",
          content: this.stationData.name,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.stationData.description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.stationData.images.find(
            (x) => x.name === "landscape_image"
          ).url,
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
          content: this.stationData.name,
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: this.stationData.description,
        },
        {
          hid: "twitter:image",
          property: "twitter:image",
          content: this.stationData.images.find(
            (x) => x.name === "landscape_image"
          ).url,
        },
      ],
    };
  },
  async asyncData({
    $config: { syokUsername, syokPassword, syokURL, baseURL },
    $axios,
    error,
    params,
    req,
  }) {
    try {
      const streamToken = await $axios.$get(`${baseURL}/api/get-token`);
      $axios.setHeader(
        "Authorization",
        `Basic ${Buffer.from(`${syokUsername}:${syokPassword}`).toString(
          "base64"
        )}`
      );
      const syokToken = await $axios.$post(`${syokURL}/authenticate`);
      $axios.setHeader("Authorization", `Bearer ${syokToken.data}`);
      const stationData = await $axios.$get(
        `${syokURL}/radio/streams/${params.id}`
      );

      let playoutHistory = null;
      if (
        stationData.data.externalLinks.find((x) => x.key === "playoutHistory")
      ) {
        playoutHistory = await $axios.$get(
          `${
            stationData.data.externalLinks.find(
              (x) => x.key === "playoutHistory"
            ).url
          }`
        );
      }

      let moreFromUs = [];
      if (stationData.data.language !== "en") {
        let stationListTemp = await $axios.$get(
          `${syokURL}/radio/stations?language=${stationData.data.language}`
        );
        stationListTemp.data.forEach((el) => {
          moreFromUs.push(el);
        });
      }
      let stationListTemp = await $axios.$get(
        `${syokURL}/radio/stations?language=en`
      );

      stationListTemp.data.forEach((el) => {
        if (el.stationCode !== params.id) {
          moreFromUs.push(el);
        }
      });

      let shows = await $axios
        .$get(`${syokURL}/radio/programmes?stationCode=${params.id}`)
        .catch((error) => {
          console.log(error);
        });

      return {
        streamToken: streamToken.data,
        stationData: stationData.data,
        showsData: shows ? shows.data : [],
        moreFromUs: playoutHistory
          ? moreFromUs.slice(0, 4)
          : moreFromUs.slice(0, 6),
        playoutHistory: playoutHistory ? playoutHistory.data : [],
        host: req.headers.referer,
      };
    } catch (e) {
      console.log(e);
      error(e);
    }
  },
  data() {
    return {
      ads: true,
    };
  },
  created() {
    this.$root.$refs.MainPage = this;
  },
  mounted() {},
  methods: {
    showAds() {
      this.ads = true;
    },
    hideAds() {
      this.ads = false;
    },
  },
};
</script>

<style scoped>
.my-container {
  height: 100%;
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
}

@media only screen and (max-width: 799px) {
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