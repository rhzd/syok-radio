<template>
  <div class="flex flex-col justify-start items-center">
    <div class="header-font mt-6 lg:mt-9 text-white">
      NOW PLAYING
    </div>
    <img
      class="mt-5 rounded-xl ring-4 ring-red-500 square"
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
        class="media-player mt-5 rounded-lg bg-color"
      >
        <div class="content flex items-center justify-start">
          <button
            class="ml-2 bg-white btn-circle rounded-full"
            v-show="paused"
            @click="play"
          >
            <font-awesome-icon class="icon play" icon="play" />
          </button>
          <button
            class="ml-2 bg-white btn-circle rounded-full"
            v-show="playing"
            @click="pause"
          >
            <font-awesome-icon class="icon stop" icon="stop" />
          </button>
          <font-awesome-icon class="icon volume" icon="volume-off" />
          <input
            type="range"
            :value="volume"
            min="0"
            max="100"
            @input="volumeChange"
            :style="{ 'background-size': volume + '%' + '100%' }"
          />
          <font-awesome-icon
            class="icon share"
            icon="share-alt"
            @click="shareActive = !shareActive"
          />
        </div>
      </div>
      <div key="2" v-else class="media-player mt-5 rounded-lg bg-white">
        <div class="content flex items-center justify-start">
          <font-awesome-icon class="icon code" icon="code" />
          <font-awesome-icon
            class="icon times"
            icon="times"
            @click="shareActive = !shareActive"
          />
        </div>
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
    let stream = `${this.stationData.streams[0].endpoint}?authtoken=${this.streamToken}`;
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
  },
  watch: {},
};
</script>

<style scoped>
.square {
  width: 60%;
  height: 60%;
  background-color: lightgrey;
  min-height: 47vw;
}
.bg-color {
  background-color: #d31414;
}
.header-font {
  font-size: 8vw;
  margin-top: 2vw;
}
.title-font {
  font-size: 4.3vw;
  margin-top: 4.7vw;
}
.artist-font {
  font-size: 3.7vw;
  font-weight: 300;
}
.media-player {
  position: relative;
  width: 107%;
}
.media-player:after {
  content: "";
  display: block;
  padding-bottom: 24%;
}
.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.btn-circle {
  position: relative;
  width: 19%;
  height: 78%;
}
.icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5.3vw;
}
.icon.play {
  left: 54%;
  color: #c60e0e;
}
.icon.stop {
  left: 50%;
  color: #c60e0e;
}
.icon.volume {
  left: 29%;
  color: #ffffff;
}
.icon.share {
  left: 90%;
  color: #ffffff;
  cursor: pointer;
  font-size: 6.3vw;
}
.icon.times {
  left: 90%;
  color: #000;
  cursor: pointer;
  font-size: 6.3vw;
}
.icon.code {
  left: 13%;
  color: #000;
  font-size: 6.3vw;
}
input[type="range"] {
  -webkit-appearance: none;
  width: 49%;
  left: 11%;
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
@media only screen and (min-width: 1024px) {
  .square {
    width: 50%;
    height: 50%;
    min-height: 14vw;
  }
  .header-font {
    font-size: 2vw;
    font-weight: 700;
    letter-spacing: 0.1rem;
  }
  .title-font {
    font-size: 1.3vw;
    margin-top: 0.7vw;
    letter-spacing: 0.04rem;
    font-weight: 500;
  }
  .artist-font {
    font-size: 1.1vw;
    letter-spacing: 0.05rem;
    font-weight: 300;
  }
  .icon {
    font-size: 1.3vw;
  }
  .icon.share {
    font-size: 2vw;
  }
  .icon.times {
    font-size: 2vw;
  }
  .icon.code {
    font-size: 2vw;
  }
  .media-player {
    width: 90%;
  }
}
</style>