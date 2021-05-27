<template>
  <div :key="task.id" class="task-item">
    <div class="task-name" :title="task.name">
      <span>{{ task.name }}</span>
    </div>
    <div class="task-type" :style="{ color: taskType[task.type].color }">
      {{ taskType[task.type].text }}
      <div class="task-type-background-1"></div>
      <div class="task-type-background-2"></div>
    </div>
    <ts-task-urls :task="task" />
  </div>
</template>

<script>
import fs from "fs";
import { FILE_STATUS } from "@shared/constants";
import { remote } from "electron";
import TaskUrlVue from "./TaskUrl.vue";

export default {
  name: "ts-task-item",
  components: {
    [TaskUrlVue.name]: TaskUrlVue,
  },
  data() {
    return {
      taskType: {
        [FILE_STATUS.FILE]: {
          text: "FILE",
          color: "rgba(204,102,0,.2)",
        },
        [FILE_STATUS.DIRECTORY]: {
          text: "DIRECTORY",
          color: "rgba(204,102,0,.2)",
        },
        [FILE_STATUS.MBTILES]: {
          text: "MBTiles",
          color: "rgba(204,102,0,.2)",
        },
      },
    };
  },
  props: {
    task: Object,
  },
  computed: {},
  methods: {
    showFile(task) {
      remote.shell.showItemInFolder(task.path);
    },
    isFileOrDirectory: function (file) {
      let stat = fs.statSync(file.path);
      let result = FILE_STATUS.UNKNOW;
      if (stat.isFile()) {
        result = FILE_STATUS.FILE;
      } else if (stat.isDirectory()) {
        result = FILE_STATUS.DIRECTORY;
      }
      return result;
    },
  },
  removeTask(task) {
    this.application.taskManager.removeTask(task);
  },

  editName(task) {
    task.editing = true;
    this.$nextTick(() => {
      this.$refs.fileTileEditor[0].focus();
      this.$refs.fileTileEditor[0].select();
    });
  },

  saveName(task) {
    let index = this.taskList.indexOf(task);
    task.editing = false;
    this.application.taskManager.setTask(index, task);
  },

  getName(task) {
    return task.name || task.path.split("\\").pop();
  },
};
</script>

<style lang="scss">
.task-item {
  position: relative;
  min-height: 88px;
  padding: 16px 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: border-color 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    border-color: rgb(230, 154, 79);
  }
  .task-item-actions {
    position: absolute;
    top: 16px;
    right: 12px;
  }
}
.selected .task-item {
  border-color: rgb(204, 102, 0);
}
.task-name {
  color: #505753;
  margin-bottom: 32px;
  margin-right: 240px;
  word-break: break-all;
  min-height: 26px;
  & > span {
    font-size: 14px;
    line-height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.task-type {
  font-size: xxx-large;
  font-weight: 1000;
  position: absolute;
  top: 60px;
  pointer-events: none;
  height: 100%;
  width: 100%;

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