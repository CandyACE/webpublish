<template>
  <div v-if="false"></div>
</template>

<script>
import { remote } from "electron";
export default {
  name: "ts-task-engine",
  data() {
    return { interval: 1000 };
  },
  mounted() {
    var _this = this;
    const application = remote.getGlobal("application");
    application.serverManager.addListener("server", function (err) {
      if (err) {
        _this.$message.error(err);
        return;
      }
      _this.$message.success("服务启动成功");
    });
    application.serverManager.start();

    setTimeout(() => {
      this.startPolling();
    }, 100);

    window.onresize = () => {
      if (document.body.clientWidth >= 791) {
        this.$store.dispatch("task/changeTaskProgressType", "line");
      } else {
        this.$store.dispatch("task/changeTaskProgressType", "circle");
      }
    };
  },
  destroyed() {
    this.stopPolling();
  },
  methods: {
    startPolling() {
      this.timer = setTimeout(() => {
        this.polling();
        this.startPolling();
      }, this.interval);
    },
    polling() {
      this.$store.dispatch("task/fetchList");
    },
    stopPolling() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
};
</script>