<template>
  <div class="task-list" v-if="taskList.length > 0">
    <!-- <transition-group> -->
      <div v-for="item in taskList" :key="item.gid" :attr="item.gid">
        <ts-task-item :task="item"></ts-task-item>
      </div>
    <!-- </transition-group> -->
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

.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}
/*v-move 和 v-leave-active 配合使用，能够实现列表后续的元素，渐渐地漂上来的效果 */
.v-move {
  transition: all 0.3s ease;
}
.v-leave-active {
  position: absolute;
}
</style>