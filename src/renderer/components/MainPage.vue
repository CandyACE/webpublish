<template>
  <div class="ts-main">
    <el-card
      class="addItems"
      v-bind:class="{ active: isDrag }"
      :body-style="{padding:(!isDrag?'0px':'20px')}"
    >
      <div>将文件夹或文件拖拽到此处添加</div>
    </el-card>
    <el-scrollbar style="height: 100%;top:20px;">
      <div v-if="taskList.length > 0">
        <el-card
          class="taskCard"
          v-for="task in taskList"
          :id="task.path"
          :key="task.id"
          shadow="hover"
        >
          <div>
            <el-row>
              <el-col :span="24">
                <el-input readonly size="mini" :value="createUrl(task)">
                  <el-button
                    slot="append"
                    icon="el-icon-document-copy"
                    @click="copy(task)"
                  ></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-tag
                  v-if="task.type == 'directory'"
                  type="success"
                  size="medium"
                  ><i class="el-icon-folder-opened"
                /></el-tag>
                <el-tag
                  v-else-if="task.type == 'file'"
                  type="info"
                  size="medium"
                  ><i class="el-icon-document"
                /></el-tag>
                <el-tag v-else type="danger" size="medium">未知</el-tag>
              </el-col>
              <el-col :span="18">
                <div class="filepath">{{ task.path }}</div>
              </el-col>
              <el-col :span="2">
                <el-button
                  type="danger"
                  circle
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeTask(task)"
                ></el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      <div></div>
    </el-scrollbar>
  </div>
</template>

<script>
import fs from "fs";
import { FILE_STATUS } from "@shared/constants";
import { guid } from "@shared/twtools";
import path from "path";
import { create } from "domain";

export default {
  name: "main-page",
  components: {},
  data() {
    return {
      isDrag: false,
      /**
       * @type []
       */
      taskList: this.application.taskManager.taskList,
    };
  },
  computed: {},
  mounted() {
    console.log(this.taskList);
    var _this = this;
    this.preventDefault = (ev) => ev.preventDefault();
    let count = 0;
    this.onDragEnter = (ev) => {
      if (count === 0) {
        this.isDrag = true;
      }
      count++;
    };

    this.onDragLeave = (ev) => {
      count--;
      if (count === 0) {
        this.isDrag = false;
      }
    };

    this.onDrop = (ev) => {
      count = 0;
      this.isDrag = false;
      const fileList = [...ev.dataTransfer.files];
      if (fileList.length > 1) {
        this.$msg.error("目前只支持单文件或者文件夹的发布！");
        return;
      }

      var obj = fileList[0];

      if (
        this.taskList.find((f) => {
          return f.path == obj.path;
        })
      ) {
        this.$msg.error("已经存在！");
        return;
      }

      var stat = this.isFileOrDirectory(obj);
      this.application.taskManager.addTask({
        id: guid(),
        path: obj.path,
        enable: true,
        type: stat,
      });
      this.$msg.success(path.basename(obj.path)+' 添加成功')
    };

    document.addEventListener("dragover", this.preventDefault);
    document.body.addEventListener("dragenter", this.onDragEnter);
    document.body.addEventListener("dragleave", this.onDragLeave);
    document.body.addEventListener("drop", this.onDrop);
  },
  destroyed() {
    document.removeEventListener("dragover", this.preventDefault);
    document.body.removeEventListener("dragenter", this.onDragEnter);
    document.body.removeEventListener("dragleave", this.onDragLeave);
    document.body.removeEventListener("drop", this.onDrop);
    global.application.exit();
  },
  methods: {
    /**
     *
     */
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

    copy(task) {
      var path = this.createUrl(task);
      this.$electron.clipboard.writeText(path);
      this.$msg.success("复制成功！");
    },

    createUrl(task) {
      var address = this.application.configManager.getSystemConfig(
        "address",
        "127.0.0.1"
      );
      var port = this.application.configManager.getSystemConfig("port", "9090");
      return `http://${address}:${port}/${task.id}/`+(task.type == FILE_STATUS.FILE?`${path.basename(task.path)}`:"");
    },

    removeTask(task) {
      this.application.taskManager.removeTask(task);
    },
  },
};
</script>


<style lang="scss" scoped>

.filepath {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 20px);
  line-height: 26px;
}

.el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.el-row {
  margin-bottom: 10px;
}

.addItems {
  height: 20px;
  // margin: 10px;
  font-size: 12px;
  width: 100%;
  text-align: center;
  position: absolute;
  z-index: 999;
  pointer-events: none;
  vertical-align: middle;

  &.active {
    height: 50px;
  }
}

.taskCard {
  margin: 10px;
  height: 100px;
}

.mainTop {
  width: 100%;
  height: 90px;
}

.titleText {
  padding-top: 16px;
  padding-left: 50px;
  font-size: 32px;
  font-family: "Segoe UI Regular";
}

.ts-main {
  position: absolute;
  top: 30px;
  height: calc(100% - 35px);
  width: 100%;
}
</style>