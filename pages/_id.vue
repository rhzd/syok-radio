<template>
  <div :style="{ 'background-color': stationColor.primary }" v-if="stationData">
    <StationList v-show="isOpenStationList" :stationList="stationList" />
    <div v-show="!isOpenStationList" class="flex my-container">
      <div class="left-panel overflow-hidden">
        <RadioPlayer
          :streamToken="streamToken"
          :stationData="stationData"
          :host="host"
          :isPlayoutHistory="isPlayoutHistory"
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
    $config: { syokUsername, syokPassword, syokURL, baseURL },
    $axios,
    error,
    params,
    req,
    $colorChange,
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
      const stationData = await $axios.$get(
        `${syokURL}/radio/streams/${params.id}`
      );

      let streamToken = "";

      if (stationData.data.streams[0].endpoint.includes("revma")) {
        let path = new URL(stationData.data.streams[0].endpoint).pathname;
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
      } else if (stationData.data.streams[0].endpoint.includes("rastream")) {
        let getToken = await $axios
          .$get(`${baseURL}/api/get-token`)
          .catch((error) => {
            console.log(error);
          });
        streamToken = getToken.data;
      }

      // PLAYOUT HISTORY

      let playoutHistory = null;
      if (
        stationData.data.externalLinks &&
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

      // MORE FROM US

      let stationList = await $axios.$get(`${syokURL}/radio/stations`);

      let moreFromUsTemp = [];
      let moreFromUs = [];
      if (stationData.data.language !== "en") {
        stationList.data.forEach((el) => {
          if (
            el.language == stationData.data.language &&
            el.stationCode !== params.id
          ) {
            moreFromUsTemp.push(el);
          }
        });
      }

      stationList.data.forEach((el) => {
        if (el.language == "en" && el.stationCode !== params.id) {
          moreFromUsTemp.push(el);
        }
      });

      let parent = stationList.data
        .find((element) => element.stationCode == params.id)
        .name.toLowerCase()
        .split(" ")[0];

      let mainStation = [];
      let otherStation = [];

      moreFromUsTemp.forEach((el) => {
        if (el.name.toLowerCase().split(" ")[0] == parent) {
          mainStation.push(el);
        } else {
          otherStation.push(el);
        }
      });

      mainStation.sort(function (a, b) {
        return a.name.length - b.name.length;
      });

      moreFromUs = mainStation.concat(otherStation);

      // SHOWS

      let showsTemp = null;

      if (
        stationData.data.externalLinks &&
        stationData.data.externalLinks.find((x) => x.key === "programmes")
      ) {
        showsTemp = await $axios
          .$get(
            stationData.data.externalLinks.find((x) => x.key === "programmes")
              .url
          )
          .catch((error) => {
            console.log(error);
          });
      }

      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let showsFiltered = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
      };
      let d = new Date();
      let dayName = days[d.getDay()];
      let dayNameTomorrow = days[d.getDay() + 1];
      showsTemp.data.forEach((show) => {
        const days = show.Day.split("|");
        days.forEach((el) => {
          showsFiltered[el].push({
            day: el,
            name: show.name,
            image: show.SquareImage,
            startTime: show.StartHour,
            endTime: show.EndHour,
          });
        });
      });

      var time = new Date();
      let minute =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      let formattedTime = time.getHours() + "" + minute;

      let finalShows = [
        ...showsFiltered.Sunday.sort((a, b) => a.startTime - b.startTime),
        ...showsFiltered.Monday.sort((a, b) => a.startTime - b.startTime),
        ...showsFiltered.Tuesday.sort((a, b) => a.startTime - b.startTime),
        ...showsFiltered.Wednesday.sort((a, b) => a.startTime - b.startTime),
        ...showsFiltered.Thursday.sort((a, b) => a.startTime - b.startTime),
        ...showsFiltered.Friday.sort((a, b) => a.startTime - b.startTime),
        ...showsFiltered.Saturday.sort((a, b) => a.startTime - b.startTime),
      ];

      const currentShowIndex = finalShows.findIndex(
        (show) =>
          show.day === dayName &&
          Number(show.startTime) <= Number(formattedTime) &&
          Number(show.endTime) >= Number(formattedTime)
      );

      const noCurrentShowIndex = finalShows.findIndex(
        (show) =>
          show.day == dayName && Number(show.startTime) > Number(formattedTime)
      );

      const noCurrentShowTodayIndex = finalShows.findIndex(
        (show) => show.day == dayNameTomorrow
      );

      let currentShow;

      if (currentShowIndex !== -1) {
        currentShow = finalShows[currentShowIndex];
      } else {
        currentShow = {
          day: "Everyday",
          name: stationData.data.name,
          image: stationData.data.images.find((x) => x.name === "square_image")
            .url,
          startTime: "00:00",
          endTime: "00:00",
        };
      }

      let upcomingShow = [];
      let upcomingShowAfter = [];

      let currentIndex = null;

      if (currentShowIndex !== -1) {
        currentIndex = currentShowIndex;
      } else {
        if (noCurrentShowIndex !== -1) {
          currentIndex = noCurrentShowIndex;
        } else {
          if (noCurrentShowTodayIndex !== -1) {
            currentIndex = noCurrentShowTodayIndex;
          }
        }
      }

      finalShows.forEach((show, index) => {
        let a;
        let b;

        if (show.startTime.toString().length == 1) {
          a = "000" + show.startTime.toString();
        } else if (show.startTime.toString().length == 3) {
          a = "0" + show.startTime.toString();
        } else {
          a = show.startTime.toString();
        }

        if (show.endTime.toString().length == 1) {
          b = "000" + show.endTime.toString();
        } else if (show.endTime.toString().length == 3) {
          b = "0" + show.endTime.toString();
        } else {
          b = show.endTime.toString();
        }

        const divider = ":";
        const position = 2;
        let startTime = [a.slice(0, position), divider, a.slice(position)].join(
          ""
        );
        let endTime = [b.slice(0, position), divider, b.slice(position)].join(
          ""
        );

        let day;
        if (show.day === dayName) {
          day = "Today";
        } else if (show.day === dayNameTomorrow) {
          day = "Tomorrow";
        } else {
          day = show.day;
        }
        show.day = day;
        show.startTime = startTime;
        show.endTime = endTime;
        if (index >= currentIndex) {
          upcomingShow.push(show);
        } else {
          if (show.day !== "Today" && show.day !== "Tomorrow") {
            upcomingShowAfter.push(show);
          }
        }
      });

      upcomingShow = [...upcomingShow, ...upcomingShowAfter];

      let shows = {
        currentShow,
        upcomingShow,
      };

      // STATION COLOR

      let stationColor = {
        primary: "#fb2724",
        secondary: $colorChange("#fb2724", -30),
        tertiary: $colorChange("#fb2724", 100),
      };
      if (
        stationData.data.additionalAttributes &&
        stationData.data.additionalAttributes.stationColor
      ) {
        stationColor.primary =
          stationData.data.additionalAttributes.stationColor[0].webplayer;
        stationColor.secondary = $colorChange(
          stationData.data.additionalAttributes.stationColor[0].webplayer,
          -40
        );
        stationColor.tertiary = $colorChange(
          stationData.data.additionalAttributes.stationColor[0].webplayer,
          100
        );
      }

      return {
        streamToken: streamToken,
        stationData: stationData.data,
        stationColor: stationColor,
        showsData: shows ? shows : null,
        stationList: stationList ? stationList.data : [],
        moreFromUs: playoutHistory
          ? moreFromUs.slice(0, 4)
          : moreFromUs.slice(0, 6),
        playoutHistory: playoutHistory ? playoutHistory.data : [],
        isPlayoutHistory: playoutHistory ? true : false,
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
      defaultStationColor: {
        primary: "#fb2724",
        secondary: "#bc100e",
        flat: "#b41717",
        webplayer: "#a61818",
      },
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