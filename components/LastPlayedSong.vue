<template>
  <div>
    <font-awesome-icon
      @click="$root.$refs.MainPage.toggleLastPlayed()"
      class="icon-close"
      icon="times"
    />
    <div class="header-font">LAST PLAYED SONGS</div>
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
            <div class="title-font">
              {{ el.song.track }}
            </div>
            <div class="artist-font">
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
  font-size: 16px;
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
  color: white;
}
.title-font {
  white-space: nowrap;
  width: 100%;
  overflow-x: clip;
  text-overflow: ellipsis;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}
.artist-font {
  white-space: nowrap;
  width: 100%;
  overflow-x: clip;
  text-overflow: ellipsis;
  letter-spacing: 1px;
  font-weight: 300;
  font-size: 12px;
  color: white;
}
.song-list {
  margin-bottom: 10px;
}
.song-info {
  height: 50px;
  width: 143px;
  margin-left: 11px;
}
.icon-close {
  display: none;
}
@media only screen and (max-width: 1199px) {
  .header-font {
    letter-spacing: 1px;
    font-size: 14px;
    font-weight: 700;
    color: #453232;
  }
  .title-font {
    white-space: nowrap;
    width: 100%;
    overflow-x: clip;
    text-overflow: ellipsis;
    letter-spacing: 1px;
    font-size: 12px;
    font-weight: 700;
    color: #707070;
  }
  .artist-font {
    white-space: nowrap;
    width: 100%;
    overflow-x: clip;
    text-overflow: ellipsis;
    letter-spacing: 1px;
    font-weight: 500;
    font-size: 12px;
    color: #707070;
  }
  .list-container {
    height: 553px;
  }
  .icon-close {
    font-size: 35px;
    left: 87%;
    color: #e30f0f;
    cursor: pointer;
    margin-right: 10px;
    position: absolute;
    display: inline;
  }
}

@media only screen and (max-width: 799px) {
  .list-container {
    height: 503px;
  }
  .player-container {
    background-color: #ed0f0f;
    width: 350px;
    height: 550px;
  }
}
</style>