<template>
  <el-link type="primary" class="checkUpdate" @click="checkUpdate"
    >检查更新...</el-link
  >
</template>

<script>
const remote = require('@electron/remote')
export default {
  name: "ts-check-update",
  methods: {
    checkUpdate() {
      remote.getGlobal("application").updateManager.checkForUpdates(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.checkUpdate {
  margin-top: 5px;
}
</style>