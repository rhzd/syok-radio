<template>
  <div class="h-screen">
    <Nuxt class="p-10" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: "0px",
    };
  },
  mounted() {
    this.height = window.innerHeight + "px";
  },
};
</script>