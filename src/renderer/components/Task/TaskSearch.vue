<template>
  <div class="task-search">
    <el-input
      v-model="value"
      :placeholder="`${$t('app.search-task')}`"
      clearable
      @change="handleChange"
    >
    </el-input>
  </div>
</template>

<script>
export default {
  name: "ts-task-search",
  data() {
    return {
      value: "",
    };
  },
  mounted() {
    this.application.taskManager.searchKeyChanged.addEventListener((key) => {
      this.$nextTick(function () {
        this.value = key;
      });
    });
  },
  methods: {
    handleChange(val) {
      this.application.taskManager.updateSelectTaskList(val);
    },
  },
  // computed: {
  //   searchKey: function () {
  //     return this.application.taskManager.searchKey;
  //   },
  // },
  // watch: {
  //   searchKey(val) {
  //     this.value = val;
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.task-search {
  position: absolute;
  top: 44px;
  right: 0px;
  height: 30px;
  padding: 0;
  overflow: hidden;
  user-select: none;
}
</style>