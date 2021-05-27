<template>
  <el-container id="container">
    <ts-aside></ts-aside>
    <router-view></router-view>
    <ts-about-panel :visible="aboutPanelVisible"></ts-about-panel>
  </el-container>
</template>

<script>
import AboutPanelVue from "./About/AboutPanel.vue";
import AsideVue from "./Aside/Aside.vue";
import { mapState } from "vuex";

export default {
  name: "ts-main",
  components: {
    [AsideVue.name]: AsideVue,
    [AboutPanelVue.name]: AboutPanelVue,
  },
  computed: {
    ...mapState("app", {
      aboutPanelVisible: (state) => state.aboutPanelVisible,
    }),
  },
};
</script>