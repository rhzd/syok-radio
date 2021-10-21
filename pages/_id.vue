<template>
  <div :style="{ 'background-color': stationColor.primary }" v-if="stationData">
    <StationList v-show="isOpenStationList" :stationList="stationList" />
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
import jwt from "jsonwebtoken";

export default {
  head() {
    return {
      title: this.stationData.name,
      meta: [
        { hid: "title", property: "title", content: this.stationData.name },
        {
          hid: "description",
          name: "description",
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
    $config: {
      syokUsername,
      syokPassword,
      syokURL,
      baseURL,
      OIDRadioStream,
      JWTRadioStream,
    },
    $axios,
    error,
    params,
    req,
    $colorChange,
    $showsObject,
    $moreFromUsObject,
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
      
      let reStation = []

      const stationList = await $axios.$get(`${syokURL}/radio/streams/groups`);

      stationList.data.forEach((element) => {
        element.stations.forEach((station) => {
          reStation.push(station);
        });
      });

      const stationData = reStation.find(el=> el.stationCode == params.id)

      let streamToken = "";

      if (stationData.streams[0].endpoint.includes("revma")) {
        let path = new URL(stationData.streams[0].endpoint).pathname;
        await fetch(
          `https://www.revma.com/api/stations/${
            path.split("/")[1]
          }/private_stream_token?minutes=1440`,
          {
            headers: {
              "x-auth-token": "1598352525wMVCYpxLcUBjGSkS7dHq",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            streamToken = new URL(data).searchParams.get("rj-auth");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (stationData.streams[0].endpoint.includes("rastream")) {
        let limit = 60 * 60 * 24; // 180 seconds
        let init = Math.floor(Date.now() / 1000);
        let expires = Math.floor(Date.now() / 1000) + limit;
        let payload = {
          exp: expires,
          iat: init,
          oid: OIDRadioStream,
        };
        let token = jwt.sign(payload, Buffer.from(JWTRadioStream, "base64"));
        streamToken = token;
      }

      // PLAYOUT HISTORY

      let playoutHistory = null;
      if (
        stationData.externalLinks &&
        stationData.externalLinks.find((x) => x.key === "playoutHistory")
      ) {
        playoutHistory = await $axios.$get(
          `${
            stationData.externalLinks.find(
              (x) => x.key === "playoutHistory"
            ).url
          }`
        );
      }

      // MORE FROM US

      let moreFromUs = $moreFromUsObject(
        reStation,
        stationData,
        params.id
      );

      // SHOWS

      let showsData = null;
      let shows = null;

      if (
        stationData.externalLinks &&
        stationData.externalLinks.find((x) => x.key === "programmes")
      ) {
        showsData = await $axios
          .$get(
            stationData.externalLinks.find((x) => x.key === "programmes")
              .url
          )
          .catch((error) => {
            console.log(error);
          });
      }

      if (showsData) {
        shows = $showsObject(showsData.data, stationData);
      }

      // STATION COLOR

      let stationColor = {
        primary: "#fb2724",
        secondary: $colorChange("#fb2724", -40),
        tertiary: $colorChange("#fb2724", 100),
      };
      if (
        stationData.additionalAttributes &&
        stationData.additionalAttributes.stationColor
      ) {
        stationColor.primary =
          stationData.additionalAttributes.stationColor[0].webplayer;
        stationColor.secondary = $colorChange(
          stationData.additionalAttributes.stationColor[0].webplayer,
          -40
        );
        stationColor.tertiary = $colorChange(
          stationData.additionalAttributes.stationColor[0].webplayer,
          100
        );
      }

      return {
        streamToken: streamToken,
        stationData: stationData,
        stationCode: stationData.stationCode,
        stationColor: stationColor,
        showsData: shows ? shows : null,
        stationList: reStation ? reStation : [],
        moreFromUs: playoutHistory
          ? moreFromUs.slice(0, 4)
          : moreFromUs.slice(0, 6),
        playoutHistory: playoutHistory ? playoutHistory.data : [],
        gotPlayoutHistory: playoutHistory ? true : false,
        host: `${baseURL}/${params.id}`,
      };
    } catch (e) {
      console.log(e);
      error(e);
    }
  },
  data() {
    return {
      isAds: false,
      isOpenLastPlayed: false,
      isOpenStationList: false,
    };
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