<template>
  <div>
    <div class="task-urls">
      <el-input
        readonly
        size="mini"
        v-for="(item, index) in networkInterfaces"
        :key="index"
        :value="createUrl(id, url, item)"
        @focus="copy(id, url, item)"
      >
      </el-input>
    </div>
    <div>
      {{ this.useData | bytesToSize }}/{{ this.totalData | bytesToSize }}
    </div>
    <div v-if="this.useData > 0">
      {{ this.useData | bytesToSize }}/{{ this.totalData | bytesToSize }}
    </div>
  </div>
</template>

<script>
import os from "os";
import { remote } from "electron";
import path from "path";
import { FILE_STATUS } from "../../../shared/constants";
import { bytesToSize } from "../../../shared/utils";

export default {
  name: "ts-task-urls",
  props: {
    id: {
      type: String,
    },
    url: {
      type: String,
    },
    useData: {
      type: Number,
      default: 0,
    },
    totalData: {
      type: Number,
      default: 0,
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
.task-urls {
  position: absolute;
  top: 50px;
  right: 46px;
  width: 352px;
}
</style>