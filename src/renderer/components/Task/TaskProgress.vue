<template>
  <div class="task-progress" v-if="Number(this.totalData) != 0">
    <div>
      <span>{{ this.useData | bytesToSize }} / </span
      ><span>{{ this.totalData | bytesToSize }}</span>
    </div>
    <el-progress
      :percentage="percent"
      :color="progressColor"
      :show-text="false"
    ></el-progress>
  </div>
  <div v-else class="task-progress">
    <span
      >已使用：<span>{{ this.useData | bytesToSize }}</span></span
    >
  </div>
</template>

<script>
import os from "os";
import { remote } from "electron";
import path from "path";
import { FILE_STATUS } from "../../../shared/constants";
import { bytesToSize, calcProgress } from "../../../shared/utils";

export default {
  name: "ts-task-progress",
  props: {
    useData: {
      type: Number,
      default: 0,
    },
    totalData: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      progressColor: [
        { color: "#409eff", percentage: 50 },
        { color: "#e6a23c", percentage: 80 },
        { color: "#f56c6c", percentage: 100 },
      ],
    };
  },
  computed: {
    percent() {
      return calcProgress(this.totalData, this.useData);
    },
  },
  methods: {
    createUrl(id, url, element) {
      var address = element.address;
      var application = remote.getGlobal("application");
      var port = application.configManager.getSystemConfig("port", "9090");
      return `http://${address}:${port}/${id}/` + url;
    },
    copy(id, url, element) {
      var path = this.createUrl(id, url, element);
      this.$electron.clipboard.writeText(path);
      this.$msg.success("复制成功！");
    },
  },
  filters: {
    bytesToSize,
  },
};
</script>

<style lang="scss">
.task-progress {
  position: absolute;
  bottom: 20px;
  right: 14px;
  width: 300px;
  text-align: right;
  pointer-events: none;

  & span {
    font-size: 12px;
    color: #9b9b9b;
  }
}
</style>