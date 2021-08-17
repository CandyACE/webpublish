<template>
  <div class="task-progress" v-if="Number(this.limitData) != 0">
    <div v-if="type === 'size'">
      <span>{{ this.useData | bytesToSize }} / </span
      ><span>{{ this.limitData | bytesToSize }}</span>
    </div>
    <div v-else>
      <span>{{ this.useData | countToSize }} / </span
      ><span>{{ this.limitData | countToSize }}</span>
    </div>
    <el-progress
      :percentage="percent"
      :color="progressColor"
      :type="taskProgressType"
      :show-text="false"
      :width="20"
    ></el-progress>
  </div>
  <div v-else class="task-progress-nolimit">
    <span v-if="type === 'size'"
      >已使用：<span>{{ this.useData | bytesToSize }}</span></span
    >
    <span v-else>
      已使用：<span>{{ this.useData | countToSize }}</span>
    </span>
  </div>
</template>

<script>
import os from "os";
import { remote } from "electron";
import path from "path";
import { FILE_STATUS } from "../../../shared/constants";
import { bytesToSize, calcProgress, countToSize } from "../../../shared/utils";
import { mapState } from "vuex";

export default {
  name: "ts-task-progress",
  props: {
    type: {
      type: String,
      default: "size",
    },
    useData: {
      default: 0,
    },
    limitData: {
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
    ...mapState("task", {
      taskProgressType: (state) => state.taskProgressType,
    }),
    percent() {
      return calcProgress(this.limitData, this.useData);
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
    countToSize,
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
.task-progress-nolimit {
  position: absolute;
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