<template>
  <div class="h-full">
    <div class="header-font text-white font-bold mb-4">LAST PLAYED SONGS</div>
    <div class="error-container" v-if="playoutHistory.length < 1">
      <div class="error-box">:(</div>
    </div>
    <div v-else v-for="el in playoutHistory" v-bind:key="el.song.id">
      <div class="grid grid-rows-2 grid-cols-12" style="margin-bottom: 0.5vw">
        <div class="row-span-2 col-span-2">
          <img
            class="rounded album-art"
            :src="el.song.coverUrl ? el.song.coverUrl : squareImage"
          />
        </div>
        <div class="col-span-10" style="align-self: center; margin-left: 0.7vw">
          <div class="title-font">
            {{ el.song.track }}
          </div>
        </div>
        <div class="col-span-10" style="margin-left: 0.7vw">
          <div class="artist-font">
            {{ el.song.artist }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["playoutHistory", "squareImage"],
  data() {
    return {};
  },
  computed: {},
  created() {
    this.$root.$refs.LastPlayedSong = this;
  },
  methods: {
    fetchPlayoutHistory(currentMetadata) {
      if (this.playoutHistory.length > 0) {
        if (currentMetadata) {
          if (currentMetadata.id !== this.playoutHistory[0].song.id) {
            this.playoutHistory.unshift({ song: currentMetadata });
          }
        }
      } else {
        if (currentMetadata) {
          this.playoutHistory.push({ song: currentMetadata });
        }
      }
      if (this.playoutHistory.length == 7) {
        this.playoutHistory.pop();
      }
    },
  },
};
</script>

<style scoped>
.error-container {
  height: 90%;
}
.error-box {
  height: inherit;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -10%;
  font-size: 6vw;
}
.album-art {
  max-width: 90%;
  width: 90%;
  border-radius: 0.5rem;
  border: none;
  background-color: lightgrey;
}
.last-played-container {
  margin-bottom: 0.4vw;
}
.header-font {
  line-height: 1vw;
  margin-bottom: 1.5vw;
  letter-spacing: 0.02rem;
  font-size: 1.7vw;
  font-weight: 600;
}
.last-played-img {
  width: 47px;
}
.title-font {
  line-height: 1vw;
  white-space: nowrap;
  width: 100%;
  overflow-x: clip;
  text-overflow: ellipsis;
  letter-spacing: 0.04rem;
  font-size: 1vw;
  font-weight: 600;
}
.artist-font {
  line-height: 1vw;
  white-space: nowrap;
  width: 100%;
  overflow-x: clip;
  text-overflow: ellipsis;
  letter-spacing: 0.05rem;
  font-weight: 300;
  font-size: 0.9vw;
}
.album-container {
  width: 2.7vw;
}
.text-container {
  align-items: flex-end;
  margin-left: 0.7vw;
}
</style>