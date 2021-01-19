<template>
  <div class="ts-main">
    <transition name="el-fade-in-linear">
      <div class="mainDiv" v-show="!optionsVisible">
        <el-card
          class="addItems"
          v-bind:class="{ active: isDrag }"
          :body-style="{ padding: !isDrag ? '0px' : '20px' }"
        >
          <div>将文件夹或文件拖拽到此处添加</div>
        </el-card>
        <el-scrollbar style="height: 100%; top: 20px">
          <div v-show="taskList.length > 0">
            <el-card
              class="taskCard"
              v-for="task in taskList"
              :id="task.path"
              :key="task.id"
              shadow="hover"
              :body-style="{ padding: '10px' }"
            >
              <div>
                <el-row>
                  <el-col :span="21">
                    <div id="fileTile">{{ task.path.split("\\").pop() }}</div>
                  </el-col>
                  <el-col :span="3">
                    <div style="cursor: pointer">
                      <el-tag
                        v-if="task.type == 'directory'"
                        type="success"
                        size="medium"
                        @click="showFile(task)"
                        ><i class="el-icon-folder-opened"
                      /></el-tag>
                      <el-tag
                        v-else-if="task.type == 'file'"
                        type="info"
                        size="medium"
                        @click="showFile(task)"
                        ><i class="el-icon-document"
                      /></el-tag>
                      <el-tag v-else type="danger" size="medium">未知</el-tag>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="urlDiv">
                      <el-input
                        readonly
                        size="mini"
                        v-for="(item, index) in networkInterfaces"
                        :key="index"
                        :value="createUrl(task, item)"
                        style="margin-bottom: 5px"
                      >
                        <el-button
                          slot="append"
                          icon="el-icon-document-copy"
                          @click="copy(task, item)"
                        ></el-button>
                      </el-input>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="21">
                    <el-tooltip placement="bottom">
                      <div slot="content" style="max-width: 290px">
                        {{ task.path }}
                      </div>
                      <div class="filepath">{{ task.path }}</div>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="3">
                    <el-popconfirm
                      title="确定移除发布此数据？"
                      @onConfirm="removeTask(task)"
                    >
                      <el-button
                        type="danger"
                        circle
                        size="mini"
                        icon="el-icon-delete"
                        slot="reference"
                      ></el-button>
                    </el-popconfirm>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div></div>
        </el-scrollbar>
      </div>
    </transition>
    <transition name="el-zoom-in-top">
      <options-page class="optionsDiv" v-show="optionsVisible" />
    </transition>
    <ts-update />
  </div>
</template>

<script>
import fs from "fs";
import { FILE_STATUS } from "@shared/constants";
import { guid } from "@shared/twtools";
import path from "path";
import { create } from "domain";
import optionsPageVue from "./options/optionsPage.vue";
import updateVue from "./Update/update.vue";
import { remote } from "electron";
import os from "os";

export default {
  name: "main-page",
  components: {
    [optionsPageVue.name]: optionsPageVue,
    [updateVue.name]: updateVue,
  },
  props: ["optionsVisible"],
  data() {
    return {
      isDrag: false,
      /**
       * @type []
       */
      taskList: this.application.taskManager.taskList,
    };
  },
  computed: {
    networkInterfaces: function () {
      const _net = Object.values(os.networkInterfaces());
      var temp = [];
      _net.forEach((element1) => {
        element1.forEach((element2) => {
          if (
            element2.family !== undefined &&
            element2.family.toUpperCase() === "IPV4"
          ) {
            temp.push(element2);
          }
        });
      });
      console.log("networkInterfaces", temp);
      return temp;
    },
  },
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
      this.$msg.success(path.basename(obj.path) + " 添加成功");
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
    showFile(task) {
      remote.shell.showItemInFolder(task.path);
    },
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

    copy(task, element) {
      var path = this.createUrl(task, element);
      this.$electron.clipboard.writeText(path);
      this.$msg.success("复制成功！");
    },

    createUrl(task, element) {
      var address = element.address;
      var port = this.application.configManager.getSystemConfig("port", "9090");
      return (
        `http://${address}:${port}/${task.id}/` +
        (task.type == FILE_STATUS.FILE ? `${path.basename(task.path)}` : "")
      );
    },

    removeTask(task) {
      this.application.taskManager.removeTask(task);
    },
  },
};
</script>


<style lang="scss">
#fileTile {
  font-size: 17px;
  font-weight: bold;
  line-height: 28px;
  margin-left: 5px;
  pointer-events: none;
}

.filepath {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 20px);
  line-height: 26px;
  margin-left: 5px;
  cursor: default;
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
  // height: 125px;
  height: auto;
  width: 310px;
  float: left;
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
  top: 28px;
  height: calc(100% - 28px);
  width: 100%;
}

.mainDiv,
.optionsDiv {
  height: 100%;
  position: absolute;
  background-color: rgb(251, 251, 251);
  width: 100%;
  height: 100%;
}

.hide {
  display: none;
}

.urlDiv {
  transition: max-height 0.5s;
  max-height: 29px;
  overflow: hidden;

  &:hover {
    max-height: 200px;
    overflow-x: auto;
  }
}
</style>