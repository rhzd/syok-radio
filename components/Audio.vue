<template>
  <audio ref="player" id="player" controls>
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
    this.$ref.player.src = this.stream;
    this.$player = new OpenPlayerJS("player", {
      hls: {
        startLevel: -1,
      },
      showLoaderOnInit: false,
      pauseOthers: false,
    });
    console.log(this.$player);
    this.$player.init();

    // this.$player.on(Hls.Events.MANIFEST_PARSED, function () {
    //   video.play();
    // });
  },
};
</script>