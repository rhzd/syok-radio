<template>
  <div>
    <div class="header-font text-white font-bold mb-4">RECOMMENDED FOR YOU</div>
    <div class="grid gap-4 grid-cols-6">
      <div v-for="station in recommendedForYou" :key="station.stationCode">
        <a :href="`/${station.stationCode}`">
          <div class="square">
            <div class="content">
              <img class="rounded-2xl" :src="station.logo" />
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["recommendedForYou"],
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
.square:after {
  content: "";
  display: block;
}
.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>