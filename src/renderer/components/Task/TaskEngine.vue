<template>
  <div v-if="false"></div>
</template>

<script>
export default {
  name: "ts-task-engine",
  data() {
    return { interval: 1000 };
  },
  mounted() {
    var _this = this;
    this.application.serverManager.addListener("server", function (err) {
      if (err) {
        _this.$msg.error(err);
        return;
      }
      _this.$msg.success(_this.$t("app.server-start-success"));
    });
    this.application.serverManager.start();

    // setTimeout(() => {
    //   this.startPolling();
    // }, 200);

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
    // startPolling() {
    //   this.timer = setTimeout(() => {
    //     this.polling();
    //     this.startPolling();
    //   }, this.interval);
    // },
    // polling() {
    //   this.$store.dispatch("task/fetchList");
    // },
    // stopPolling() {
    //   clearInterval(this.timer);
    //   this.timer = null;
    // },
  },
};
</script>