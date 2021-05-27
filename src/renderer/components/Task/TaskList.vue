<template>
  <div class="task-list">
    <div
      v-for="task in taskList"
      :id="task.path"
      :key="task.id"
      class="taskCardParent"
    >
      <ts-task-item :task="task"></ts-task-item>
    </div>
  </div>
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
  data() {
    return {};
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