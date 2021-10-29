<template>
  <div class="flex flex-col justify-start items-center">
    <div class="flex flex-col justify-start items-center height-container">
      <div class="header-font text-white max-player">NOW PLAYING</div>
      <div class="flex min-player items-center justify-between">
        <div class="flex flex-col">
          <div class="now-playing-min-font text-white">NOW PLAYING</div>
          <div class="station-font text-white">{{ stationData.name }}</div>
        </div>
        <div class="flex button-container">
          <font-awesome-icon
            v-if="gotPlayoutHistory"
            @click="toggleLastPlayed"
            class="icon bars"
            icon="bars"
            :style="{ color: stationColor.tertiary }"
          />
          <font-awesome-icon
            @click="toggleStationList"
            class="icon th-large"
            icon="th-large"
            :style="{ color: stationColor.tertiary }"
          />
        </div>
      </div>
      <div class="flex med-player items-center justify-between">
        <div class="flex flex-col">
          <div class="header-font text-white">NOW PLAYING</div>
        </div>
        <div class="flex button-container">
          <font-awesome-icon
            v-if="gotPlayoutHistory"
            @click="toggleLastPlayed"
            class="icon bars text-white"
            icon="bars"
            :style="{ color: stationColor.tertiary }"
          />
        </div>
      </div>
      <img
        class="square"
        alt="Current song"
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
    </div>
    <div
      key="1"
      v-if="!shareActive"
      class="flex media-player items-center justify-between"
      :style="{ 'background-color': stationColor.secondary }"
    >
      <div v-if="loading">
        <button class="bg-white rounded-full btn-circle" aria-label="loading">
          <font-awesome-icon
            class="icon spinner"
            icon="spinner"
            :style="{ color: stationColor.secondary }"
          />
        </button>
      </div>
      <div v-else>
        <button
          class="bg-white rounded-full btn-circle"
          aria-label="play"
          v-show="paused"
          @click="play"
        >
          <font-awesome-icon
            class="icon play"
            icon="play"
            :style="{ color: stationColor.secondary }"
          />
        </button>
        <button
          class="bg-white rounded-full btn-circle"
          aria-label="pause"
          v-show="playing"
          @click="pause"
        >
          <font-awesome-icon
            class="icon stop"
            icon="stop"
            :style="{ color: stationColor.secondary }"
          />
        </button>
      </div>

      <div v-if="isHlsSupported" class="flex items-center">
        <div class="volume-icon-container">
          <font-awesome-icon
            v-if="volume == 0"
            class="icon volume"
            icon="volume-mute"
            @click="unmute"
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
      class="flex media-player items-center justify-between"
      :style="{ 'background-color': stationColor.secondary }"
    >
      <div class="flex">
        <button
          @click="shareFacebook"
          aria-label="share to facebook"
          class="rounded-full share-btn-circle"
        >
          <font-awesome-icon
            class="share-icon facebook"
            :icon="['fab', 'facebook-f']"
          />
        </button>
        <button
          @click="shareTwitter"
          aria-label="share to twitter"
          class="rounded-full share-btn-circle"
        >
          <font-awesome-icon
            class="share-icon twitter"
            :icon="['fab', 'twitter']"
          />
        </button>
        <button
          v-if="$device.isMobile"
          @click="shareWhatsapp"
          aria-label="share to whatsapp"
          class="rounded-full share-btn-circle"
        >
          <font-awesome-icon
            class="share-icon whatsapp"
            :icon="['fab', 'whatsapp']"
          />
        </button>
        <button
          @click="shareLink"
          aria-label="copy link"
          class="rounded-full share-btn-circle"
        >
          <font-awesome-icon class="share-icon link" icon="link" />
        </button>
      </div>
      <font-awesome-icon
        class="icon times"
        icon="times"
        @click="shareActive = !shareActive"
      />
    </div>
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
          defer: true,
        },
        {
          src: "https://cdn.adswizz.com/adswizz/js/SynchroClient2.js",
          defer: true,
        },
      ],
    };
  },
  props: [
    "stationData",
    "streamToken",
    "host",
    "gotPlayoutHistory",
    "stationColor",
  ],
  data() {
    return {
      loading: true,
      paused: true,
      shareActive: false,
      volume: 100,
      audio: null,
      currentMetadata: null,
      isHlsSupported: false,
    };
  },
  mounted() {
    this.audio = this.$refs["audio"];
    this.audio.volume = 1;
    const uri_component = encodeURIComponent(
      `companionads:true;tags:radioactive;stationid:${this.stationData.stationCode}`
    );
    const lang = encodeURIComponent(`["${this.stationData.language}"]`);
    const listenerId = com_adswizz_synchro_getListenerId();
    let stream;
    if (this.stationData.streams[0].endpoint.includes("rastream")) {
      stream = `${this.stationData.streams[0].endpoint}?authtoken=${this.streamToken}&awparams=${uri_component}&listenerid=${listenerId}&lan=${lang}&setLanguage=true`;
    } else {
      stream = null;
    }

    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(stream);
      hls.attachMedia(this.audio);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        this.audio.play();
      });
      hls.on(Hls.Events.FRAG_PARSING_METADATA, (event, data) => {
        console.log(data["frag"]["title"].split("="));

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
          } else if (tmp.length == 4 && tmp[3].toString()[1] === "%") {
            try {
              dict["data"] = JSON.parse(
                decodeURIComponent(tmp[3].substring(1, tmp[3].length - 1))
              );
            } catch (err) {
              console.error("Metadata Parsing Error", err);
              console.error(decodeURIComponent(tmp[3].replace('"', "")));
            }
          }
          if (dict.data) {
            if (this.currentMetadata) {
              if (dict.data.current_song.track !== this.currentMetadata.track) {
                this.$nuxt.$emit("fetchPlayoutHistory", dict.data.current_song);
              }
            } else {
              this.$nuxt.$emit("fetchPlayoutHistory", dict.data.current_song);
            }
            this.currentMetadata = dict.data ? dict.data.current_song : null;
          }
        }
      });
    } else {
      this.isHlsSupported = false;
      this.audio.src = stream;
      this.loading = false;
      this.audio.addEventListener("loadedmetadata", function (event) {
        this.audio.play();
      });
    }
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
      this.loading = false;
      if (Hls.isSupported()) {
        this.isHlsSupported = true;
      } else {
        this.isHlsSupported = false;
      }
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
    unmute() {
      this.audio.volume = 1;
      this.volume = 100;
    },
    toggleLastPlayed() {
      this.$root.$refs.MainPage.toggleLastPlayed();
    },
    toggleStationList() {
      this.$root.$refs.MainPage.toggleStationList();
    },
    shareTwitter() {
      window.open(
        `https://twitter.com/intent/tweet?text=I%20am%20listening%20to%20${this.stationData.name}.%20Stream%20us%20online%20now.%20${this.host}`,
        "Twitter",
        "width=500,height=350"
      );
    },
    shareFacebook() {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${this.host}`,
        "Facebook",
        "width=500,height=350"
      );
    },
    shareWhatsapp() {
      window.open(
        `whatsapp://send?text=I am listening to ${this.stationData.name}. Stream us online now. ${this.host}`
      );
    },
    shareLink() {
      const tmpTextField = document.createElement("textarea");
      tmpTextField.textContent = this.host;
      document.body.appendChild(tmpTextField);
      tmpTextField.select();
      tmpTextField.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
      tmpTextField.remove();
      alert(`Copied ${this.host} to clipboard!`);
    },
  },
  watch: {},
};
</script>

