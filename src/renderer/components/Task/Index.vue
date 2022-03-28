<template>
  <el-container class="main panel" direction="horizontal">
    <el-aside
      width="200px"
      class="subnav"
      :class="[viewType ? 'hidden-xs-only' : 'ts-hide']"
    >
      <ts-task-subnav :current="status" :subnavs="subnavs"></ts-task-subnav>
    </el-aside>
    <el-container class="content panel" direction="vertical">
      <ts-update></ts-update>
      <el-header class="panel-header" height="84">
        <h4 class="task-title" :class="[viewType ? 'hidden-xs-only' : '']">
          {{ $t("app.task-list") }}
        </h4>
        <ts-subnav-switcher
          :title="title"
          :subnavs="subnavs"
          :class="[viewType ? 'hidden-sm-and-up' : 'ts-hide']"
        ></ts-subnav-switcher>
        <ts-task-search></ts-task-search>
      </el-header>
      <el-main class="panel-content">
        <ts-task-list></ts-task-list>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import SubnavSwitcher from "../Subnav/SubnavSwitcher.vue";
import TaskSubnavVue from "../Subnav/TaskSubnav.vue";
import updateVue from "../Update/update.vue";
import TaskListVue from "./TaskList.vue";
import TaskSearchVue from "./TaskSearch.vue";

export default {
  name: "ts-content-task",
  components: {
    [TaskSubnavVue.name]: TaskSubnavVue,
    [SubnavSwitcher.name]: SubnavSwitcher,
    [TaskListVue.name]: TaskListVue,
    [updateVue.name]: updateVue,
    [TaskSearchVue.name]: TaskSearchVue,
  },
  props: {
    status: {
      type: String,
      default: "all",
    },
  },
  watch: {
    status: "onStatusChange",
  },
  methods: {
    onStatusChange() {
      this.application.taskManager.updateSelectTaskList("", true, this.status);
    },
  },
  computed: {
    ...mapState("options", {
      viewType: (state) => state.config.viewType,
    }),
    subnavs() {
      let result = [];
      var taskList = this.application.taskManager.taskList;
      var types = [...new Set(taskList.map((t) => t.type))];
      types = types.sort();
      result.push({
        key: "all",
        title: this.$t("subnav.task-type-all"),
        route: "/task",
      });
      types.forEach((type) => {
        result.push({
          key: type,
          title: this.$t("subnav.task-type-" + type),
          route: "/task/" + type,
        });
      });
      return result;
    },
    title() {
      const subnav = this.subnavs.find((item) => item.key === this.status);
      return subnav.title || "";
    },
  },
};
</script>

<style lang="scss">
.ts-hide {
  display: none !important;
}
</style>