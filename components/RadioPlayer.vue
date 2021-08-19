<template>
  <div class="flex flex-col justify-start items-center">
    <div class="header-font text-white max-player">NOW PLAYING</div>
    <div class="flex min-player items-center justify-between">
      <div class="flex flex-col">
        <div class="now-playing-min-font text-white">NOW PLAYING</div>
        <div class="station-font text-white">HITZ</div>
      </div>
      <div class="flex button-container">
        <font-awesome-icon
          @click="toggleLastPlayed"
          class="icon bars"
          icon="bars"
        />
        <font-awesome-icon
          @click="toggleStationList"
          class="icon th-large"
          icon="th-large"
        />
      </div>
    </div>
    <div class="flex med-player items-center justify-between">
      <div class="flex flex-col">
        <div class="header-font text-white">NOW PLAYING</div>
      </div>
      <div class="flex button-container">
        <font-awesome-icon
          @click="toggleLastPlayed"
          class="icon bars text-white"
          icon="bars"
        />
      </div>
    </div>
    <img
      class="square"
      :src="
        currentMetadata
          ? currentMetadata.coverUrl
            ? currentMetadata.coverUrl
            : stationData.images[1].url
          : stationData.images[1].url
      "
    />
    <div class="title-font text-white">
      {{ currentMetadata ? currentMetadata.track : stationData.description }}
    </div>
    <div class="artist-font text-white">
      {{ currentMetadata ? currentMetadata.artist : stationData.name }}
    </div>
    <transition name="fade" mode="out-in">
      <div
        key="1"
        v-if="!shareActive"
        class="flex media-player bg-color items-center justify-between"
      >
        <div>
          <button
            class="bg-white rounded-full btn-circle"
            v-show="paused"
            @click="play"
          >
            <font-awesome-icon class="icon play" icon="play" />
          </button>
          <button
            class="bg-white rounded-full btn-circle"
            v-show="playing"
            @click="pause"
          >
            <font-awesome-icon class="icon stop" icon="stop" />
          </button>
        </div>

        <div class="flex items-center">
          <div class="volume-icon-container">
            <font-awesome-icon
              v-if="volume == 0"
              class="icon volume"
              icon="volume-mute"
            />
            <font-awesome-icon
              v-else
              class="icon volume"
              icon="volume-down"
              @click="mute"
            />
          </div>
          <input
            type="range"
            :value="volume"
            min="0"
            max="100"
            @input="volumeChange"
            :style="{ 'background-size': volume + '%' + '100%' }"
          />
        </div>

        <div>
          <font-awesome-icon
            class="icon share"
            icon="share-square"
            @click="shareActive = !shareActive"
          />
        </div>
      </div>
      <div
        key="2"
        v-else
        class="flex media-player bg-color items-center justify-between"
      >
        <div>
          <button class="rounded-full share-btn-circle">
            <font-awesome-icon
              class="share-icon facebook"
              :icon="['fab', 'facebook-f']"
            />
          </button>
          <button class="rounded-full share-btn-circle">
            <font-awesome-icon
              class="share-icon twitter"
              :icon="['fab', 'twitter']"
            />
          </button>
          <button class="rounded-full share-btn-circle">
            <font-awesome-icon
              class="share-icon whatsapp"
              :icon="['fab', 'whatsapp']"
            />
          </button>
          <button class="rounded-full share-btn-circle">
            <font-awesome-icon class="share-icon link" icon="link" />
          </button>
        </div>
        <font-awesome-icon
          class="icon times"
          icon="times"
          @click="shareActive = !shareActive"
        />
      </div>
    </transition>
    <audio
      ref="audio"
      @canplay="updatePaused"
      @playing="updatePaused"
      @pause="updatePaused"
    ></audio>
  </div>
</template>

<script>
import Hls from "hls.js";

