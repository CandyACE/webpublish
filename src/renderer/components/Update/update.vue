<template>
  <transition name="el-zoom-in-bottom">
    <div class="checkUpdate">
      <div class="newVersion" v-if="state === stateType.hasNew">
        <span
          >{{ $t("app.update-available-message")
          }}<el-link type="primary" @click="update">{{
            $t("app.update-now")
          }}</el-link>
          {{ " " + $t("app.or") + " " }}
          <el-link type="primary" @click="openChangedUrl">{{
            $t("about.release")
          }}</el-link></span
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
    </div>
  </transition>
</template>

<script>
import updateType from "../../../main/helper/updateType";
import { shell } from "electron";
import { remote } from "electron";

export default {
  name: "ts-update",
  mounted() {
    var application = remote.getGlobal("application");
    application.updateManager.on("update-message", this.updateEvent);

    application.updateManager.checkForUpdates();
    // this.$electron.ipcRenderer.on("update-message", (event, type, data) => {
    //   console.log(type);
    //   switch (type) {
    //     case updateType.NotAvailable:
    //       this.state = this.stateType.None;
    //       break;
    //     case updateType.Available:
    //       this.state = this.stateType.hasNew;
    //       break;
    //     case updateType.Error:
    //       break;
    //     case updateType.Checking:
    //       break;
    //     case updateType.Progress:
    //       this.state = this.stateType.download;
    //       this.progress = data.percent.toFixed(2);
    //       break;
    //     default:
    //       break;
    //   }
    // });

    // this.$electron.ipcRenderer.send(updateType.checkNow);
  },
  methods: {
    updateEvent({ type, data }) {
      console.log(type);
      switch (type) {
        case updateType.NotAvailable:
          this.state = this.stateType.noNew;
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
    },
    update() {
      // this.$electron.ipcRenderer.send(updateType.update);
      var application = remote.getGlobal("application");
      application.updateManager.update();
    },
    openChangedUrl() {
      try {
        shell.openExternal(
          "https://gitee.com/tstwt/webpublish/blob/main/CHANGELOG.md"
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
.checkUpdate {
  width: 100%;
 
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
}
</style>