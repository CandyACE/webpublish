<template>
  <transition name="el-zoom-in-bottom">
    <div class="newVersion" v-if="state === stateType.hasNew">
      <span
        >获取到新版本<el-link type="primary" @click="update"
          >立刻更新！</el-link
        >
        或者
        <el-link type="primary" @click="openChangedUrl"
          >查看更新日志</el-link
        ></span
      >
    </div>
    <el-progress
      class="newVersion"
      :text-inside="true"
      :stroke-width="17"
      v-else-if="state === stateType.download"
      :percentage="progress"
    ></el-progress>
    <!-- <div class="newVersion" v-else-if="state !== stateType.download">
      正在下载...{{ progress }}%
    </div> -->
    <div v-else-if="state === stateType.error"></div>
  </transition>
</template>

<script>
import updateType from "../../../main/helper/updateType";
import { shell } from "electron";

export default {
  name: "ts-update",
  mounted() {
    this.$electron.ipcRenderer.on("update-message", (event, type, data) => {
      switch (type) {
        case updateType.NotAvailable:
          this.state = this.stateType.None;
          break;
        case updateType.Available:
          this.state = this.stateType.hasNew;
          break;
        case updateType.Error:
          break;
        case updateType.Checking:
          break;
        case updateType.Progress:
          this.state = this.stateType.download;
          this.progress = data.percent.toFixed(2);
          break;
        default:
          break;
      }
    });

    this.$electron.ipcRenderer.send(updateType.checkNow);
  },
  methods: {
    update() {
      console.log(1);
      this.$electron.ipcRenderer.send(updateType.update);
    },
    openChangedUrl() {
      try {
        shell.openExternal(
          "https://gitee.com/tstwt/webpublish/blob/main/CHANGED.md"
        );
      } catch (error) {
        console.warn(error);
      }
    },
  },
  data() {
    var stateType = {
      hasNew: "hasNew",
      None: "none",
      download: "download",
      error: "error",
      noNew: "noNew",
    };
    return {
      stateType: stateType,
      state: stateType.None,
      progress: 0,
    };
  },
};
</script>

<style lang="scss">
.el-progress-bar__outer {
  border-radius: 0 !important;
  background-color: #3a3e63;
}

.el-progress-bar__inner {
  border-radius: 0 !important;
}

.newVersion {
  background-color: blanchedalmond;
  position: absolute !important;
  bottom: 0px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  z-index: 999999999;

  .el-link {
    vertical-align: top !important;
  }
}
</style>