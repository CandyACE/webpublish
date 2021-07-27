<template>
  <el-dialog
    custom-class="app-about-dialog"
    width="61.8vw"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <ts-app-info></ts-app-info>
    <ts-copyright />
  </el-dialog>
</template>

<script>
import AppInfoVue from "./AppInfo.vue";
import CopyrightVue from "./Copyright.vue";
export default {
  name: "ts-about-panel",
  components: {
    [AppInfoVue.name]: AppInfoVue,
    [CopyrightVue.name]: CopyrightVue,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClose() {
      this.$store.dispatch("app/hideAboutPanel");
    },
  },
};
</script>

<style lang="scss">
.app-about-dialog {
  max-width: 632px;
  min-width: 380px;
  .el-dialog__header {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>