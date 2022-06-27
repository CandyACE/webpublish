<template>
  <div class="task-type" :class="{ disenabled: isServerRunning }" :style="{ color: taskType[task.type].color }">
    {{ taskType[task.type].text }}
    <div class="task-type-background-1"></div>
    <div class="task-type-background-2"></div>
  </div>
</template>

<script>
import { TASK_STATUS } from "../../../shared/constants";

export default {
  name: "ts-task-type",
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {
      taskType: {
        [TASK_STATUS.FILE]: {
          text: "File",
          color: "rgba(204,102,0,.2)",
        },
        [TASK_STATUS.DIRECTORY]: {
          text: "Directory",
          color: "rgba(204,102,0,.2)",
        },
        [TASK_STATUS.MBTILES]: {
          text: "MBTiles",
          color: "rgba(204,102,0,.2)",
        },
        [TASK_STATUS.PROXY]: {
          text: 'Proxy',
          color: "rgba(204,102,0,.2)",
        },
        [TASK_STATUS.CLT]: {
          text: 'CLT',
          color: "rgba(204,102,0,.2)",
        },
      },
    };
  },
  computed: {
    isServerRunning() {
      return !(this.task.enable && this.application.serverManager.isRunning);
    },
  },
};
</script>

<style lang="scss" scoped>
.task-type {
  font-size: xxx-large;
  font-weight: 1000;
  position: absolute;
  top: 60px;
  pointer-events: none;
  height: 100%;
  width: 100%;

  &.disenabled {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
  }

  .task-type-background-1 {
    &:before {
      content: "";
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 22px;
      left: -52px;
      position: absolute;
      background-color: rgba(239, 92, 92, 0.14);
    }
  }

  .task-type-background-2:before {
    content: "";
    width: 200px;
    height: 200px;
    border-radius: 50%;
    top: -5px;
    left: 12px;
    position: absolute;
    background-color: rgba(239, 180, 92, 0.14);
  }
}
</style>