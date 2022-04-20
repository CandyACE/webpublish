<template>
  <el-dialog
    width="64vw"
    custom-class="tab-title-dialog add-task-dialog"
    :visible.sync="visible"
    :before-close="handleClose"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form ref="taskForm" label-position="left" :model="form" :rules="rules">
      <el-tabs :value="type" @tab-click="handleTabClick">
        <el-tab-pane :label="`${$t('task.new-folder-task')}`" name="default">
          <el-form-item>
            <ts-select-files v-on:change="handleTaskChange" ref="selectFiles" />
          </el-form-item>
          <el-row :gutter="12">
            <el-col :span="24" :xs="24">
              <el-form-item
                prop="taskName"
                :label="`${$t('task.task-name')}: `"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.taskName" spellcheck="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item
                :label="`${$t('task.task-base-path')}: `"
                prop="id"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.id" spellcheck="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12" v-if="showFileTypeSelection">
            <el-form-item label="任务类别：" :label-width="formLabelWidth">
              <el-radio v-model="form.selectTaskType" label="file">
                {{ $t("task.task-file-mode-file") }}
              </el-radio>
              <el-radio v-model="form.selectTaskType" label="mbtiles">
                {{ $t("task.task-file-mode-mbtiles") }}
              </el-radio>
            </el-form-item>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="24" :xs="24">
              <el-form-item>
                <el-checkbox v-model="form.gzip">
                  {{ $t("task.task-enable-gzip") }}
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <ts-task-limit
            ref="taskLimit"
            :showLimit="showLimit"
            :type="form.selectTaskType"
            :limitData="form.limit"
          ></ts-task-limit>
          <div v-if="taskType == 'directory'">
            <el-row :gutter="12">
              <el-col :span="24" :xs="24">
                <el-form-item>
                  <el-checkbox v-model="form.disenableDirectoryView">{{
                    $t("task.task-disenable-directory")
                  }}</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="添加反代理" name="proxy">
          <el-row :gutter="12">
            <el-col :span="24" :xs="24">
              <el-form-item
                prop="taskName"
                :label="`${$t('task.task-name')}`"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.taskName" spellcheck="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item
                :label="`${$t('task.task-base-path')}: `"
                prop="id"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.id" spellcheck="false"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item
                :label="`${$t('task.task-proxy-path')}: `"
                prop="taskPath"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.taskPath" spellcheck="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="24">
          <el-button @click="handleCancel()">{{ $t("app.cancel") }}</el-button>
          <el-button type="primary" @click="submitForm('taskForm')">
            {{ $t("app.submit") }}
          </el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { ADD_TASK_TYPE, TASK_STATUS } from "../../../shared/constants";
import SelectFileVue from "./SelectFile.vue";
import { guid } from "../../../shared/twtools";
import { bytesToSize } from "../../../shared/utils";
import { mapState } from "vuex";
import TaskLimitVue from "./TaskLimit.vue";

export default {
  name: "ts-add-task",
  components: {
    [SelectFileVue.name]: SelectFileVue,
    [TaskLimitVue.name]: TaskLimitVue,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: ADD_TASK_TYPE.DEFAULT,
    },
  },
  computed: {
    ...mapState("task", {
      taskList: (state) => state.taskList,
    }),
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
      if (this.type == ADD_TASK_TYPE.DEFAULT) return callback();
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
      showFileTypeSelection: false,
      showLimit: false,
      taskType: "",
      form: {},
      rules: {
        taskName: [{ validator: checkName, trigger: "blur" }],
        id: [{ validator: checkId, trigger: "blur" }],
        taskPath: [{ validator: checkProxyPath, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleOpen() {
      this.reset();
    },
    initForm() {
      return {
        taskPath: "",
        taskName: "",
        id: "",
        selectTaskType: TASK_STATUS.FILE,
        gzip: true,
        limit: 0,
        disenableDirectoryView: false,
      };
    },
    reset() {
      this.form = this.initForm();
      this.showLimit = false;
      this.showFileTypeSelection = false;
    },
    formatTooltip(val) {
      return bytesToSize(val);
    },
    handleTaskChange(raw, fileStats) {
      if (raw === "") {
        this.reset();
        return;
      }
      if (this.taskList.find((e) => e.path === raw.path)) {
        this.$msg.error("该任务已经存在！");
        this.$store.dispatch("app/hideAddTaskDialog");
        return;
      }
      this.form.taskPath = raw.path;
      this.form.taskName = raw.name;
      this.taskType = fileStats;
      this.showFileTypeSelection = this.taskType == TASK_STATUS.MBTILES;
      this.form.selectTaskType = TASK_STATUS.FILE;
      this.form.disenableDirectoryView = false;
      this.form.id = guid();
    },
    handleClose() {
      this.$store.dispatch("app/hideAddTaskDialog");
      this.$store.dispatch("app/updateAddTaskOptions", {});
    },
    handleTabClick(tab, event) {
      this.reset();
      this.$refs["selectFiles"].handleTrashClick();
      this.form.id = guid();
      this.$store.dispatch("app/changeAddTaskType", tab.name);
    },
    handleClosed() {
      this.reset();
    },
    handleCancel() {
      this.$store.dispatch("app/hideAddTaskDialog");
    },
    addTask(options) {
      // this.$store.dispatch("task/addTask", options).catch((err) => {
      //   this.$msg.error(err.message);
      // });
      this.application.taskManager.addTask(options);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        if (this.type === ADD_TASK_TYPE.PROXY) {
          this.taskType = TASK_STATUS.PROXY;
        }

        try {
          var limit = this.$refs["taskLimit"];
          var item = {
            id: this.form.id || guid(),
            name: this.form.taskName,
            path: this.form.taskPath,
            enable: true,
            gzip: this.form.gzip,
            type: this.taskType,
            limitData: limit.showLimit ? Number(limit.limitData) : 0,
            disenableDirectoryView: this.form.disenableDirectoryView,
          };

          if (item.type !== "mbtiles") {
            item.limitData = item.limitData * 1024 * 1024;
          }

          this.addTask(item);

          this.$store.dispatch("app/hideAddTaskDialog");
        } catch (error) {
          this.$msg.error(error.message);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.el-dialog.add-task-dialog {
  max-width: 632px;
  min-width: 380px;
  overflow: hidden;
  border-radius: 10px;
  .task-advanced-options .el-form-item:last-of-type {
    margin-bottom: 0;
  }
  .el-tabs__header {
    user-select: none;
  }
  .el-input-number.el-input-number--mini {
    width: 100%;
  }
  .help-link {
    font-size: 12px;
    line-height: 14px;
    padding-top: 7px;
    > a {
      color: #909399;
    }
  }
  .el-dialog__footer {
    padding-top: 20px;
    background-color: #f5f5f5;
    border-radius: 0 0 5px 5px;
  }
}
</style>