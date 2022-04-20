<template>
  <el-dialog
    custom-class="welcome-dialog"
    :visible.sync="visible"
    lock-scroll
    :show-close="false"
    :close-on-click-modal="false"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-container>
      <el-header class="welcome-title">
        <img :src="imagePath" />
        <div>
          <span>{{ version }}</span>
        </div>
      </el-header>
      <el-main class="welcome-content">
        <div class="description">{{ description }}</div>
        <div class="updateInfos">
          <p
            class="updateInfo"
            :key="index"
            v-for="(info, index) in updateInfo"
          >
            {{ index + 1 }}. {{ info }}
          </p>
        </div>
      </el-main>
      <el-footer class="welcome-footer">
        <el-button @click="handleClick" class="btn" round size="medium"
          >确定</el-button
        >
      </el-footer>
    </el-container>
  </el-dialog>
</template>
<script>
export default {
  name: "ts-welcome",
  data() {
    return {
      visible: false,
      version: __VERSION__,
      updateInfo: __UPDATEINFO__,
      description: __DESCRIPTION__,
      imagePath: "static/image/newVersion.png",
    };
  },
  // props: {
  //   visible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  mounted() {
    this.visible = false;
    this.$store.dispatch("options/fetchOptions").then((config) => {
      const { lastUpdateVersion } = config;
      if (this.version !== lastUpdateVersion) {
        this.visible = true;
        this.$store.dispatch("options/save", {
          lastUpdateVersion: this.version,
        });
      }
    });
  },
  methods: {
    handleClosed() {},
    handleClick() {
      this.visible = false;
      if (this.application.taskManager.selectTaskList.length == 0) {
        this.$store.dispatch("app/showHowtousePanel");
      }
    },
  },
};
</script>

<style lang="scss">
.el-dialog.welcome-dialog {
  width: 405px !important;
  max-height: 80vh;

  .el-dialog__header {
    margin: 0;
    padding: 0;
  }

  .el-dialog__body {
    margin: 0;
    padding: 0;
  }

  .welcome-title {
    height: 277px !important;
    margin: 0;
    padding: 0;
    margin-top: -70px;
    // background: -webkit-linear-gradient(90deg, #fdf4e8, rgb(253, 232, 232));

    img {
      width: 100%;
      object-fit: cover;
    }

    div {
      width: 100%;
      position: absolute;
      top: 170px;
      text-align: center;

      span {
        color: rgb(255, 132, 52);
        font-size: 18px;
      }
    }
  }

  .welcome-content {
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
    height: calc(100vh - 227px - 15vh - 90px);

    .description {
      margin: auto 20px;
      font-size: 18px;
      color: #ff9f5f;
    }

    .updateInfos {
      .updateInfo {
        margin-left: 50px;
        margin-right: 50px;
        font-size: 16px;
      }
    }
  }

  .welcome-footer {
    text-align: center;
    padding-top: 12px;
  }
}
</style>