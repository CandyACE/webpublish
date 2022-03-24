<template>
  <el-dialog
    custom-class="task-info-dialog"
    width="61.8vw"
    v-if="task"
    :title="task.name"
    :show-close="true"
    :visible.sync="visible"
    :before-close="handleClose"
    @closed="handleClosed"
  >
    <el-form ref="taskForm" label-position="left" :model="form">
      <div class="formDiv" v-if="task.type != 'proxy'">
        <el-row :gutter="12">
          <el-form-item
            :label="`${$t('task.task-dir-path')}: `"
            :label-width="formLabelWidth"
          >
            <el-dropdown trigger="click" @command="handleDropDownClick">
              <el-link>{{ task.path }}</el-link>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="showInFolder">{{
                  $t("task.show-in-folder")
                }}</el-dropdown-item>
                <el-dropdown-item command="searchSameTask">{{
                  $t("task.task-search-same")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            prop="taskName"
            :label="`${$t('task.task-name')}: `"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.taskName" spellcheck="false"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            prop="id"
            :label="`${$t('task.task-base-path')}: `"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.id" spellcheck="false"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            :label="`${$t('task.task-file-mode')}: `"
            :label-width="formLabelWidth"
            v-if="showTypeRadio"
          >
            <el-radio v-model="form.selectTaskType" label="file">
              {{ $t("task.task-file-mode-file") }}
            </el-radio>
            <el-radio v-model="form.selectTaskType" label="mbtiles">
              {{ $t("task.task-file-mode-mbtiles") }}
            </el-radio>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            :label="`${$t('task.task-used-stream')}: `"
            :label-width="formLabelWidth"
          >
            <ts-task-progress
              :class="[form.limit != 0 ? '' : 'no-limit']"
              id="taskProgress"
              :useData="form.use"
              :limitData="formLimitMax"
              :type="
                countItems.some((item) => item === form.selectTaskType)
                  ? 'count'
                  : 'size'
              "
            ></ts-task-progress>
            <el-link @click.stop="handleClearUsed">
              {{ $t("task.task-clear-used") }}
            </el-link>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item :span="24">
            <el-checkbox v-model="form.gzip">
              {{ $t("task.task-enable-gzip") }}
            </el-checkbox>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <ts-task-limit
            ref="taskLimit"
            :showLimit="showLimit"
            :type="form.selectTaskType"
            :limitData="formLimitMin"
          ></ts-task-limit>
        </el-row>
        <div v-if="form.selectTaskType == 'directory'">
          <el-row :gutter="12">
            <el-form-item :span="24">
              <el-checkbox v-model="form.disenableDirectoryView">{{
                $t("task.task-disenable-directory")
              }}</el-checkbox>
            </el-form-item>
          </el-row>
        </div>
      </div>
      <div class="formDiv" v-else>
        <el-row :gutter="12">
          <el-form-item
            prop="taskName"
            :label="`${$t('task.task-name')}`"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.taskName" spellcheck="fasle"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            prop="id"
            :label="`${$t('task.task-base-path')}`"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.id" spellcheck="false"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            prop="taskPath"
            :label="`${$t('task.task-proxy-path')}`"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.taskPath" spellcheck="false"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-form-item
            :label="`${$t('task.task-used-stream')}: `"
            :label-width="formLabelWidth"
          >
            <ts-task-progress
              :class="[form.limit != 0 ? '' : 'no-limit']"
              id="taskProgress"
              :useData="form.use"
              :limitData="formLimitMax"
              :type="
                countItems.some((item) => item === form.selectTaskType)
                  ? 'count'
                  : 'size'
              "
            ></ts-task-progress>
            <el-link @click.stop="handleClearUsed">
              {{ $t("task.task-clear-used") }}
            </el-link>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="24">
          <el-button @click="handleClosed">{{ $t("app.cancel") }}</el-button>
          <el-button type="primary" @click="submitForm('taskForm')">
            {{ $t("app.submit") }}
          </el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import "../Icons/folder";
import { showItemInFolder } from "../Native/utils";
import TaskLimitVue from "./TaskLimit.vue";
import TaskProgressVue from "./TaskProgress.vue";
import path from "path";
import { TASK_STATUS } from "../../../shared/constants";

export default {
  name: "ts-task-item-property",
  props: {
    task: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    [TaskProgressVue.name]: TaskProgressVue,
    [TaskLimitVue.name]: TaskLimitVue,
  },
  data() {
    var checkId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("task.task-base-error")));
      }

      var result = this.taskList.find((e) => e.id === value);
      if (result) {
        return callback(new Error(this.$t("task.task-base-exist")));
      }

      callback();
    };

    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("task.task-name-error")));
      }
      callback();
    };

    var checkProxyPath = (rule, value, callback) => {
      if (form.selectTaskType != TASK_STATUS.PROXY) return callback();
      if (!value) {
        return callback(new Error(this.$t("task.task-proxy-error-empty")));
      }
      if (!value.startsWith("http")) {
        return callback(new Error(this.$t("task.task-proxy-error")));
      }
      callback();
    };

    return {
      formLabelWidth: "100px",
      showLimit: false,
      countItems: [TASK_STATUS.MBTILES, TASK_STATUS.PROXY],
      form: {
        gid: "",
        taskName: "",
        taskPath: "",
        id: "",
        limit: 0,
        use: 0,
        selectTaskType: TASK_STATUS.FILE,
        gzip: false,
        disenableDirectoryView: false,
      },
      rules: {
        taskName: [{ validator: checkName, trigger: "blur" }],
        id: [{ validator: checkId, trigger: "blur" }],
        taskPath: [{ validator: checkProxyPath, trigger: "blur" }],
      },
    };
  },
  computed: {
    showTypeRadio() {
      // return false;
      return path.extname(this.task.path) === ".mbtiles";
    },
    formLimitMin() {
      return this.form.selectTaskType === "mbtiles"
        ? Number(this.form.limit).toFixed(1)
        : Number(this.form.limit / 1024 / 1024).toFixed(1);
    },
    formLimitMax() {
      return Number(this.form.limit).toFixed(1);
    },
  },
  watch: {
    task: function (val) {
      if (!val) return {};
      this.form.taskName = val.name;
      this.form.id = val.id;
      this.form.gid = val.gid;
      this.form.taskPath = val.path;
      this.form.limit = Number(val.limitData);
      this.showLimit = Number(val.limitData) !== 0;
      this.form.use = Number(val.useData);
      this.form.selectTaskType = val.type;
      this.form.gzip = val.gzip;
      this.form.disenableDirectoryView = val.disenableDirectoryView;

      if (val.type !== "mbtiles") {
        this.form.limit = (this.form.limit / 1024 / 1024).toFixed(1);
        this.form.use = (this.form.use / 1024 / 1024).toFixed(1);
      }
    },
  },
  methods: {
    handleDropDownClick(command) {
      if (command === "showInFolder") {
        showItemInFolder(this.task.path, {
          errorMsg: this.$t("task.path-no-exist", { taskPath: this.task.path }),
        });
      } else if (command === "searchSameTask") {
        this.application.taskManager.updateSelectTaskList(this.task.path);
      }
    },
    handleClearUsed() {
      this.form.use = 0;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        try {
          var taskLimit = this.$refs["taskLimit"] || {};
          var item = {
            gid: this.form.gid,
            id: this.form.id,
            name: this.form.taskName,
            path: this.form.taskPath,
            useData: this.form.use,
            gzip: this.form.gzip,
            limitData: taskLimit.showLimit ? Number(taskLimit.limitData) : 0,
            type: this.form.selectTaskType,
            disenableDirectoryView: this.form.disenableDirectoryView,
          };

          if (item.type !== "mbtiles") {
            item.limitData = item.limitData * 1024 * 1024;
            // item.useData = item.useData * 1024 * 1024;
          }

          // this.$store.dispatch("task/changeTaskOptions", item);
          this.application.taskManager.changeTaskOptions(item);

          this.$store.dispatch("task/hideTaskItemInfoDialog");
        } catch (error) {
          this.$msg.error(error.message);
        }
      });
    },
    handleClose() {
      this.$store.dispatch("task/hideTaskItemInfoDialog");
    },
    handleClosed(done) {
      this.$store.dispatch("task/updateCurrentTaskItem", null);
    },
  },
};
</script>

<style lang="scss">
.task-info-dialog {
  min-width: 380px;
  .el-dialog__header {
    padding-right: 60px;
  }
  .el-dialog__body {
    position: relative;
  }

  .formDiv {
    margin: 0px 6px;
  }

  .task-name {
    font-size: 14px;
    color: #505753;
    line-height: 26px;
    margin-bottom: 32px;
    margin-right: 200px;
  }
  .el-dialog__footer {
    padding-top: 20px;
    background-color: #f5f5f5;
    border-radius: 0 0 5px 5px;
  }

  #taskProgress {
    position: relative;
    right: 0px;
    width: 100%;
    margin: 7px 0px;
    bottom: 0;
    top: -21px;
    text-align: left;

    &.no-limit {
      right: none !important;
      top: 0 !important;
      margin: 0;
    }
  }
}
</style>