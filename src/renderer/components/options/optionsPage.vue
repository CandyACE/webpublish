<template>
  <div class="parent">
    <div class="top">
      <img src="../../../../static/image/twtoolsLogo.png" />
      <div>快速发布工具</div>
      <div class="version">
        <div>
          版本: <span>{{ version }}</span>
        </div>
        <div>
          编译时间: <span>{{ time }}</span>
        </div>
        <div>
          作者: <span>{{ author }}</span>
        </div>
      </div>
    </div>
    <div class="center">
      <div style="margin-bottom: 10px">
        <el-button type="success" size="small" @click="onSubmit"
          >应用</el-button
        >
      </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="常规" name="default">
          <el-form ref="form" :model="options" label-width="80px" size="mini">
            <el-form-item label="端口号">
              <el-input-number
                v-model="options.default.port"
              ></el-input-number> </el-form-item
          ></el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "options-page",
  data() {
    const port = global.application.configManager.getSystemConfig(
      "port",
      "9090"
    );
    return {
      version: __VERSION__,
      author: __AUTHOR__,
      time: __TIME__,
      activeName: "",
      options: {
        default: {
          port: port,
        },
      },
    };
  },
  methods: {
    onSubmit() {
      // 提交配置
      global.application.configManager.setSystemConfig({
        port: this.options.default.port,
      });

      // 重启服务
      global.application.serverManager.stop();
      global.application.serverManager.start();
    },
  },
};
</script>

<style lang="scss" scoped>
.center {
  padding: 15px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.parent {
  text-align: center;
}

.top {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  margin: 15px;
  padding: 15px;
  font: 15px sans-serif;

  img {
    width: 64px;
    height: 64px;
  }
  .version {
    margin: 5px;
    font: 12px sans-serif;
    color: gray;

    div {
      margin: 5px;
      color: black;

      span{
        color: gray;
      }
    }
  }
}
</style>