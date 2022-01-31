<template>
  <el-row class="copyright">
    <el-col :span="6" class="copyright-left">
      <a
        target="_blank"
        href="https://tangweitian.cn"
        rel="noopener noreferrer"
      >
        &copy;2022 Tangweitian
      </a>
    </el-col>
    <el-col :span="18" class="copyright-right">
      <a
        href="https://gitee.com/tstwt/webpublish"
        target="_blank"
        rel="noopener noreferrer"
        >{{ $t("about.open-source") }}</a
      >
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "ts-copyright",
};
</script>

<style lang="scss">
.copyright {
  width: 100%;
  font-size: 13px;
  a {
    color: #606266;
    text-decoration: none;
  }

  .copyright-left {
    text-align: left;
  }

  .copyright-right {
    text-align: right;

    a {
      margin-left: 30px;
    }
  }
}
</style>