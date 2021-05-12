<template>
  <div>
    <el-card class="taskCard" shadow="hover" :body-style="{ padding: '10px' }">
      <el-row>
        <el-col :span="21">
          <span id="fileTile">
            {{ getName(task) }}
          </span>
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
              @focus="copy(task, item)"
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
          <div slot="content" style="max-width: 290px">
            {{ task.path }}
          </div>
          <div class="filepath">{{ task.path }}</div>
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
    </el-card>
  </div>
</template>

<script>
import fs from "fs";
import { FILE_STATUS } from "@shared/constants";
import { guid } from "@shared/twtools";
import path from "path";
import { remote } from "electron";
import os from "os";

export default {
  name: "ts-task-item",
  components: {},
  props: {
    task: Object,
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
            if (element2.address === "127.0.0.1") {
              temp.unshift(element2);
            } else {
              temp.push(element2);
            }
          }
        });
      });
      console.log("networkInterfaces", temp);
      return temp;
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

.taskCardParent {
  width: 310px;
  height: 135px;
  float: left;
  margin: 10px;
  z-index: 1;
  position: relative;
  perspective: 150;
  -webkit-perspective: 150;
  transition: all 1s;

  &:hover {
    z-index: 2;
  }
}

.taskCard {
  // margin: 10px;
  // height: 125px;
  height: auto;
  width: 310px;

  // &:hover {
  //   transform: translateZ(5px);
  // }
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
  // background-image: url(http://www.tangweitian.cn:2333/images/2019/05/16/nwIoAS67Z6h0B6ez.jpg);
  // &::before {
  //   content: "";
  //   position: absolute;
  //   width: 100vw;
  //   height: 100vh;
  //   top: 0;
  //   left: 0;
  //   backdrop-filter: blur(20px);
  // }
}

.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
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