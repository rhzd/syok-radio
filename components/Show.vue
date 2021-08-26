<template>
  <div>
    <div v-if="station.shows">
      <div key="1" v-if="open">
        <div
          class="
            flex flex-col
            justify-start
            items-center
            bg-white
            shows-container-open
          "
        >
          <div>
            <font-awesome-icon
              @click="open = !open"
              class="chevron chevron-down"
              icon="chevron-down"
            />
          </div>
          <div class="flex w-full">
            <div class="show-image-container">
              <img
                class="show-image"
                :src="station.shows.currentShow.image"
                :alt="station.shows.currentShow.name"
              />
            </div>
            <div class="flex flex-col justify-start">
              <div class="title-font">CURRENT SHOW</div>
              <div class="name-font">
                {{ station.shows.currentShow.name.toUpperCase() }}
              </div>
              <div class="showtime-font">
                {{
                  `${station.shows.currentShow.startTime} - ${
                    station.shows.currentShow.endTime
                  }, ${station.shows.currentShow.day.toUpperCase()}`
                }}
              </div>
            </div>
          </div>
          <hr class="spacing" />
          <div
            class="
              flex flex-col
              justify-start
              w-full
              overflow-y-auto
              upcoming-shows-container
            "
          >
            <div class="upcoming-title-font">UPCOMING SHOWS</div>
            <div
              class="flex show-list-container"
              v-for="(show, index) in station.shows.upcomingShow"
              :key="index"
            >
              <div class="show-image-container">
                <img class="show-image" :src="show.image" :alt="show.name" />
              </div>
              <div class="flex flex-col justify-center">
                <div class="names-font">{{ show.name.toUpperCase() }}</div>
                <div class="showtime-font">
                  {{
                    `${show.startTime} - ${
                      show.endTime
                    }, ${show.day.toUpperCase()}`
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="
            flex flex-col
            justify-start
            items-center
            bg-white
            shows-container
          "
        >
          <div>
            <font-awesome-icon
              @click="open = !open"
              class="chevron chevron-up"
              icon="chevron-up"
            />
          </div>
          <div class="flex w-full">
            <div class="show-image-container">
              <img
                class="show-image"
                :src="station.shows.currentShow.image"
                :alt="station.shows.currentShow.name"
              />
            </div>
            <div class="flex flex-col justify-start">
              <div class="title-font">CURRENT SHOW</div>
              <div class="name-font">
                {{ station.shows.currentShow.name.toUpperCase() }}
              </div>
              <div class="showtime-font">
                {{
                  `${station.shows.currentShow.startTime} - ${
                    station.shows.currentShow.endTime
                  }, ${station.shows.currentShow.day.toUpperCase()}`
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="
          flex flex-col
          justify-start
          items-center
          bg-white
          shows-container
          max-player
        "
      >
        <div class="station-name" :style="{ color: station.color.secondary }">
          {{ station.name.toUpperCase() }}
        </div>
        <div class="station-desc">{{ station.description.toUpperCase() }}</div>
      </div>
      <div
        class="flex flex-col justify-start items-center bg-white medium-player"
        :class="hover ? 'show-container-hover' : 'shows-container'"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <font-awesome-icon
          @click="hover = !hover"
          class="chevron chevron-up"
          :icon="hover ? 'chevron-down' : 'chevron-up'"
        />
        <div class="station-name" :style="{ color: station.color.secondary }">
          {{ station.name.toUpperCase() }}
        </div>
        <div class="station-desc">{{ station.description.toUpperCase() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["station"],
  data() {
    return {
      open: false,
      hover: false,
    };
  },
  computed: {
    showToggle() {
      return this.open ? "shows-container-open" : "shows-container";
    },
  },
  methods: {},
};
</script>

<style scoped>
.shows-container {
  height: 120px;
  border-radius: 20px 20px 0px 0px;
}
.shows-container-open {
  height: 680px;
  position: relative;
  top: -560px;
  border-radius: 20px 20px 0px 0px;
}
.show-container-hover {
  position: relative;
  top: -100px;
  height: 130px;
  border-radius: 20px 20px 0px 0px;
}
.show-image-container {
  height: 80px;
  width: 80px;
  background-color: darkgrey;
  border-radius: 6px;
  margin-left: 20px;
  margin-right: 10px;
}
.show-image {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 1px solid lightgrey;
}
.show-list-container {
  margin-bottom: 10px;
}
.title-font {
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 700;
  color: #453232;
  letter-spacing: 1px;
}
.upcoming-shows-container {
  padding-bottom: 8px;
  -ms-overflow-style: none; /* IE and Edge scrollbar hide */
  scrollbar-width: none;
}
.upcoming-shows-container::-webkit-scrollbar {
  /* other scrollbar hide */
  display: none;
}
.upcoming-title-font {
  margin: 0px 20px 13px 20px;
  font-size: 14px;
  font-weight: 700;
  color: #453232;
  letter-spacing: 1px;
}
.name-font {
  font-size: 17px;
  font-weight: 600;
  color: #707070;
  letter-spacing: 0px;
  width: 225px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.names-font {
  font-size: 15px;
  font-weight: 600;
  color: #707070;
  letter-spacing: 0px;
  width: 225px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.showtime-font {
  font-size: 14px;
  font-weight: 400;
  color: #707070;
  line-height: 8px;
}
.station-name {
  margin-top: 25px;
  font-size: 18px;
  font-weight: 700;
}
.station-desc {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  width: 88%;
  color: #707070;
}
.chevron {
  font-size: 23px;
  color: #b1b1b1;
  margin-bottom: 2px;
  margin-top: 2px;
  cursor: pointer;
}
.chevron-up {
  margin-top: 2px;
}
.chevron-down {
  margin-top: 8px;
}
hr.spacing {
  border-top: 1px solid lightgrey;
  width: 330px;
  margin-top: 13px;
  margin-bottom: 20px;
}
.medium-player {
  display: none;
}

@media only screen and (max-width: 1199px) {
  .max-player {
    display: none;
  }
  .medium-player {
    display: flex;
  }
  .shows-container-open {
    height: 580px;
    position: relative;
    top: -550px;
    border-radius: 20px 20px 0px 0px;
  }
}

@media only screen and (max-width: 799px) {
  .shows-container-open {
    height: 550px;
    position: relative;
    top: -520px;
    border-radius: 20px 20px 0px 0px;
  }
}
</style>