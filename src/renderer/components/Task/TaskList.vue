<template>
  <div>
    <div
      v-for="task in taskList"
      :id="task.path"
      :key="task.id"
      class="taskCardParent"
    >
      <task-item :task="task"></task-item>
    </div>
  </div>
</template>

<script>
import TaskItemVue from "./TaskItem.vue";
export default {
  name: "ts-task-list",
  components: {
    [TaskItemVue.name]: TaskItemVue,
  },
  data() {
    return {
      taskList: this.application.taskManager.taskList,
    };
  },
};
</script>