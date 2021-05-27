<template>
  <el-container class="content panel" direction="vertical">
    <el-header class="panel-header" height="84">
      <h4 class="task-title hidden-xs-only">发布列表</h4>
    </el-header>
    <el-main class="panel-content">
      <ts-task-list></ts-task-list>
    </el-main>
  </el-container>
</template>

<script>
import TaskListVue from "./TaskList.vue";
export default {
  name: "ts-content-task",
  components: {
    [TaskListVue.name]: TaskListVue,
  },
  methods: {
    fetchList() {
      this.$store.dispatch("task/fetchList");
    },
  },
  created: function () {
    this.fetchList();
  },
};
</script>

<style lang="scss">
</style>