<template>
  <el-container id="container">
    <ts-aside></ts-aside>
    <router-view></router-view>
    <ts-welcome></ts-welcome>
    <ts-howtouse :visible="howtousePanelVisible"></ts-howtouse>
    <ts-add-task :visible="addTaskVisible" :type="addTaskType" />
    <ts-about-panel :visible="aboutPanelVisible" />
    <ts-task-item-property
      :visible="taskItemInfoVisible"
      :task="currentTaskItem"
    />
    <ts-dragger />
  </el-container>
</template>

<script>
import AboutPanelVue from "./About/AboutPanel.vue";
import AsideVue from "./Aside/Aside.vue";
import { mapState } from "vuex";
import AddTaskVue from "./Task/AddTask.vue";
import Dragger from "./Dragger/Index";
import TaskPropertyVue from "./Task/TaskProperty.vue";
import WelcomeVue from "./Welcome/Welcome.vue";
import HowTuUseVue from "./HowToUse/index.vue";

export default {
  name: "ts-main",
  components: {
    [AsideVue.name]: AsideVue,
    [AboutPanelVue.name]: AboutPanelVue,
    [AddTaskVue.name]: AddTaskVue,
    [Dragger.name]: Dragger,
    [TaskPropertyVue.name]: TaskPropertyVue,
    [WelcomeVue.name]: WelcomeVue,
    [HowTuUseVue.name]: HowTuUseVue,
  },
  computed: {
    ...mapState("app", {
      aboutPanelVisible: (state) => state.aboutPanelVisible,
      addTaskVisible: (state) => state.addTaskVisible,
      addTaskType: (state) => state.addTaskType,
      howtousePanelVisible: (state) => state.howtousePanelVisible,
    }),
    ...mapState("task", {
      taskItemInfoVisible: (state) => state.taskItemInfoVisible,
      currentTaskItem: (state) => state.currentTaskItem,
    }),
  },
};
</script>