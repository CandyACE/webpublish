<template>
  <el-container class="content panel" direction="horizontal">
    <el-aside width="200px" class="subnav hidden-xs-only">
      <router-view name="subnav"></router-view>
    </el-aside>
    <router-view name="form"></router-view>
  </el-container>
</template>

<script>
export default {
  name: "ts-content-options",
  computed: {},
  components: {},
  methods: {},
};
</script>

<style lang="scss">
.form-options {
  padding: 16px 7% 64px 0;
  .el-switch__label {
    font-weight: normal;
    color: #606266;
    &.is-active {
      color: #606266;
    }
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
  .el-form-item {
    a {
      color: #606266;
      text-decoration: none;
      &:hover {
        color: #303133;
        text-decoration: underline;
      }
      &:active {
        color: #303133;
      }
    }
  }
  .el-form-item.el-form-item--mini {
    margin-bottom: 32px;
  }
  .el-form-item__content {
    color: #606266;
  }
  .form-item-sub {
    margin-bottom: 8px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
.form-actions {
  position: fixed;
  bottom: 0;
  left: auto;
  z-index: 10;
  width: -webkit-fill-available;
  box-sizing: border-box;
  padding: 24px 36px;
  margin-left: -36px;
  // aside.width + subnav.width + padding-left + scrollbar.width
  margin-right: 322px;
}
.action-link {
  cursor: pointer;
  color: rgb(230, 154, 79);
  &:hover {
    color: rgb(230, 154, 79);
    text-decoration: underline;
  }
}
</style>