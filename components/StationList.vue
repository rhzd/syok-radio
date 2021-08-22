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
      <div>
        <button
          class="btn btn-all"
          @click="picked = { code: 'all', name: 'All Radio' }"
          :class="picked.code == 'all' ? 'selected' : 'not-selected'"
        >
          ALL RADIO
        </button>
      </div>
      <div v-for="lang in languages" :key="lang.code">
        <button
          class="btn btn-lang"
          @click="picked = lang"
          :class="picked.code == lang.code ? 'selected' : 'not-selected'"
        >
          {{ lang.name.toUpperCase() }}
        </button>
      </div>
      <div class="search-container">
        <font-awesome-icon class="icon" icon="search" />
        <input v-model="search" type="text" id="search" placeholder="SEARCH" />
      </div>
    </div>
    <div class="content-container" :class="isDropDown ? 'open' : ''">
      <div
        class="flex justify-center min-player-flex"
        :class="isDropDown ? 'dropdown-open' : ''"
      >
        <div class="select-bar">
          <button
            @click="isDropDown = !isDropDown"
            class="dropdown-btn"
            :class="isDropDown ? 'open' : 'close'"
          >
            {{ picked.name.toUpperCase() }}
          </button>
          <div v-show="isDropDown" class="dropdown-content">
            <div
              v-show="picked.code != 'all'"
              class="flex items-center justify-center dropdown-language"
            >
              <a
                @click="selectStation({ code: 'all', name: 'All Radio' })"
                class="flex items-center"
              >
                ALL RADIO
              </a>
            </div>
            <div v-for="lang in languages" :key="lang.code">
              <div
                v-show="picked.code != lang.code"
                class="flex items-center justify-center dropdown-language"
              >
                <a @click="selectStation(lang)" class="flex items-center">{{
                  lang.name.toUpperCase()
                }}</a>
              </div>
            </div>
            <div class="flex items-center justify-center dropdown-search-bar">
              <input
                id="myInput"
                type="text"
                placeholder="Search.."
                v-model="search"
                v-on:keyup.enter="isDropDown = !isDropDown"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="info-font max-player">CLICK ON ANY RADIO BELOW TO PLAY:</div>
      <div v-if="search == ''">
        <div
          class="flex flex-wrap station-container-main"
          v-for="station in filteredMain()"
          :key="station.name"
        >
          <div class="w-full flex flex-col items-center min-player">
            <div class="flex justify-center">
              <a :href="`/${station.stationCode}`"
                ><img
                  class="station-image-min"
                  :src="station.logo"
                  :alt="station.name"
              /></a>
            </div>
          </div>
          <div class="station-image-main flex flex-col items-center max-player">
            <div class="station-image-container-main">
              <a :href="`/${station.stationCode}`"
                ><img
                  class="station-image"
                  :src="station.logo"
                  :alt="station.name"
              /></a>
            </div>
            <div class="station-font-main">
              {{ station.description }}
            </div>
          </div>
          <div class="flex flex-wrap station-container-main-splinter">
            <div
              class="flex"
              v-for="splinter in filteredSplinter(station.stationCode)"
              :key="splinter.name"
            >
              <div class="splinter-image-container-main">
                <a :href="`/${splinter.stationCode}`"
                  ><img
                    class="station-image"
                    :src="splinter.logo"
                    :alt="splinter.name"
                /></a>
              </div>
              <div class="splinter-font">
                <div class="splinter-name-font">
                  {{ splinter.name.toUpperCase() }}
                </div>
                <div class="splinter-desc-font">
                  {{ splinter.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap station-container">
          <div
            class="flex flex-col items-center"
            v-for="dvr in filteredOther()"
            :key="dvr.name"
          >
            <div class="station-image-container">
              <a :href="`/${dvr.stationCode}`"
                ><img class="station-image" :src="dvr.logo" :alt="dvr.name"
              /></a>
            </div>
            <div class="other-station-font">
              {{ dvr.name.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="flex flex-wrap station-container"
          v-if="filteredSearch.length > 0"
        >
          <div v-for="station in filteredSearch" :key="station.name">
            <div class="station-image-container">
              <a :href="`/${station.stationCode}`"
                ><img
                  class="station-image"
                  :src="station.logo"
                  :alt="station.name"
              /></a>
            </div>
            <div class="flex flex-wrap justify-center">
              <div class="station-font">{{ station.name.toUpperCase() }}</div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex justify-center station-container"
          style="margin: 20px 10px 30px 10px"
        >
          <div class="white-text">No station found</div>
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
      search: "",
      selectedStation: [],
      isDropDown: false,
      picked: { code: "all", name: "All Radio" },
      languages: [
        { code: "en", name: "English" },
        { code: "ms", name: "Malay" },
        { code: "zh", name: "Chinese" },
        { code: "ta", name: "Tamil" },
      ],
      splinterStations: [],
    };
  },
  mounted() {
    this.selectedStation = this.stationList.filter((station) => {
      return station.language.toLowerCase();
    });
    this.splinterStations = this.selectedStation.filter(
      (station) =>
        station.stationCode.includes("-") || station.stationCode.includes("_")
    );
  },
  methods: {
    selectStation(val) {
      this.picked = val;
      this.search = "";
      this.isDropDown = false;
    },
    filteredList() {
      return this.selectedStation.filter((station) => {
        return station.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    filteredMain() {
      return this.filteredList().filter(
        (station) =>
          (!station.stationCode.includes("-") &&
            !station.stationCode.includes("_")) ||
          station.stationCode.includes("amp-melody")
      );
    },
    filteredSplinter(val) {
      return this.splinterStations.filter((station) => {
        return (
          station.stationCode.toLowerCase().includes(val.toLowerCase()) &&
          !station.stationCode.includes("amp-melody")
        );
      });
    },
    filteredOther() {
      let arr = [];
      let final = [];
      this.filteredMain().forEach((element) => {
        let test = this.selectedStation.filter((station) => {
          return station.stationCode
            .toLowerCase()
            .includes(element.stationCode.toLowerCase());
        });
        test.forEach((el) => {
          arr.push(el);
        });
      });
      this.selectedStation.forEach((el) => {
        if (!arr.some((element) => element.stationCode === el.stationCode)) {
          final.push(el);
        }
      });
      return final;
    },
  },
  computed: {
    filteredSearch() {
      return this.selectedStation.filter((station) => {
        return station.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  watch: {
    picked: function (val) {
      if (val.code !== "all") {
        this.selectedStation = this.stationList.filter((station) => {
          return station.language
            .toLowerCase()
            .includes(val.code.toLowerCase());
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
  margin: 0px 5px 10px 5px;
}
.station-image {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 16px;
}
.station-image-container-main {
  width: 100px;
  height: 100px;
  background-color: grey;
  border-radius: 16px;
  margin: 0px 21px 10px 20px;
}
.station-font-main {
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 35px;
  width: 100px;
}
.station-container {
  margin: 30px 45px 60px 55px;
}
.station-container-main {
  margin: 0px 40px 0px 40px;
}
.splinter-font {
  color: white;
  font-size: 14px;
  margin-top: 10px;
  width: 187px;
}
.splinter-name-font {
  font-weight: 600;
}
.splinter-desc-font {
  font-weight: 300;
  margin-top: 5px;
}
.station-container-main-splinter {
  margin: 0px 0px 0px 0px;
  width: 85%;
}
.splinter-image-container-main {
  width: 100px;
  height: 100px;
  background-color: grey;
  border-radius: 16px;
  margin: 0px 10px 10px 20px;
}
.station-image-main {
  background-image: linear-gradient(#e27676 23%, rgba(255, 255, 255, 0) 0%);
  background-position: right;
  background-size: 3px 15px;
  background-repeat: repeat-y;
}
.station-font {
  width: 100px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 10px;
}
.other-station-font {
  width: 100px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
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
  .search-container input#search {
    width: 130px;
  }
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
  .content-container.open {
    overflow-y: hidden;
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
  .station-container-main {
    margin: 0px 10px 0px 10px;
  }
  .splinter-font {
    width: 190px;
  }
  .station-container-main-splinter {
    width: 80%;
  }
  .station-image-container-main {
    margin: 0px 15px 10px 20px;
  }
  .splinter-image-container-main {
    margin: 0px 10px 10px 12px;
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
  .dropdown-open:before {
    content: "";
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
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
    position: relative;
  }
  .dropdown-btn.open {
    background-color: #1f1c1c;
    border-radius: 10px 10px 0px 0px;
  }
  .dropdown-btn.close {
    background-color: rgb(234, 0, 41);
    border-radius: 10px;
  }
  .dropdown-btn {
    width: 100%;
    height: 100%;
    border: 2px solid white;
    color: white;
    font-size: 20px;
    font-weight: 600;
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
  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    position: relative;
    top: -2px;
    background-color: #1f1c1c;
    width: 280px;
    border: 2px solid #fff;
    border-radius: 0px 0px 10px 10px;
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: #fff;
    width: 93%;
    height: 87%;
    border-radius: 5px;
    padding: 15px;
    cursor: pointer;
    font-weight: 300;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: rgb(234, 0, 41);
    font-size: 18px;
    font-weight: 600;
  }
  .dropdown-language {
    border-bottom: 1px white solid;
    height: 60px;
  }
  .dropdown-search-bar {
    height: 60px;
  }
  #myInput {
    box-sizing: border-box;
    background-position: 14px 12px;
    background-repeat: no-repeat;
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #ddd;
    color: black;
    width: 260px;
    height: 40px;
    border-radius: 8px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .station-image-min {
    width: 140px;
    height: 140px;
    cursor: pointer;
    border-radius: 16px;
    margin: 20px;
  }
  .station-container-main-splinter {
    width: 100%;
}
.splinter-font {
    width: 208px;
}
}
</style>