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
      将文件或文件夹拖拽到此处，或者点击选择
      <div class="task-name" v-if="taskName">{{ taskName }}</div>
    </div></el-upload
  >
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
import { buildFileList } from "../../../shared/utils";
import "../Icons/inbox";
import "../Icons/trash";
import fs from "fs";
import path from "path";
import { FILE_STATUS } from "../../../shared/constants";

export default {
  name: "ts-select-files",
  data() {
    return {
      taskName: "",
    };
  },
  computed: {
    ...mapState("app", {
      taskFiles: (state) => state.addTaskFiles,
    }),
    isFilesEmpty: function () {
      return this.taskFiles.length === 0;
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

      const file = fileList[0];
      if (!file.raw) {
        return;
      }

      var path = file.raw.path;
      var hasList = this.application.taskManager.taskList.filter((f) => {
        return f.path === path;
      });
      this.$message.warning(`[${path}] 任务已经存在【${hasList.length}】份`);

      fs.stat(file.raw.path, function (err, stats) {
        try {
          var fileStats = FILE_STATUS.DIRECTORY;

          if (stats.isFile()) {
            if (path.extname(file.raw.name) === ".mbtiles") {
              fileStats = FILE_STATUS.MBTILES;
            } else {
              fileStats = FILE_STATUS.FILE;
            }
          }

          _this.taskName = file.raw.name;
          console.log("check change");
          _this.$emit("change", file.raw, fileStats);
        } catch (error) {
          console.log(error);
        }
      });
    },
  },
  methods: {
    handleTrashClick() {
      this.$store.dispatch("app/addTaskAddFiles", { fileList: [] });
    },
    reset() {
      this.taskName = "";
    },
    handleChange(file, fileList) {
      this.$store.dispatch("app/addTaskAddFiles", { fileList });
    },
    handleExceed(files) {
      var fileList = buildFileList(files[0]);
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