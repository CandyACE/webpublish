<template>
  <el-container id="container">
    <ts-aside></ts-aside>
    <router-view></router-view>
    <ts-add-task :visible="addTaskVisible" :type="addTaskType" />
    <ts-about-panel :visible="aboutPanelVisible" />
    <ts-dragger />
  </el-container>
</template>

<script>
import AboutPanelVue from "./About/AboutPanel.vue";
import AsideVue from "./Aside/Aside.vue";
import { mapState } from "vuex";
import AddTaskVue from "./Task/AddTask.vue";
import Dragger from "./Dragger/Index";

export default {
  name: "ts-main",
  components: {
    [AsideVue.name]: AsideVue,
    [AboutPanelVue.name]: AboutPanelVue,
    [AddTaskVue.name]: AddTaskVue,
    [Dragger.name]: Dragger,
  },
  computed: {
    ...mapState("app", {
      aboutPanelVisible: (state) => state.aboutPanelVisible,
      addTaskVisible: (state) => state.addTaskVisible,
      addTaskType: (state) => state.addTaskType,
    }),
  },
};
</script>