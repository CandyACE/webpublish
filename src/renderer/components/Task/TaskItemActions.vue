<template>
  <ul :key="task.id" class="task-item-actions" v-on:dbclick.stop="() => {}">
    <li v-for="action in taskActions" :key="action" class="task-item-action">
      <i v-if="action === 'STOP'" @click.stop="onStopClick">
        <el-tooltip content="停止">
          <ts-icon name="task-stop-line" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'START'" @click.stop="onStartClick">
        <el-tooltip content="启动">
          <ts-icon name="task-start-line" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'FOLDER'" @click.stop="onFolderClick">
        <el-tooltip content="打开文件夹">
          <ts-icon name="folder" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'INFO'" @click.stop="onInfoClick">
        <el-tooltip content="配置">
          <ts-icon name="node" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'DELETE'" @click.stop="onDeleteClick">
        <el-tooltip content="移除">
          <ts-icon name="trash" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'LINK'">
        <el-dropdown :show-timeout="0" @command="handleCommand">
          <span><ts-icon name="link" width="14" height="14"></ts-icon></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(address, index) in networkInterfaces"
              :key="index"
              :command="createUrl(address)"
              :disabled="!task.enable"
            >
              {{ createUrl(address) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </i>
      <i v-if="action === 'WMTS'" @click.stop="onMapClick">
        <el-tooltip content="地图预览">
          <ts-icon name="image" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
    </li>
  </ul>
</template>

<script>
import { FILE_STATUS } from "../../../shared/constants";
import is from "electron-is";
import "@/components/Icons/delete";
import "@/components/Icons/link";
import "@/components/Icons/folder";
import "@/components/Icons/info-circle";
import "@/components/Icons/more";
import "@/components/Icons/task-stop-line";
import "@/components/Icons/task-start-line";
import "@/components/Icons/video";
import "@/components/Icons/info-square";
import "@/components/Icons/node";
import "@/components/Icons/trash";
import "@/components/Icons/image";
import os from "os";
import api from "../../api";
import { remote, shell } from "electron";
import { showItemInFolder } from "../Native/utils";
import { cloneDeep } from "lodash";

// const taskActionsMap = {
//   [FILE_STATUS.FILE]: [],
// };

export default {
  name: "ts-task-item-actions",
  props: {
    task: {
      type: Object,
    },
  },
  computed: {
    taskCommonActions() {
      let result = this.task.enable ? ["STOP"] : ["START"];
      if (this.task.type === FILE_STATUS.MBTILES) {
        result.push("WMTS");
      }
      return result;
    },
    taskActions() {
      const { taskCommonActions } = this;
      const defaultActions = ["LINK", "FOLDER", "INFO", "DELETE"];
      const result = [...taskCommonActions, ...defaultActions].reverse();
      return result;
    },
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
    onMapClick() {
      var port = api.getPort();
      shell.openExternal(`http://127.0.0.1:${port}/${this.task.id}/getMap`);
    },
    onDeleteClick() {
      this.$confirm(
        `该操作将移除 <br/><span style="color:red;">[${this.task.name}]</span> 任务，是否继续？`,
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      ).then(() => {
        // this.$store.dispatch("task/removeTask", this.task);
        this.application.taskManager.removeTask(this.task);
        this.$message({
          type: "success",
          message: "移除成功！",
        });
      });
    },
    onStartClick() {
      if (!this.task.setEnable(true)) {
        this.$msg.error(`[${this.task.path}] 路径不存在`);
        return;
      }
      this.application.taskManager.changeTaskOptions(this.task);
      this.$msg.success(`[${this.task.id}] 已启动`);
    },
    onStopClick() {
      this.task.setEnable(false);
      this.application.taskManager.changeTaskOptions(this.task);
      this.$msg.success(`[${this.task.id}] 已停止`);
    },
    onFolderClick() {
      showItemInFolder(this.task.path, {
        errorMsg: `[${this.task.path}] 文件不存在`,
        errorFun: () => {
          this.task.setEnable(false);
        },
      });
    },
    onInfoClick() {
      this.$store.dispatch("task/showTaskItemInfoDialog", this.task);
    },
    createUrl(element) {
      var address = element.address;
      var port = api.getPort();
      return `http://${address}:${port}/${this.task.id}/` + this.task.getUrl();
    },
    handleCommand(url) {
      this.$electron.clipboard.writeText(url);
      this.$msg.success("复制成功！");
    },
  },
};
</script>

<style lang="scss">
.task-item-actions {
  height: 24px;
  padding: 0 10px;
  margin: 0;
  overflow: hidden;
  user-select: none;
  cursor: default;
  text-align: right;
  direction: rtl;
  border: 1px solid #f5f5f5;
  // color: #f5f5f5;
  background-color: #fff;
  border-radius: 14px;
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    width: auto;
    border: 1px solid #e69a4f;
    // background-color: rgb(230, 154, 79);
  }

  & > .task-item-action {
    display: inline-block;
    padding: 5px;
    margin: 0 4px;
    font-size: 0;
    cursor: pointer;
    color: #606266;

    &:hover {
      color: rgb(230, 154, 79);

      & .el-dropdown {
        color: rgb(230, 154, 79);
      }
    }

    :focus {
      outline-width: 0;
    }
  }
}
</style>