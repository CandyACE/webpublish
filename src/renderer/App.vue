<template>
  <div id="app">
    <ts-title-bar />
    <router-view></router-view>
  </div>
</template>

<script>
import TitleBarVue from "./components/Native/TitleBar.vue";
export default {
  name: "webpublish",
  components: {
    [TitleBarVue.name]: TitleBarVue,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
/* CSS */
#app,
#container {
  height: 100%;
  background-color: transparent;
}

body,
html {
  height: fit-content;
  margin: 0px;
  background-color: #fbfbfb;
  overflow: hidden;
}

/*凹槽宽度*/
.scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 8px;
}
/*拖动条*/
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  /* border-radius: 6px; */
}
/*背景槽*/
.scrollbar::-webkit-scrollbar-track {
  background-color: #dddddd;
  /* border-radius: 6px; */
}
</style>
