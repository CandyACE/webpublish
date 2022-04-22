<template>
  <ul :key="task.id" class="task-item-actions" v-on:dbclick.stop="() => { }">
    <li v-for="action in taskActions" :key="action" class="task-item-action">
      <i v-if="action === 'STOP'" @click.stop="onStopClick">
        <el-tooltip :content="`${$t('task.stop')}`">
          <ts-icon name="task-stop-line" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'START'" @click.stop="onStartClick">
        <el-tooltip :content="`${$t('task.active')}`">
          <ts-icon name="task-start-line" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'FOLDER'" @click.stop="onFolderClick">
        <el-tooltip :content="`${$t('task.show-in-folder')}`">
          <ts-icon name="folder" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'INFO'" @click.stop="onInfoClick">
        <el-tooltip :content="`${$t('task.property')}`">
          <ts-icon name="node" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'DELETE'" @click.stop="onDeleteClick">
        <el-tooltip :content="`${$t('task.remove')}`">
          <ts-icon name="trash" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
      <i v-if="action === 'LINK'">
        <el-dropdown
          :show-timeout="0"
          @command="handleCommand"
          @visible-change="handleVisibleChanged"
        >
          <span>
            <ts-icon name="link" width="14" height="14"></ts-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(address, index) in urls"
              :key="index"
              :command="address"
              :disabled="!task.enable"
            >
              <span>{{ address }}</span>
              <span>
                <ts-icon
                  name="arrow-up"
                  width="10"
                  height="10"
                  @click.native="handleLinkOpen(address)"
                ></ts-icon>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </i>
      <i v-if="action === 'WMTS'" @click.stop="onMapClick">
        <el-tooltip :content="$t('task.task-map-preview')">
          <ts-icon name="image" width="14" height="14"></ts-icon>
        </el-tooltip>
      </i>
    </li>
  </ul>
</template>

<script>
import { TASK_STATUS } from "../../../shared/constants";
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
import "@/components/Icons/arrow-up";
import os from "os";
import api from "../../api";
import { shell } from "electron";
import { showItemInFolder } from "../Native/utils";
import { cloneDeep } from "lodash";

// const taskActionsMap = {
//   [TASK_STATUS.FILE]: [],
// };

export default {
  name: "ts-task-item-actions",
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {
      urls: [],
    };
  },
  computed: {
    taskCommonActions() {
      let result = this.task.enable ? ["STOP"] : ["START"];
      if (this.task.type === TASK_STATUS.MBTILES) {
        result.push("WMTS");
      }
      result.push('LINK');
      if (this.task.type !== TASK_STATUS.PROXY) {
        result.push("FOLDER");
      }
      return result;
    },
    taskActions() {
      const { taskCommonActions } = this;
      const defaultActions = ["INFO", "DELETE"];
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
      let taskName = `${this.task.name}`;
      this.$confirm(
        this.$t("task.remove-task-confirm", { taskName }),
        this.$t("task.remove-task"),
        {
          confirmButtonText: this.$t("app.yes"),
          cancelButtonText: this.$t("app.no"),
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      ).then(() => {
        this.application.taskManager.removeTask(this.task);
        this.$msg({
          type: "success",
          message: this.$t("task.remove-task-success", { taskName }),
        });
      });
    },
    onStartClick() {
      if (!this.task.setEnable(true)) {
        this.$msg.error(
          this.$t("task.path-not-exist", { taskPath: this.task.path })
        );
        return;
      }
      this.application.taskManager.changeTaskOptions(this.task);
      this.$msg.success(
        this.$t("task.task-start-success", { taskName: this.task.name })
      );
    },
    onStopClick() {
      this.task.setEnable(false);
      this.application.taskManager.changeTaskOptions(this.task);
      this.$msg.success(
        this.$t("task.task-stop-success", { taskName: this.task.name })
      );
    },
    onFolderClick() {
      showItemInFolder(this.task.path, {
        errorMsg: this.$t("task.path-no-exist", { taskPath: this.task.path }),
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
    async createUrls(elements) {
      let result = [];
      let url = this.task.getUrl();
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let address = element.address;
        var port = api.getPort();
        this.urls.push(`http://${address}:${port}/${this.task.id}/` + url);
        result.push(`http://${address}:${port}/${this.task.id}/` + url);
      }
      return result;
    },
    handleCommand(url) {
      this.$electron.clipboard.writeText(url);
      this.$msg.success(this.$t("task.copy-success"));
    },
    handleLinkOpen(url) {
      shell.openExternal(url);
    },
    handleVisibleChanged(e) {
      if (e) {
        this.urls = [];
        this.createUrls(this.networkInterfaces);
      }
    },
  },
  mounted: function () {
    this.createUrls(this.networkInterfaces);
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