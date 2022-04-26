<template>
  <div class="ts-task-grid" v-if="files && files.length > 0">
    <div class="ts-table-wrapper">
      <el-table
        stripe
        ref="filesTable"
        :height="height"
        :data="files"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          :label="`${$t('task.task-name')}`"
          max-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              spellcheck="false"
            ></el-input></template
        ></el-table-column>
        <el-table-column :label="`${$t('task.task-base-path')}`">
          <template slot-scope="scope"
            ><el-input v-model="scope.row.uid" spellcheck="false"></el-input
          ></template>
        </el-table-column>
        <el-table-column :label="`${$t('task.task-file-mode')}`" width="80">
          <template slot-scope="scope"
            ><span>{{ scope.row.type }}</span></template
          >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ts-task-grid",
  props: {
    height: {
      type: [Number, String],
    },
    files: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>

<style lang="scss">
.ts-task-grid {
  input {
    border-color: transparent;
  }
}
</style>