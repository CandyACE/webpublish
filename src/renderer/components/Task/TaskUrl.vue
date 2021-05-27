<template>
  <div>
    <div class="task-urls">
      <el-input
        readonly
        size="mini"
        v-for="(item, index) in networkInterfaces"
        :key="index"
        :value="createUrl(task, item)"
        @focus="copy(task, item)"
      >
      </el-input>
    </div>
    <div>{{ task.useData }}/{{ task.totalData }}</div>
  </div>
</template>

<script>
import os from "os";
import { remote } from "electron";
import path from "path";
import { FILE_STATUS } from "../../../shared/constants";

export default {
  name: "ts-task-urls",
  props: {
    task: {
      type: Object,
      default: null,
    },
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
    createUrl(task, element) {
      var address = element.address;
      var application = remote.getGlobal("application");
      var port = application.configManager.getSystemConfig("port", "9090");
      return `http://${address}:${port}/${task.id}/` + task.getUrl();
    },
    copy(task, element) {
      var path = this.createUrl(task, element);
      this.$electron.clipboard.writeText(path);
      this.$msg.success("复制成功！");
    },
  },
};
</script>

<style lang="scss">
.task-urls {
  position: absolute;
  top: 50px;
  right: 46px;
  width: 352px;
}
</style>