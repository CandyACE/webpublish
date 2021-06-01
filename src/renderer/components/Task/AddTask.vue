<template>
  <el-dialog width="64vw"
  custom-class="tab-title-dialog add-task-dialog" :visible.sync="visible" :before-close="handleClose">
    <el-form ref="taskForm" label-position="left" :model="form">
      <el-tabs :value="type">
        <el-tab-pane label="添加任务" name="file">
          <el-form-item>
            
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-dialog>
</template>

<script>
import { ADD_TASK_TYPE } from "../../../shared/constants";
export default {
  name: "ts-add-task",
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
      from: {},
      rules: {},
    };
  },
  methods: {
    handleClose() {
      this.$store.dispatch("app/hideAddTaskDialog");
      this.$store.dispatch("app/updateAddTaskOptions", {});
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