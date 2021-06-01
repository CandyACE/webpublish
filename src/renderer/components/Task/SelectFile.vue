<template>
  <el-upload
    class="upload-file"
    drag
    action="/"
    :limit="1"
    :multiple="false"
    :auto-upload="false"
    :show-file-list="false"
  ></el-upload>
</template>

<script>
export default {
  name: "ts-select-files",
};
</script>

<style lang="scss">
.upload-files {
  width: 100%;
  .el-upload,
  .el-upload-dragger {
    width: 100%;
  }
  .el-upload-dragger {
    border-radius: 4px;
    padding: 24px;
    height: auto;
  }
  .upload-inbox-icon {
    display: inline-block;
    margin-bottom: 12px;
  }
  .files-name {
    margin-top: 4px;
    font-size: $--font-size-small;
    color: $--color-text-secondary;
    line-height: 16px;
  }
}
.selective-files {
  .files-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .files-info {
    margin-bottom: 15px;
    font-size: 12px;
    line-height: 16px;
  }
  .files-actions {
    text-align: right;
    line-height: 16px;
    & > span {
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      height: 14px;
      padding: 1px;
    }
  }
}
.file-filters {
  button {
    font-size: 0;
  }
}
.files-list {
  border: 1px solid #ebeef5;
  border-bottom: none;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-bottom: 8px;
  .el-table th {
    padding: 2px 0;
  }
}
</style>