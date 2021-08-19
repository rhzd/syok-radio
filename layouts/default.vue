<template>
  <div class="bg-color h-screen flex flex-wrap justify-center content-center">
    <div class="player-container overflow-hidden">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
body {
  font-family: "Poppins", sans-serif;
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
.bg-color {
  background: #f8f8f8;
}
.player-container {
  background-color: #ed0f0f;
  width: 1200px;
  height: 700px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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