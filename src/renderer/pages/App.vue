<template>
  <div id="app">
    <ts-title-bar></ts-title-bar>
    <router-view />
  </div>
</template>

<script>
import TitleBarVue from "../components/Native/TitleBar.vue";

export default {
  components: {
    [TitleBarVue.name]: TitleBarVue,
  },
};
</script>

<style>
#app,
#container {
  height: 100%;
  background-color: transparent;
}

body,
html {
  margin: 0px;
  height: 100%;
}
</style>
