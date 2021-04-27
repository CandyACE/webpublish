<template>
  <el-container id="container">
    <ts-aside></ts-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
import AsideVue from "./Aside/Aside.vue";
export default {
  name: "ts-main",
  components: {
    [AsideVue.name]: AsideVue,
  },
};
</script>