<style scoped>
.square {
  width: 300px;
  height: 300px;
  background-color: white;
  border-radius: 6px;
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
  height: 100px;
  padding-left: 27px;
  padding-right: 27px;
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
  left: 4%;
  top: 2%;
  position: relative;
}
.icon.stop {
  top: 3%;
  left: 1%;
  position: relative;
}
.icon.spinner {
  top: 3%;
  position: relative;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spinner 2s linear infinite;
}
.icon.volume {
  color: #ffffff;
  cursor: pointer;
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
input[type="range"] {
  -webkit-appearance: none;
  width: 64%;
  position: relative;
  height: 4px;
  background: darkgrey;
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
  box-shadow: 0 0 2px 0 darkgrey;
  transition: background 0.3s ease-in-out;
}

input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 2px 0 darkgrey;
  transition: background 0.3s ease-in-out;
}

input[type="range"]::-ms-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: darkgrey;
  cursor: pointer;
  box-shadow: 0 0 2px 0 darkgrey;
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
.min-player {
  display: none;
}
.med-player {
  display: none;
}
.height-container {
  height: 480px;
}

@media only screen and (max-width: 1199px) {
  .height-container {
    height: 470px;
  }
  .button-container {
    position: relative;
    top: 5px;
    left: 36px;
  }
  .header-font {
    margin-top: 25px;
    margin-bottom: 13px;
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
  }
}

@media only screen and (max-width: 799px) {
  .height-container {
    height: 420px;
  }
  .square {
    width: 250px;
    height: 250px;
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
    line-height: 17px;
    font-size: 18px;
    font-weight: 400;
  }
  .icon.bars {
    cursor: pointer;
    font-size: 32px;
  }
  .icon.th-large {
    cursor: pointer;
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