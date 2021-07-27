<template>
  <el-row class="copyright">
    <el-col :span="6" class="copyright-left">
        <a target="_blank" href="https://tangweitian.cn" rel="noopener noreferrer">
        &copy;2021 Tangweitian
        </a>
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
}
</style>