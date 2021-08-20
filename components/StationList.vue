<template>
  <div class="flex flex-col">
    <div class="flex close-btn-container justify-end items-center">
      <font-awesome-icon
        v-if="$route.fullPath !== '/'"
        class="icon-close"
        icon="times"
        @click="$root.$refs.MainPage.toggleStationList()"
      />
    </div>
    <div class="flex menu-container max-player">
      <button
        class="btn btn-all"
        @click="picked = 'all'"
        :class="picked == 'all' ? 'selected' : 'not-selected'"
      >
        ALL RADIO
      </button>
      <button
        class="btn btn-lang"
        @click="picked = 'en'"
        :class="picked == 'en' ? 'selected' : 'not-selected'"
      >
        ENGLISH
      </button>
      <button
        class="btn btn-lang"
        @click="picked = 'ms'"
        :class="picked == 'ms' ? 'selected' : 'not-selected'"
      >
        MALAY
      </button>
      <button
        class="btn btn-lang"
        @click="picked = 'zh'"
        :class="picked == 'zh' ? 'selected' : 'not-selected'"
      >
        CHINESE
      </button>
      <button
        class="btn btn-lang"
        @click="picked = 'ta'"
        :class="picked == 'ta' ? 'selected' : 'not-selected'"
      >
        TAMIL
      </button>
      <div class="search-container">
        <font-awesome-icon class="icon" icon="search" />
        <input v-model="search" type="text" id="search" placeholder="SEARCH" />
      </div>
    </div>
    <div class="content-container">
      <div class="flex justify-center min-player-flex">
        <select class="select-bar" v-model="picked">
          <option value="all">ALL RADIO</option>
          <option value="en">ENGLISH</option>
          <option value="ms">MALAY</option>
          <option value="zh">CHINESE</option>
          <option value="ta">TAMIL</option>
        </select>
      </div>
      <div class="info-font max-player">CLICK ON ANY RADIO BELOW TO PLAY:</div>
      <div class="flex flex-wrap station-container">
        <div v-for="station in filteredList" v-bind:key="station.name">
          <div class="station-image-container">
            <a :href="`/${station.stationCode}`"
              ><img class="station-image" :src="station.logo" :alt="station.name"
            /></a>
          </div>
          <div class="flex flex-wrap justify-center">
            <div class="station-font">{{ station.name.toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["stationList"],
  data() {
    return {
      picked: "all",
      search: "",
      selectedStation: [],
    };
  },
  mounted() {
    this.selectedStation = this.stationList.filter((station) => {
      return station.language.toLowerCase();
    });
  },
  methods: {},
  computed: {
    filteredList() {
      return this.selectedStation.filter((station) => {
        return station.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  watch: {
    picked: function (val) {
      if (val !== "all") {
        this.selectedStation = this.stationList.filter((station) => {
          return station.language.toLowerCase().includes(val.toLowerCase());
        });
      } else {
        this.selectedStation = this.stationList.filter((station) => {
          return station.language.toLowerCase();
        });
      }
    },
  },
};
</script>

<style scoped>
.content-container {
  height: 567px;
  overflow: hidden;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge scrollbar hide */
  scrollbar-width: none;
}
.content-container::-webkit-scrollbar {
  /* other scrollbar hide */
  display: none;
}
.search-container {
  vertical-align: middle;
  white-space: nowrap;
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
}
.search-container input#search {
  height: 55px;
  background: white;
  border: none;
  font-size: 16px;
  float: left;
  color: #63717f;
  padding-left: 45px;
  border-radius: 10px;
  width: 200px;
  padding-right: 15px;
}

input[type="text"]:focus {
  outline: none;
}

.search-container input#search::-webkit-input-placeholder {
  color: #65737e;
}

.search-container input#search:-moz-placeholder {
  /* Firefox 18- */
  color: #65737e;
}

.search-container input#search::-moz-placeholder {
  /* Firefox 19+ */
  color: #65737e;
}

.search-container input#search:-ms-input-placeholder {
  color: #65737e;
}
.search-container .icon {
  position: absolute;
  top: 6%;
  margin-left: 17px;
  margin-top: 17px;
  z-index: 1;
  color: rgb(234, 0, 41);
}
.menu-container {
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 18px;
}
.info-font {
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 18px;
  margin-bottom: 18px;
  color: white;
  font-weight: 600;
  font-size: 19px;
}
.close-btn-container {
  height: 60px;
}
.icon-close {
  font-size: 35px;
  color: white;
  cursor: pointer;
  margin-right: 20px;
}
.station-image-container {
  width: 100px;
  height: 100px;
  background-color: grey;
  border-radius: 16px;
  margin: 20px 20px 10px 20px;
}
.station-image {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 16px;
}
.station-container {
  margin: 0px 40px 30px 40px;
}
.station-font {
  width: 100px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 10px;
}
.btn {
  height: 55px;
  font-size: 20px;
  border-radius: 10px;
  margin-right: 10px;
  margin-left: 10px;
}
.btn-all {
  width: 200px;
}
.btn-lang {
  width: 150px;
}
.selected {
  background-color: white;
  color: rgb(234, 0, 41);
  font-weight: 800;
}
.not-selected {
  font-weight: 700;
  background-color: rgb(234, 0, 41);
  color: white;
  border: 1px solid white;
}
.min-player-flex {
  display: none;
}
.min-player {
  display: none;
}

@media only screen and (max-width: 1199px) {
  .station-image-container {
    width: 100px;
    height: 100px;
    background-color: grey;
    border-radius: 16px;
    margin: 20px 14px 10px 14px;
  }
  .station-font {
    margin-bottom: 0px;
  }
  .station-container {
    margin: 0px 15px 30px 15px;
  }
  .content-container {
    height: 467px;
    overflow: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .info-font {
    margin-left: 30px;
    margin-right: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: white;
    font-weight: 600;
    font-size: 19px;
  }
  .menu-container {
    margin-left: 25px;
    margin-right: 25px;
    margin-bottom: 18px;
  }
  .btn-all {
    width: 150px;
  }
  .btn-lang {
    width: 100px;
  }
  .btn {
    height: 55px;
    font-size: 18px;
    border-radius: 10px;
    margin-right: 5px;
    margin-left: 5px;
  }
}

@media only screen and (max-width: 799px) {
  .station-container {
    margin: 0px 10px 30px 10px;
  }
  .station-image-container {
    width: 100px;
    height: 100px;
    background-color: grey;
    border-radius: 16px;
    margin: 20px 5px 10px 5px;
  }
  .min-player-flex {
    display: flex;
  }
  .min-player {
    display: inline;
  }
  .max-player {
    display: none;
  }
  .player-container {
    background-color: #ed0f0f;
    width: 350px;
    height: 550px;
  }
  .select-bar {
    width: 280px;
    height: 55px;
    background-color: rgb(234, 0, 41);
    border-radius: 10px;
    border: 2px solid white;
    color: white;
  }
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }
  .content-container {
    height: 490px;
  }
}
</style>