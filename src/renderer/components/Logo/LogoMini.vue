<template>
  <h1 class="logo">
    <a target="_blank" href="https://tangweitian.cn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        :width="width"
        :height="height"
        viewBox="0 0 128 126"
      >
        <image width="128" height="126" :xlink:href="logoPath" />
      </svg>
    </a>
  </h1>
</template>

<script>
export default {
  name: "ts-logo-mini",
  data() {
    return {
      logoPath: "static/image/logo.png",
    };
  },
  props: {
    width: {
      type: Number,
      default: 28,
    },
    height: {
      type: Number,
      default: 28,
    },
  },
};
</script>

<style lang="scss">
.logo {
  margin: 0;
  padding: 0;
  width: 100%;
  > a {
    display: block;
    text-align: center;
    font-size: 0;
    padding: 2px;
    margin: 0 auto;
  }
}
</style>