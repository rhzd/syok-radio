<template>
  <div class="flex flex-col justify-center h-full">
    <button
      style="height: 40px; width: 70px; background-color: white"
      @click="mediaPlayer('play')"
    >
      Play
    </button>
    <button
      style="height: 40px; width: 70px; background-color: white"
      @click="mediaPlayer('pause')"
    >
      Pause
    </button>
    <button
      style="height: 40px; width: 70px; background-color: white"
      @click="mediaPlayer('mute')"
    >
      Mute
    </button>

    <button
      style="height: 40px; width: 70px; background-color: white"
      @click="mediaPlayer('volume')"
    >
      Mute
    </button>
    <input
      type="range"
      :value="volume"
      min="0"
      max="100"
      @input="mediaPlayerVolume"
      :style="{ 'background-size': volume + '%' + '100%' }"
    />
    <div style="">
      <audio
        id="player"
        class="op-player__media"
        :src="stream"
        controls
        playsInline
      ></audio>
    </div>
  </div>
</template>

<script>
import OpenPlayerJS from "openplayerjs";

export default {
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/openplayerjs@latest/dist/openplayer.min.css",
        },
      ],
    };
  },
  data() {
    return {
      stream:
        "https://astro1.rastream.com/hitz.web.hls/playlist.m3u8?authtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzAwNjQ0MjEsImlhdCI6MTYyOTk3ODAyMSwib2lkIjoiZXJhLXlvdXR1YmUifQ.fqxR2MefWiNARgLkpnNA8kXAMRBM_oQpbY6ATrbm6rQ",
      $player: null,
      volume: 100,
    };
  },
  mounted() {
      
    const playButton = {
      icon: "https://banner2.cleanpng.com/20181210/syw/kisspng-computer-icons-scalable-vector-graphics-portable-n-browse-internet-network-svg-png-icon-free-download-5c0ee917c56041.3009306615444810478085.jpg",
      id: "switch",
      title: "Switch to source",
      position: "right",
    };

    this.$player = new OpenPlayerJS("player", {
      controls: {
        layers: {
          left: ["play", "volume"],
          middle: [],
          right: [],
        },
      },
      showLoaderOnInit: false,
      pauseOthers: false,
    });
    this.$player.src = { type: "application/x-mpegURL", src: this.stream };
    console.log(this.$player);
    this.$player.init();
    this.$player
      .getElement()
      .addEventListener("hlsFragParsingMetadata", (event) => {
        let tmp = event.detail.data.frag.title.split("=");
        console.log(tmp);
      });
  },
  methods: {
    mediaPlayer(action) {
      console.log(this.$player.getEvents());
      switch (action) {
        case "play":
            console.log(this.$player.play);
          this.$player.play();
          break;
        case "pause":
            console.log(this.$player.pause);
          this.$player.pause();
          break;
        case "mute":
          console.log(this.$player.muted);
          break;
        case "volume":
            this.$player.volume = 0.2
          console.log(this.$player.volume = 0.2);
          break;
        default:
          break;
      }
    },
    mediaPlayerVolume(event) {
      console.log(event);
      this.$player.volume = event.currentTarget.value / 100;
    },
  },
};
</script>