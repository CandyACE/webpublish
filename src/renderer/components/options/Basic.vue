<template>
  <el-container class="content panel" direction="vertical">
    <el-header class="panel-header" height="84">
      <h4 class="hidden-xs-only">通用</h4>
    </el-header>
    <el-main class="panel-content">
      <el-form
        class="form-options"
        ref="basicForm"
        label-position="right"
        size="mini"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="基础设置：" :label-width="formLabelWidth">
          <el-col class="form-item-sub" :span="24">
            服务端口
            <el-input-number
              v-model="form.port"
              controls-position="right"
              label="服务端口"
            ></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="启动：" :label-width="formLabelWidth">
          <el-col class="form-item-sub" :span="24">
            <el-checkbox v-model="form.openAtLogin">
              开机自动启动</el-checkbox
            ></el-col
          >
          <el-col class="form-item-sub" :span="24">
            <el-checkbox v-model="form.keepWindowState">
              恢复上次退出时的窗口大小和位置
            </el-checkbox>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button type="primary" @click="submitForm('basicForm')"
          >保存并应用</el-button
        >
        <el-button @click="resetForm('basicForm')">放弃</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { calcFormLabelWidth, diffConfig } from "../../../shared/utils";
import { cloneDeep } from "lodash";
import is from "electron-is";
import { remote } from "electron";

const initialForm = (config) => {
  const { port, autoStart, keepWindowState } = config;
  const result = {
    port,
    autoStart,
    keepWindowState,
  };
  return result;
};

export default {
  name: "ts-options-basic",
  data() {
    const { locale } = this.$store.state.options.config;
    const form = initialForm(this.$store.state.options.config);
    const formOriginal = cloneDeep(form);
    return {
      form,
      formOriginal,
      formLabelWidth: calcFormLabelWidth(locale),
      rules: {},
    };
  },
  methods: {
    resetForm(formName) {
      this.syncFormConfig();
    },
    syncFormConfig() {
      this.$store.dispatch("options/fetchOptions").then((config) => {
        this.form = initialForm(config);
        this.formOriginal = cloneDeep(this.form);
      });
    },
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.log("[WebPublish] options form valid:", valid);
          return false;
        }

        const { openAtLogin } = this.form;
        const changed = diffConfig(this.formOriginal, this.form);
        const data = {
          ...changed,
        };
        console.log("[WebPublish] options changed data:", data);

        this.$store
          .dispatch("options/save", data)
          .then(() => {
            this.syncFormConfig();
            this.$message.success("设置保存成功！");
          })
          .catch(() => {
            this.$message.error("设置保存失败！");
          });

        if (is.renderer()) {
          const application = remote.getGlobal("application");
          if (openAtLogin) {
            application.autoLaunchManager.enable();
          } else {
            application.autoLaunchManager.disable();
          }

          if (data.port) _this.application.serverManager.restart();
        }
      });
    },
  },
};
</script>

<style lang="scss">
</style>