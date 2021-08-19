<template>
  <div>
    <div class="header-font text-white">LAST PLAYED SONGS</div>
    <div class="error-container" v-if="playoutHistory.length < 1">
      <div class="error-box">:(</div>
    </div>
    <div v-else class="list-container overflow-y-auto">
      <div v-for="el in playoutHistory.slice(1)" v-bind:key="el.song.id">
        <div class="flex song-list">
          <div class="rounded album-container">
            <img
              class="rounded album-art"
              :src="el.song.coverUrl ? el.song.coverUrl : squareImage"
            />
          </div>

          <div class="song-info flex flex-col justify-center">
            <div class="title-font text-white">
              {{ el.song.track }}
            </div>
            <div class="artist-font text-white">
              {{ el.song.artist }}
            </div>
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
    return {
      sameSong: false,
    };
  },
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
      if (this.playoutHistory.length == 20) {
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
.list-container {
  margin-top: 5px;
  margin-left: 20px;
  height: 168px;
  -ms-overflow-style: none; /* IE and Edge scrollbar hide */
  scrollbar-width: none;
}
.list-container::-webkit-scrollbar {
  /* other scrollbar hide */
  display: none;
}
.album-container {
  width: 50px;
  height: 50px;
  background-color: lightgrey;
}
.album-art {
  width: 50px;
  height: 50px;
}
.header-font {
  margin-top: 18px;
  margin-bottom: 8px;
  margin-left: 20px;
  margin-right: 20px;
  letter-spacing: 0.02rem;
  font-size: 18px;
  font-weight: 600;
}
.title-font {
  white-space: nowrap;
  width: 100%;
  overflow-x: clip;
  text-overflow: ellipsis;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 600;
}
.artist-font {
  white-space: nowrap;
  width: 100%;
  overflow-x: clip;
  text-overflow: ellipsis;
  letter-spacing: 1px;
  font-weight: 300;
  font-size: 12px;
}
.song-list {
  margin-bottom: 10px;
}
.song-info {
  height: 50px;
  width: 143px;
  margin-left: 11px;
}
</style>