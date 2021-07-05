<template>
  <div
    :key="task.id"
    class="task-item"
    :class="{
      error:
        Number(task.limitData) != 0 &&
        Number(task.useData) >= Number(task.limitData),
    }"
  >
    <div class="task-name" :title="taskName">
      <span>{{ taskName }}</span>
    </div>
    <ts-task-type :task="task" />
    <ts-task-item-actions :task="task"></ts-task-item-actions>
    <ts-task-progress
      :useData="Number(task.useData)"
      :limitData="Number(task.limitData)"
      :type="task.type === 'mbtiles' ? 'count' : 'size'"
    />
  </div>
</template>

<script>
import fs from "fs";
import { FILE_STATUS } from "@shared/constants";
import { remote } from "electron";
import TaskProgressVue from "./TaskProgress";
import TaskItemActionsVue from "./TaskItemActions.vue";
import TaskTypeVue from "./TaskType.vue";

export default {
  name: "ts-task-item",
  components: {
    [TaskProgressVue.name]: TaskProgressVue,
    [TaskItemActionsVue.name]: TaskItemActionsVue,
    [TaskTypeVue.name]: TaskTypeVue,
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
    task: {
      type: Object,
    },
  },
  computed: {
    taskName() {
      return this.task.name || this.task.path.split("\\").pop();
    },
  },
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
    removeTask(task) {
      this.application.taskManager.removeTask(task);
    },

    // editName(task) {
    //   task.editing = true;
    //   this.$nextTick(() => {
    //     this.$refs.fileTileEditor[0].focus();
    //     this.$refs.fileTileEditor[0].select();
    //   });
    // },

    // saveName(task) {
    //   let index = this.taskList.indexOf(task);
    //   task.editing = false;
    //   this.application.taskManager.setTask(index, task);
    // },

    getName() {
      return this.task.name || this.task.path.split("\\").pop();
    },
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

  &.error {
    border-color: rgb(236, 43, 43);
  }

  .task-item-actions {
    position: absolute;
    top: 16px;
    right: 12px;
  }

  .task-name {
    color: #505753;
    margin-bottom: 32px;
    margin-right: 240px;
    word-break: break-all;
    min-height: 26px;
    pointer-events: none;
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
}
.selected .task-item {
  border-color: rgb(204, 102, 0);
}
</style>