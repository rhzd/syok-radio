<template>
  <div :style="bgImg" class="station-background-image"></div>
</template>

<script>
export default {
  props: ["backgroundImage"],
  data() {
    return {};
  },
  computed: {
    bgImg() {
      return {
        "background-image": `url(${this.backgroundImage})`,
      };
    },
  },
};
</script>

<style scoped>
.station-background-image {
  background-size: cover;
  background-position: center;
  width: 96%;
  height: 92%;
  border-radius: 39px;
  background-size: 52%;
}
</style>