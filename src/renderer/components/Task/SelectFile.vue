<template>
  <el-upload
    class="upload-task"
    drag
    action="/"
    :limit="1"
    v-if="isFilesEmpty"
    :multiple="false"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleChange"
    :on-exceed="handleExceed"
  >
    <i class="upload-inbox-icon">
      <ts-icon name="inbox" width="24" height="24"></ts-icon>
    </i>
    <div class="el-upload__text">
      {{ $t("task.select-folder") }}
      <div class="task-name" v-if="taskName">{{ taskName }}</div>
    </div>
  </el-upload>
  <div v-else class="selective-task">
    <el-row class="task-info" :gutter="12">
      <el-col class="task-name" :span="20">
        <el-tooltip effect="dark" :content="taskName" placement="top">
          <span>{{ taskName }}</span>
        </el-tooltip>
      </el-col>
      <el-col class="task-actions" :span="4">
        <span @click="handleTrashClick">
          <ts-icon name="trash" width="14" height="14" />
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { buildFile, buildFileList } from "../../../shared/utils";
import "../Icons/inbox";
import "../Icons/trash";
import fs, { fstatSync } from "fs";
import path from "path";
import { TASK_STATUS } from "../../../shared/constants";
import { AddTaskInfo } from "../../../shared/utils/addTask";

export default {
  name: "ts-select-files",
  data() {
    return {
      tasks: [],
    };
  },
  computed: {
    ...mapState("app", {
      taskFiles: (state) => state.addTaskFiles,
    }),
    isFilesEmpty: function () {
      return this.taskFiles.length === 0;
    },
    taskName: function () {
      let result = undefined;
      if (this.tasks.length == 1) {
        result = this.tasks[0].name;
      } else if (this.tasks.length > 1) {
        result = "准备添加 {count} 个文件".replace(
          "{count}",
          this.tasks.length
        );
      }
      return result;
    },
  },
  watch: {
    taskFiles(fileList) {
      console.log("select List Changed", fileList);
      var _this = this;
      if (fileList.length === 0) {
        this.reset();
        _this.$emit("change", "", "");
        return;
      }

      _this.tasks = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.raw) {
          return;
        }

        var filepath = file.raw.path;
        var hasList = this.application.taskManager.taskList.filter((f) => {
          return f.path === filepath;
        });

        if (hasList.length > 0)
          this.$msg.warning(
            this.$t("task.task-path-exist", {
              taskPath: filepath,
              count: hasList.length,
            })
          );

        var stats = fs.statSync(file.raw.path);
        try {
          var fileStats = TASK_STATUS.DIRECTORY;

          if (stats.isFile()) {
            if (path.extname(file.raw.name) === ".mbtiles") {
              fileStats = TASK_STATUS.MBTILES;
            } else {
              fileStats = TASK_STATUS.FILE;
            }
          }

          // _this.taskName = file.raw.name;
          let addTaskInfo = new AddTaskInfo();
          addTaskInfo.name = file.raw.name;
          addTaskInfo.path = file.raw.path;
          addTaskInfo.type = fileStats;

          _this.tasks.push(addTaskInfo);
        } catch (error) {
          console.log(error);
        }
      }

      _this.tasks = _this.tasks.sort((a, b) => a.type.length - b.type.length);
      console.log("check change");
      _this.$emit("change", _this.tasks);
    },
  },
  methods: {
    handleTrashClick() {
      this.$store.dispatch("app/addTaskAddFiles", { fileList: [] });
    },
    reset() {
      this.tasks = [];
    },
    handleChange(file, fileList) {
      this.$store.dispatch("app/addTaskAddFiles", { fileList });
    },
    handleExceed(files) {
      var fileList = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileList.push(buildFile(file));
      }
      this.$store.dispatch("app/addTaskAddFiles", { fileList });
    },
  },
};
</script>

<style lang="scss">
.upload-task {
  width: 100%;

  .el-upload,
  .el-upload-dragger {
    width: 100%;
  }

  .el-upload-dragger {
    border-radius: 4px;
    padding: 24px;
    height: auto;
  }

  .upload-inbox-icon {
    display: inline-block;
    margin-bottom: 12px;
  }

  .task-name {
    margin-top: 4px;
    font-size: 13px;
    color: #909399;
    line-height: 16px;
  }
}

.selective-task {
  .task-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .task-info {
    margin-bottom: 15px;
    font-size: 12px;
    line-height: 16px;
  }

  .task-actions {
    text-align: right;
    line-height: 16px;

    & > span {
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      height: 14px;
      padding: 1px;
    }
  }
}

.file-filters {
  button {
    font-size: 0;
  }
}
</style>