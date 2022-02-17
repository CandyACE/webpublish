<template>
  <div id="task-limit">
    <el-row :gutter="12">
      <el-col :span="24">
        <el-form-item>
          <el-checkbox v-model="showLimit">
            {{ textLimit }}
          </el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="showLimit" :gutter="12">
      <el-col :span="13">
        <el-form-item :label="textLimit" :label-width="labelWidth"
          ><el-input-number
            v-model.number="limitData"
            controls-position="right"
            size="mini"
          ></el-input-number
        ></el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          ><span style="margin-left: 10px">{{
            type === "mbtiles" ? $t("task.task-count") : "MB"
          }}</span></el-form-item
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ts-task-limit",
  props: {
    showLimit: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "file",
    },
    labelWidth: {
      type: String,
      default: "100px",
    },
    limitData: {
      default: 0,
    },
  },
  computed: {
    textLimit() {
      return this.type === "mbtiles" ? "限制次数" : this.$t("task.task-limit");
    },
  },
};
</script>

<style lang="scss">
#task-limit {
}
</style>