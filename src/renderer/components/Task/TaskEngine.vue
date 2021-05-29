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
    setTimeout(() => {
      this.startPolling();
    }, 100);
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