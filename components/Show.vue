<template>
  <div>
    <div class="hidden lg:block mt-5">
      <div class="last-played-container flex flex-wrap overflow-hidden">
        <div class="album-container overflow-hidden">
          <img
            class="rounded-2xl"
            src="https://cdn.static.radioactive.sg/songs/covers/m2-265a861d-43cc-4b19-b03f-86a037e6d133"
          />
        </div>
        <div class="grid grid-rows-3 text-container w-auto overflow-hidden">
          <div class="current-title-font">CURRENT SHOW</div>
          <div class="current-name-font">HITZ MORNING CREW</div>
          <div class="current-time-font">6AM - 10AM</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-start items-center">
      <div class="show-container mt-5 rounded-2xl bg-color">
        <div class="content flex items-center justify-start">
          <div class="image-container">
            <img
              class="rounded-2xl"
              src="https://cdn.static.radioactive.sg/songs/covers/m2-265a861d-43cc-4b19-b03f-86a037e6d133"
            />
          </div>
          <div
            class="
              absolute-div
              text
              grid grid-rows-3
              text-container
              w-auto
              overflow-hidden
            "
          >
            <div class="title-font">UPCOMING SHOW</div>
            <div class="name-font">HITZ MORNING CREW</div>
            <div class="time-font">6AM - 10AM</div>
          </div>
          <font-awesome-icon
            class="absolute-div chevron-up"
            icon="chevron-up"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["stationId"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.last-played-container {
  justify-content: center;
}
.header-font {
  font-size: 1.7vw;
  font-weight: 700;
  line-height: 1vw;
  margin-bottom: 1.5vw;
}
.last-played-img {
  width: 47px;
}
.title-font {
  font-size: 3.4vw;
  font-weight: 800;
  align-self: self-end;
}
.name-font {
  font-size: 3.4vw;
  font-weight: 600;
}
.time-font {
  font-size: 2.7vw;
  font-weight: 600;
  align-self: self-start;
}
.album-container {
  width: 5.3vw;
}
.text-container {
  align-items: center;
  margin-left: 1.2vw;
}
.square {
  width: 60%;
  height: 60%;
}
.bg-color {
  background-color: white;
}

.show-container:after {
  content: "";
  display: block;
  padding-bottom: 25%;
}
.content {
  position: absolute;
  width: 100%;
  height: 100%;
}

.show-container {
  position: relative;
  width: 107%;
  height: 26vw;
}
.image-container {
  position: relative;
  width: 25%;
  left: 5%;
}
.absolute-div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5.3vw;
}
.absolute-div.chevron-up {
  left: 90%;
  color: grey;
  font-size: 4.5vw;
}
.absolute-div.text {
  left: 55%;
}
@media only screen and (min-width: 1024px) {
  .show-container {
    position: relative;
    width: 100%;
    height: 6.9vw;
  }
  .image-container {
    position: relative;
    width: 17%;
    left: 5%;
  }
  .absolute-div.text {
    left: 40%;
  }
  .absolute-div.chevron-up {
    font-size: 1.5vw;
  }
  .current-title-font {
    font-size: 1.2vw;
    color: white;
    line-height: 1vw;
    align-self: self-end;
    font-weight: 700;
  }
  .current-name-font {
    font-size: 1.2vw;
    color: white;
    font-weight: 400;
  }
  .current-time-font {
    font-size: 1vw;
    color: white;
    line-height: 0.5vw;
    font-weight: 400;
    align-self: self-start;
  }
  .title-font {
    font-size: 1vw;
    font-weight: 800;
    line-height: 1.5vw;
    align-self: self-end;
  }
  .name-font {
    font-size: 1vw;
    font-weight: 500;
  }
  .time-font {
    font-size: 1vw;
    font-weight: 500;
    line-height: 0.7vw;
    align-self: self-start;
  }
}
</style>