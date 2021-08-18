<template>
  <el-container class="content panel" direction="vertical">
    <ts-update></ts-update>
    <el-header class="panel-header" height="84">
      <h4 class="task-title">{{ $t("app.task-list") }}</h4>
    </el-header>
    <el-main class="panel-content">
      <ts-task-list></ts-task-list>
    </el-main>
  </el-container>
</template>

<script>
import updateVue from "../Update/update.vue";
import TaskListVue from "./TaskList.vue";

export default {
  name: "ts-content-task",
  components: {
    [TaskListVue.name]: TaskListVue,
    [updateVue.name]: updateVue,
  },
  methods: {
    // fetchList() {
    //   this.$store.dispatch("task/fetchList");
    // },
  },
  created: function () {
    // this.fetchList();
  },
};
</script>

<style lang="scss">
</style>