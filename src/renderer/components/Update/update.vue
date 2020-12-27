<template>
  <transition name="el-zoom-in-bottom">
    <div class="newVersion" v-if="state === stateType.hasNew">
      <span
        >获取到新版本<el-link type="primary" @click="update"
          >立刻更新！</el-link
        ></span
      >
    </div>
    <div class="newVersion" v-else-if="state === stateType.download">
      正在下载...{{ progress }}%
    </div>
    <div v-else-if="state === stateType.error"></div>
  </transition>
</template>

<script>
import updateType from "../../../main/helper/updateType";

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
          this.progress = data.percent;
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

<style lang="scss" scoped>
.newVersion {
  background-color: blanchedalmond;
  position: absolute;
  bottom: 0px;
  width: 100%;
  text-align: center;
  font-size: 14px;

  .el-link {
    vertical-align: top !important;
  }
}
</style>