export default {
  head() {
    return {
      script: [
        {
          src: "https://synchrobox.adswizz.com/register2.php",
        },
        {
          src: "https://cdn.adswizz.com/adswizz/js/SynchroClient2.js",
        },
      ],
    };
  },
  props: ["stationData", "streamToken"],
  data() {
    return {
      paused: true,
      shareActive: false,
      volume: 30,
      audio: null,
      currentMetadata: null,
    };
  },
  mounted() {
    let hls = new Hls();
    const uri_component = encodeURIComponent(
      `companionads:true;tags:radioactive;stationid:${this.stationData.stationCode}`
    );
    const lang = encodeURIComponent(`["${this.stationData.language}"]`); //ikut station language
    const listenerId = com_adswizz_synchro_getListenerId(); //get listener id
    let stream = `${this.stationData.streams[0].endpoint}?awparams=${uri_component}&authtoken=${this.streamToken}&listenerid=${listenerId}&lan=${lang}&setLanguage=true`;

    this.audio = this.$refs["audio"];
    this.audio.volume = 0.3;
    hls.loadSource(stream);
    hls.attachMedia(this.audio);
    hls.on(Hls.Events.FRAG_PARSING_METADATA, (event, data) => {
      let dict = {};
      let tmp = data["frag"]["title"].split("=");
      if (tmp.length > 0) {
        if (tmp[0] == "title") {
          dict["title"] = tmp[1].replace(",url", "").replace(/"/g, "").trim();
        }
        if (tmp.length == 3 && tmp[2].toString()[1] === "%") {
          try {
            dict["data"] = JSON.parse(
              decodeURIComponent(tmp[2].substring(1, tmp[2].length - 1))
            );
          } catch (err) {
            console.error("Metadata Parsing Error", err);
            console.error(decodeURIComponent(tmp[2].replace('"', "")));
          }
        }
      }
      if (dict.data) {
        if (this.currentMetadata) {
          if (dict.data.current_song.track !== this.currentMetadata.track) {
            this.$root.$refs.LastPlayedSong.fetchPlayoutHistory(
              dict.data.current_song
            );
          }
        } else {
          this.$root.$refs.LastPlayedSong.fetchPlayoutHistory(
            dict.data.current_song
          );
        }
      }
      this.currentMetadata = dict.data ? dict.data.current_song : null;
    });
  },
  computed: {
    playing() {
      return !this.paused;
    },
  },
  methods: {
    shareToggle() {
      this.shareActive = !this.shareActive;
    },
    volumeChange(event) {
      this.audio.volume = event.currentTarget.value / 100;
      this.volume = event.currentTarget.value;
    },
    updatePaused(event) {
      this.audio = event.target;
      this.paused = event.target.paused;
    },
    play() {
      this.audio.play();
    },
    pause() {
      this.audio.pause();
      this.audio.currentTime = 0;
    },
    mute() {
      this.audio.volume = 0;
      this.volume = 0;
    },
    toggleLastPlayed() {
      this.$root.$refs.MainPage.toggleLastPlayed();
    },
    toggleStationList() {
      this.$root.$refs.MainPage.toggleStationList();
    },
  },
  watch: {},
};
</script>

<style scoped>
.square {
  width: 300px;
  height: 300px;
  background-color: lightgrey;
  border-radius: 6px;
}
.bg-color {
  background-color: #d31414;
}
.header-font {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 40px;
  margin-bottom: 8px;
}
.now-playing-min-font {
  font-size: 18px;
  margin-top: 8px;
  letter-spacing: 0px;
  font-weight: 600;
}
.title-font {
  font-size: 18px;
  margin-top: 8px;
  letter-spacing: 0px;
  font-weight: 600;
  width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
}
.artist-font {
  font-size: 18px;
  font-weight: 300;
  margin-top: -2px;
  text-align: center;
  width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.media-player {
  width: 100%;
  margin-top: 33px;
  height: 100px;
  padding-left: 27px;
  padding-right: 27px;
}
.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.share-btn-circle {
  width: 50px;
  height: 50px;
  border: solid 1px white;
  margin-right: 6px;
}
.btn-circle {
  width: 70px;
  height: 70px;
}
.icon {
  font-size: 30px;
}
.share-icon {
  font-size: 24px;
  color: white;
}
.share-icon.link {
  position: relative;
  top: 2px;
}
.share-icon.whatsapp {
  position: relative;
  top: 2px;
}
.share-icon.twitter {
  position: relative;
  top: 2px;
}
.share-icon.facebook {
  position: relative;
  top: 2px;
}
.icon.play {
  color: #ed0f0f;
  left: 4%;
  top: 2%;
  position: relative;
}
.icon.stop {
  color: #ed0f0f;
  top: 2%;
  position: relative;
}
.icon.volume {
  color: #ffffff;
}
.icon.volume-mute {
  color: #ffffff;
}
.volume-icon-container {
  width: 35px;
  top: 2px;
  position: relative;
  margin-left: 10px;
}
.icon.share {
  color: #ffffff;
  cursor: pointer;
}
.icon.times {
  left: 90%;
  color: #ffffff;
  cursor: pointer;
  margin-right: 10px;
}
.icon.code {
  left: 13%;
  color: #ffffff;
}
input[type="range"] {
  -webkit-appearance: none;
  width: 64%;
  position: relative;
  height: 4px;
  background: #e05b5b;
  border-radius: 5px;
  background-image: linear-gradient(#fff, #fff);
  background-repeat: no-repeat;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #e05b5b;
  transition: background 0.3s ease-in-out;
}

input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #e05b5b;
  transition: background 0.3s ease-in-out;
}

input[type="range"]::-ms-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #ff4500;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #e05b5b;
  transition: background 0.3s ease-in-out;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #fff;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #fff;
}

input[type="range"]::-ms-thumb:hover {
  background: #fff;
}

/* Input Track */
input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}

input[type="range"]::-moz-range-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}

input[type="range"]::-ms-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.min-player {
  display: none;
}
.med-player {
  display: none;
}

@media only screen and (max-width: 1199px) {
  .button-container {
    position: relative;
    top: 5px;
    left: 36px;
  }
  .header-font {
    margin-top: 25px;
    margin-bottom: 13px;
  }
  .media-player {
    margin-top: 33px;
  }
  .med-player {
    display: flex;
  }
  .min-player {
    display: none;
  }
  .max-player {
    display: none;
  }
  .icon.bars {
    cursor: pointer;
    font-size: 32px;
    color: #f68787;
  }
}

@media only screen and (max-width: 799px) {
  .square {
    width: 250px;
    height: 250px;
  }
  .right-panel {
    display: none;
  }
  .media-player {
    margin-top: 36px;
  }
  .min-player {
    display: flex;
    height: 80px;
    width: 250px;
  }
  .med-player {
    display: none;
  }
  .max-player {
    display: none;
  }
  .title-font {
    font-size: 18px;
    font-weight: 600;
    margin-top: 3px;
    letter-spacing: 1px;
  }
  .station-font {
    line-height: 11px;
    font-size: 18px;
    font-weight: 400;
  }
  .icon.bars {
    cursor: pointer;
    font-size: 32px;
    color: #f68787;
  }
  .icon.th-large {
    cursor: pointer;
    color: #f68787;
    font-size: 32px;
    margin-left: 18px;
  }
  .button-container {
    position: relative;
    top: 3px;
    left: 28px;
  }
}
</style>