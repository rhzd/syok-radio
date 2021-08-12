<template>
  <div>
    <div class="header-font text-white font-bold mb-4">MORE FROM US</div>
    <div class="grid gap-4 grid-cols-6">
      <div v-for="station in moreFromUs" :key="station.stationCode">
        <a :href="`/${station.stationCode}`">
          <div class="square">
            <div class="content">
              <img class="rounded-2xl" :src="station.logo" />
            </div>
          </div>
        </a>
      </div>
      <a href="/" class="square-btn rounded-2xl">
        <div class="content">
          <font-awesome-icon class="icon grid" icon="th-large" />
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["moreFromUs"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.header-font {
  line-height: 1vw;
  margin-bottom: 1.5vw;
  letter-spacing: 0.02rem;
  font-size: 1.7vw;
  font-weight: 600;
}
.station-box {
  background-color: white;
  width: 100%;
}
.square {
  position: relative;
  width: 100%;
  cursor: pointer;
}
.square-btn {
  position: relative;
  width: 100%;
  border: 0.3vw solid #ef8585;
  cursor: pointer;
}
.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.grid-icon {
  width: 20%;
  padding-bottom: 20%;
  margin: 5% 10%;
  background-color: #6095c9;
  position: relative;
  float: left;
}
.grid-icon:after,
.grid-icon:before {
  content: "";
  position: absolute;
  background-color: #fff;
}
.one:before {
  margin: 0 48%;
  width: 4%;
  height: 100%;
}
.one:after {
  margin: 48% 0;
  height: 4%;
  width: 100%;
}
.icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3.3vw;
}
.icon.grid {
  color: #ef8585;
}
</style>