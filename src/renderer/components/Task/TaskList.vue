<template>
  <div class="task-list" v-if="taskList.length > 0">
    <div v-for="item in taskList" :key="item.id" :attr="item.id">
      <ts-task-item :task="item"></ts-task-item>
    </div>
  </div>
  <div v-else class="no-task"></div>
</template>

<script>
import TaskItemVue from "./TaskItem.vue";
import { remote } from "electron";
import { mapState } from "vuex";

export default {
  name: "ts-task-list",
  components: {
    [TaskItemVue.name]: TaskItemVue,
  },
  computed: {
    ...mapState("task", {
      taskList: (state) => state.taskList,
    }),
  },
};
</script>

<style lang="scss">
.task-list {
  padding: 16px 0 64px 0;
  min-height: 100%;
  box-sizing: border-box;
}
</style>