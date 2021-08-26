<template>
  <audio class="op-player__media" id="audio" controls>
    <source :src="stream" />
  </audio>
</template>

<script>
import OpenPlayerJS from "openplayerjs";

export default {
  props: ["stream"],
  data() {
    return {
      $player: null,
    };
  },
  mounted() {
    // this.$refs.player.src = this.stream;
    // console.log(this.$refs.player);
    this.$player = new OpenPlayerJS("audio", {
      hls: {
        startLevel: -1,
      },
      showLoaderOnInit: false,
      pauseOthers: true,
    });
    console.log(this.$player);
    this.$player.init();
    this.$player.getElement().addEventListener("hlsFragParsingMetadata", (event) => {
      console.log(event.detail.data.frag.title);
    });

    // this.$player.on(Hls.Events.MANIFEST_PARSED, function () {
    //   video.play();
    // });
  },
};
</script>