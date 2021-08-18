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
      <el-row :gutter="12">
        <el-form-item label="任务地址：" :label-width="formLabelWidth">
          <el-link @click.stop="">{{ task.path }}</el-link>
        </el-form-item>
      </el-row>
      <el-row :gutter="12">
        <el-form-item
          prop="taskName"
          label="任务名称："
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.taskName"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="12">
        <el-form-item
          prop="id"
          label="二级域名："
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.id"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="12">
        <el-form-item
          label="任务类别："
          :label-width="formLabelWidth"
          v-if="showTypeRadio"
        >
          <el-radio v-model="form.selectTaskType" label="file">文件</el-radio>
          <el-radio v-model="form.selectTaskType" label="mbtiles"
            >MBTiles</el-radio
          >
        </el-form-item>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="15">
          <el-form-item label="使用流量：" :label-width="formLabelWidth">
            <ts-task-progress
              :class="[form.limit != 0 ? '' : 'no-limit']"
              id="taskProgress"
              :useData="form.use"
              :limitData="formLimitMax"
              :type="form.selectTaskType === 'mbtiles' ? 'count' : 'size'"
            ></ts-task-progress>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-link @click.stop="handleClearUsed">清空流量</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-form-item :span="24">
          <el-checkbox v-model="form.gzip">启用 gzip</el-checkbox>
        </el-form-item>
      </el-row>
      <ts-task-limit
        ref="taskLimit"
        :showLimit="showLimit"
        :type="form.selectTaskType"
        :limitData="formLimitMin"
      ></ts-task-limit>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="24">
          <el-button @click="handleClosed">取消</el-button>
          <el-button type="primary" @click="submitForm('taskForm')"
            >提交</el-button
          >
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
    return {
      formLabelWidth: "100px",
      showLimit: false,
      form: {
        gid: "",
        taskName: "",
        id: "",
        limit: 0,
        use: 0,
        selectTaskType: "file",
        gzip: false,
      },
      rules: [],
    };
  },
  computed: {
    showTypeRadio() {
      return false;
      // return path.extname(this.task.path) === ".mbtiles";
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
      this.form.limit = Number(val.limitData);
      this.showLimit = Number(val.limitData) !== 0;
      this.form.use = Number(val.useData);
      this.form.selectTaskType = val.type;
      this.form.gzip = val.gzip;

      // if (val.type !== "mbtiles") {
      //   this.form.limit = (this.form.limit / 1024 / 1024).toFixed(1);
      //   this.form.use = (this.form.use / 1024 / 1024).toFixed(1);
      // }
    },
  },
  methods: {
    handleClearUsed() {
      this.form.use = 0;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        try {
          var taskLimit = this.$refs["taskLimit"];
          var item = {
            gid: this.form.gid,
            id: this.form.id,
            name: this.form.taskName,
            useData: this.form.use,
            gzip: this.form.gzip,
            limitData: taskLimit.showLimit ? Number(taskLimit.limitData) : 0,
            type: this.form.selectTaskType,
          };

          if (item.type !== "mbtiles") {
            item.limitData = item.limitData * 1024 * 1024;
            // item.useData = item.useData * 1024 * 1024;
          }

          // this.$store.dispatch("task/changeTaskOptions", item);
          this.application.taskManager.changeTaskOptions(item);

          this.$store.dispatch("task/hideTaskItemInfoDialog");
        } catch (error) {
          this.$message.error(error.message);
        }
      });
    },
    handlePathClick() {
      showItemInFolder(this.task.path, {
        errorMsg: `[${this.task.path}] 文件不存在`,
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