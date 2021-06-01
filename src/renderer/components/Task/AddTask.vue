<template>
  <el-dialog
    width="64vw"
    custom-class="tab-title-dialog add-task-dialog"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <el-form ref="taskForm" label-position="left" :model="form">
      <el-tabs :value="type">
        <el-tab-pane label="添加任务" name="file">
          <el-form-item>
            <ts-select-files :change="handleTaskChange" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-row :gutter="12">
        <el-col :span="12" :xs="24">
          <el-form-item label="任务名称" :label-width="formLabelWidth">
            <el-input v-model="form.taskName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { ADD_TASK_TYPE } from "../../../shared/constants";
import SelectFileVue from "./SelectFile.vue";
export default {
  name: "ts-add-task",
  components: {
    [SelectFileVue.name]: SelectFileVue,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: ADD_TASK_TYPE.FILE,
    },
  },
  data() {
    return {
      formLabelWidth: "100px",
      form: {},
      rules: {},
    };
  },
  methods: {
    handleTaskChange(filePath, fileStats) {
      
    },
    handleClose() {
      this.$store.dispatch("app/hideAddTaskDialog");
      this.$store.dispatch("app/updateAddTaskOptions", {});
    },
    handleTorrentChange(taskPath) {
      this.form.taskPath = taskPath;
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
  .dialog-footer {
    .chk {
      float: left;
      line-height: 28px;
      &.el-checkbox {
        & .el-checkbox__input {
          line-height: 19px;
        }
        & .el-checkbox__label {
          padding-left: 6px;
        }
      }
    }
  }
}
</style>