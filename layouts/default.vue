<template>
  <div class="h-screen flex flex-wrap justify-center content-center">
    <div class="player-container">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.player-container {
  background-color: #ed0f0f;
  width: 1200px;
  height: 700px;
}

@media only screen and (max-width: 1199px) {
  .player-container {
    background-color: #ed0f0f;
    width: 800px;
    height: 600px;
  }
}

@media only screen and (max-width: 799px) {
  .player-container {
    background-color: #ed0f0f;
    width: 350px;
    height: 550px;
  }
}
</style>