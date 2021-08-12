<template>
  <div id="main">
    <div class="fof">
      <h5>{{ error.statusCode }}</h5>
      <br />
      <h1>Oops, {{ error.message }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "error",
};
</script>

<style scoped>
* {
  transition: all 0.6s;
}

html {
  height: 100%;
}

body {
  font-family: "Lato", sans-serif;
  color: #888;
  margin: 0;
}

#main {
  display: table;
  width: 100%;
  height: 100vh;
  text-align: center;
  background-color: white;
}

.fof {
  display: table-cell;
  vertical-align: middle;
}

.fof h1 {
  font-size: 6vw;
  display: inline-block;
  padding-right: 12px;
  animation: type 0.5s alternate infinite;
  color: #888;
}

.fof h5 {
  font-size: 12vw;
  display: inline-block;
  padding-right: 12px;
  color: #888;
  line-height: 1;
}

@keyframes type {
  from {
    box-shadow: inset -3px 0px 0px #888;
  }
  to {
    box-shadow: inset -3px 0px 0px transparent;
  }
}
</style>