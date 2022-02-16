<template>
  <el-container class="content panel" direction="vertical">
    <el-header class="panel-header" height="84">
      <h4 class="hidden-xs-only">{{ title }}</h4>
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
        <el-form-item
          :label="`${$t('options.port')}: `"
          :label-width="formLabelWidth"
        >
          <el-col class="form-item-sub" :span="24">
            <el-input-number
              v-model="form.port"
              controls-position="right"
            ></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="`${$t('options.startup')}: `"
          :label-width="formLabelWidth"
        >
          <el-col class="form-item-sub" :span="24">
            <el-checkbox v-model="form.openAtLogin">
              {{ $t("options.open-at-login") }}</el-checkbox
            ></el-col
          >
          <el-col class="form-item-sub" :span="24">
            <el-checkbox v-model="form.keepWindowState">
              {{ $t("options.keep-window-state") }}
            </el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="`${$t('options.language')}`"
          :label-width="formLabelWidth"
        >
          <el-col class="form-item-sub" :span="16">
            <el-select
              v-model="form.locale"
              @change="handleLocaleChange"
              :placeholder="$t('options.change-language')"
            >
              <el-option
                v-for="item in locales"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="`${$t('options.auto-update')}: `"
          :label-width="formLabelWidth"
        >
          <el-col class="form-item-sub" :span="24">
            <el-checkbox :checked="true" disabled>
              {{ $t("options.auto-check-update") }}
            </el-checkbox>
            <div
              class="el-form-item__info"
              style="margin-top: 8px"
              v-if="form.lastCheckUpdateTime !== 0"
            >
              {{
                `${$t("options.last-check-update-time")} ` +
                (form.lastCheckUpdateTime !== 0
                  ? new Date(form.lastCheckUpdateTime).toLocaleString()
                  : new Date().toLocaleString())
              }}
              <span class="action-link" @click.prevent="onCheckUpdateClick">{{
                $t("app.check-updates-now")
              }}</span>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="openDevTools">打开开发工具</el-button>
        </el-form-item>
        <el-form-item label="其他：" :label-width="formLabelWidth" v-if="false">
          <el-col class="form-item-sub" :span="24">
            <el-checkbox v-model="form.userExperience">
              用户体验计划<el-popover
                title="用户体验计划"
                trigger="hover"
                width="200"
              >
                <p>
                  此计划会收集用户在打开软件的次数，并且发送回指定服务器进行存储，方便统计使用人数量和分布。为后期优化提供数据参考。
                </p>
                <p>只会发送登录地址，不会发送隐私数据和本地文件名等。</p>
                <i
                  slot="reference"
                  class="el-icon-warning-outline"
                ></i></el-popover></el-checkbox
          ></el-col>
        </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button type="primary" @click="submitForm('basicForm')">{{
          $t("options.save")
        }}</el-button>
        <el-button @click="resetForm('basicForm')">{{
          $t("options.discard")
        }}</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { calcFormLabelWidth, diffConfig } from "../../../shared/utils";
import { cloneDeep } from "lodash";
import is from "electron-is";
import { remote } from "electron";
import { availableLanguages, getLanguage } from "../../../shared/locales";
import { getLocaleManager } from "../Locale";

const initialForm = (config) => {
  const {
    port,
    autoStart,
    keepWindowState,
    userExperience,
    lastCheckUpdateTime,
    locale,
  } = config;
  const result = {
    port,
    autoStart,
    keepWindowState,
    // userExperience,
    lastCheckUpdateTime,
    locale,
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
      locales: availableLanguages,
      rules: {},
    };
  },
  computed: {
    title() {
      return this.$t("options.basic");
    },
  },
  methods: {
    handleLocaleChange(locale) {
      const lng = getLanguage(locale);
      getLocaleManager().changeLanguage(lng);
      this.$electron.ipcRenderer.send(
        "command",
        "application:change-locale",
        lng
      );
    },
    resetForm(formName) {
      this.syncFormConfig();
    },
    syncFormConfig() {
      this.$store.dispatch("options/fetchOptions").then((config) => {
        this.form = initialForm(config);
        this.formOriginal = cloneDeep(this.form);
      });
    },
    openDevTools() {
      let _this = this;
      const application = remote.getGlobal('application');
      let windows = application.windowManager.getWindows();
      for (const item in windows) {
        if (Object.hasOwnProperty.call(windows, item)) {
          const element = windows[item];
          element.openDevTools();
        }
      }
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
            this.$msg.success(this.$t("options.save-success-message"));
          })
          .catch(() => {
            this.$msg.error(this.$t("options.save-fail-message"));
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
    onCheckUpdateClick() {
      this.$electron.ipcRenderer.send(
        "command",
        "application:check-for-updates"
      );
      this.$msg.info(this.$t("app.checking-for-updates"));
      this.$store.dispatch("options/fetchOptions").then((config) => {
        const { lastCheckUpdateTime } = config;
        this.form.lastCheckUpdateTime = lastCheckUpdateTime;
      });
    },
  },
};
</script>

<style lang="scss">
</style>