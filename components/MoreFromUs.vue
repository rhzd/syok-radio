<template>
  <div>
    <div
      class="header-font text-white"
      :class="moreFromUs.length == 6 ? 'margin-full' : 'margin-normal'"
    >
      MORE FROM US
    </div>
    <div class="max-player">
      <div
        class="flex"
        :class="moreFromUs.length == 6 ? 'margin-full' : 'margin-normal'"
      >
        <div
          class="flex flex-col station-info-container"
          v-for="station in moreFromUs"
          :key="station.stationCode"
        >
          <a :href="`/${station.stationCode}`">
            <div class="station-logo-container">
              <img
                class="station-logo"
                :src="station.images.find((x) => x.name === 'square_image').url"
                :alt="station.name"
              />
            </div>
          </a>
          <a :href="`/${station.stationCode}`" class="station-name-container">
            <div class="station-name text-white">
              {{ station.name.toUpperCase() }}
            </div>
          </a>
        </div>
        <div class="flex flex-col station-info-container">
          <div>
            <div
              @click="$root.$refs.MainPage.toggleStationList()"
              class="station-logo-container flex justify-center items-center"
            >
              <font-awesome-icon
                class="icon"
                icon="th-large"
                :style="{
                  color: stationColor.tertiary,
                  border: `7px ${stationColor.tertiary} solid`,
                }"
              />
            </div>
          </div>
          <div
            @click="$root.$refs.MainPage.toggleStationList()"
            class="station-name-container"
          >
            <div class="station-name text-white">ALL RADIO</div>
          </div>
        </div>
      </div>
    </div>
    <div class="medium-player">
      <div class="flex margin-normal">
        <div
          class="flex flex-col station-info-container"
          v-for="station in moreFromUs.slice(0, 4)"
          :key="station.stationCode"
        >
          <a :href="`/${station.stationCode}`">
            <div class="station-logo-container">
              <img
                class="station-logo"
                :src="station.images.find((x) => x.name === 'square_image').url"
                :alt="station.name"
              />
            </div>
          </a>
          <a :href="`/${station.stationCode}`" class="station-name-container">
            <div class="station-name text-white">
              {{ station.name.toUpperCase() }}
            </div>
          </a>
        </div>
        <div class="flex flex-col station-info-container">
          <div>
            <div
              @click="$root.$refs.MainPage.toggleStationList()"
              class="station-logo-container flex justify-center items-center"
            >
              <font-awesome-icon
                class="icon"
                icon="th-large"
                :style="{
                  color: stationColor.tertiary,
                  border: `7px ${stationColor.tertiary} solid`,
                }"
              />
            </div>
          </div>
          <div
            @click="$root.$refs.MainPage.toggleStationList()"
            class="station-name-container"
          >
            <div class="station-name text-white">ALL RADIO</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["moreFromUs", "stationColor"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.header-font {
  margin-top: 18px;
  margin-bottom: 8px;
  margin-right: 20px;
  letter-spacing: 0.02rem;
  font-size: 18px;
  font-weight: 600;
}
.margin-full {
  margin-left: 42px;
}
.margin-normal {
  margin-left: 15px;
}
.station-info-container {
  margin-right: 10px;
}
.station-logo-container {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.station-logo {
  border-radius: 15px;
  background-color: white;
}
.station-name {
  width: 100px;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  margin-top: 10px;
  line-height: 18px;
}
.icon {
  font-size: 64px;
  padding: 10px;
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
.medium-player {
  display: none;
}
.max-player {
  display: inline;
}
.station-name-container {
  cursor: pointer;
}

@media only screen and (max-width: 1199px) {
  .max-player {
    display: none;
  }
  .medium-player {
    display: inline;
  }
  .header-font {
    margin-top: 11px;
    margin-left: 30px;
    margin-bottom: 4px;
  }
  .margin-normal {
    margin-left: 30px;
  }
  .station-logo-container {
    width: 70px;
    height: 70px;
  }
  .station-name-container {
    display: none;
  }
}
</style>