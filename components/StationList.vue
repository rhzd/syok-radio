<template>
  <div class="list-container">
    <div class="mt-4">
      <div class="flex justify-between">
        <div class="self-center">
          <input type="radio" value="all" v-model="picked" />
          <label for="all">ALL RADIO</label>
          <input type="radio" value="ms" v-model="picked" />
          <label for="ms">ENGLISH</label>
          <input type="radio" value="en" v-model="picked" />
          <label for="en">MALAY</label>
          <input type="radio" value="zh" v-model="picked" />
          <label for="zh">CHINESE</label>
          <input type="radio" value="ta" v-model="picked" />
          <label for="ta">TAMIL</label>
        </div>
        <div>
          <input
            class="search-bar"
            type="text"
            v-model="search"
            placeholder="Search Here"
          />
        </div>
      </div>
    </div>
    <div class="grid gap-4 grid-cols-8 mt-7">
      <div v-for="station in filteredList" v-bind:key="station.name">
        <a :href="`/${station.stationCode}`">
          <div class="square">
            <div class="">
              <img class="rounded-xl" :src="station.logo" />
            </div>
          </div>
        </a>
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
    // this.selectedStation = this.stationList;
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
.square {
  position: relative;
  width: 100%;
  cursor: pointer;
}
label {
  color: white;
  margin-right: 4vw;
  font-weight: 800;
}
.search-bar {
  width: 30vw;
  height: 38px;
  padding-left: 16px;
  border-radius: 8px;
}
.list-container {
  margin: 20px;
}
</style>