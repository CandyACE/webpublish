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
      <el-tabs :value="type">
        <el-tab-pane label="添加任务" name="default">
          <el-form-item>
            <ts-select-files v-on:change="handleTaskChange" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-row :gutter="12">
        <el-col :span="24" :xs="24">
          <el-form-item
            prop="taskName"
            label="任务名称："
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.taskName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item
            label="二级域名："
            prop="id"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.id"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12" v-if="showFileTypeSelection">
        <el-form-item label="任务类别：" :label-width="formLabelWidth">
          <el-radio v-model="form.selectTaskType" label="file">文件</el-radio>
          <el-radio v-model="form.selectTaskType" label="mbtiles"
            >MBTiles</el-radio
          >
        </el-form-item>
      </el-row>
      <ts-task-limit
        ref="taskLimit"
        :showLimit="showLimit"
        :type="form.selectTaskType"
        :limitData="form.limit"
      ></ts-task-limit>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="24">
          <el-button @click="handleCancel()">取消</el-button>
          <el-button type="primary" @click="submitForm('taskForm')"
            >提交</el-button
          >
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { ADD_TASK_TYPE, FILE_STATUS } from "../../../shared/constants";
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
        return callback(new Error("二级域名不能为空"));
      }

      var result = this.taskList.find((e) => e.id === value);
      if (result) {
        return callback(new Error("已经存在该二级域名"));
      }

      callback();
    };

    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入任务名称"));
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
        selectTaskType: FILE_STATUS.FILE,
        limit: 0,
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
        this.$message.error("该任务已经存在！");
        this.$store.dispatch("app/hideAddTaskDialog");
        return;
      }
      this.form.taskPath = raw.path;
      this.form.taskName = raw.name;
      this.taskType = fileStats;
      this.showFileTypeSelection = this.taskType == FILE_STATUS.MBTILES;
      this.form.selectTaskType = FILE_STATUS.FILE;
      this.form.id = guid();
    },
    handleClose() {
      this.$store.dispatch("app/hideAddTaskDialog");
      this.$store.dispatch("app/updateAddTaskOptions", {});
    },
    handleClosed() {
      this.reset();
    },
    handleCancel() {
      this.$store.dispatch("app/hideAddTaskDialog");
    },
    addTask(options) {
      // this.$store.dispatch("task/addTask", options).catch((err) => {
      //   this.$message.error(err.message);
      // });
      this.application.taskManager.addTask(options);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        try {
          var limit = this.$refs["taskLimit"];
          var item = {
            id: this.form.id,
            name: this.form.taskName,
            path: this.form.taskPath,
            enable: true,
            type: this.taskType,
            limitData: limit.showLimit ? Number(limit.limitData) : 0,
          };

          if (item.type !== "mbtiles") {
            item.limitData = item.limitData * 1024 * 1024;
          }

          this.addTask(item);

          this.$store.dispatch("app/hideAddTaskDialog");
        } catch (error) {
          this.$message.error(error.message);
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