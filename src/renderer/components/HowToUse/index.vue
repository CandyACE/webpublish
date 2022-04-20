<template>
  <el-dialog
    custom-class="howtouse-dialog"
    :visible.sync="visible"
    lock-scroll
    :show-close="false"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-container>
      <el-header class="howtouse-title">
        <img :src="imagePath" />
      </el-header>
      <el-main class="howtouse-content">
        <div>快来试一下发布你的第一个文件、文件夹、MBTiles吧！</div>
      </el-main>
      <el-footer class="howtouse-footer">
        <el-button @click="handleClick" class="btn" size="small"
          >来试一下！</el-button
        >
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
export default {
  name: "ts-howtouse",
  data() {
    return {
      imagePath: "static/image/howtouse.gif",
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      this.$store.dispatch("app/hideHowtousePanel");
    },
  },
};
</script>

<style lang="scss">
.el-dialog.howtouse-dialog {
  width: 700px !important;
  overflow: hidden;
  border-radius: 10px;

  .el-dialog__header {
    margin: 0;
    padding: 0;
  }

  .el-dialog__body {
    margin: 0;
    padding: 0;
  }

  .howtouse-title {
    padding: 0 !important;
    height: auto !important;
  }

  .howtouse-content {
    padding: 0;
    margin: 0;
    > div {
      text-align: center;
    //   color: #ff9f5f;
    }
  }

  .howtouse-footer {
    text-align: right;
    padding-top: 12px;
  }
}
</style>