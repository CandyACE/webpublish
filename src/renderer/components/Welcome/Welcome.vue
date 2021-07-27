<template>
  <el-dialog width="64vw" custom-class="welcome-dialog" :visible.sync="visible">
    <div class="welcome-title"></div>
  </el-dialog>
</template>
<script>
export default {
  name: "ts-welcome",
  data() {
    return {};
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.el-dialog.welcome-dialog {
  max-width: 40vw;

  .el-dialog__header {
    margin: 0;
    padding: 0;
  }

  .el-dialog__body {
    margin: 0;
    padding: 0;
  }



  .welcome-title {
    height: 140px;
    background: -webkit-linear-gradient(0deg,#fdf4e8,rgb(253, 232, 232));
  }
}
</style>