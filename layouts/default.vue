<template>
  <div class="bg-color h-screen mobile-friendly">
    <img
      class="header-logo-mobile"
      src="~/assets/images/syok-logo-no-space.png"
      alt="syok"
    />
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
  background-color: #212121;
}
.bg-color {
  background-color: #212121;
  overflow-y: auto;
  overflow-x: hidden;
}
.player-container {
  width: 1200px;
  height: 700px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.header-logo-mobile {
  display: none;
}
.mobile-friendly {
  align-content: flex-start;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 1199px) {
  .player-container {
    width: 800px;
    height: 600px;
  }
}

@media only screen and (max-width: 799px) {
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    touch-action: none;
    overscroll-behavior: none;
    background-color: #212121;
  }
  .player-container {
    width: 350px;
    height: 550px;
  }
  .header-logo-mobile {
    display: block;
    width: 150px;
    margin: 20px 137px;
  }
  .mobile-friendly {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>