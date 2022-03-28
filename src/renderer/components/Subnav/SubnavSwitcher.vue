<template>
  <el-dropdown @command="handleRoute" class="subnav-switch" size="medium">
    <h4 class="subnav-title">
      {{ title }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </h4>
    <el-dropdown-menu slot="dropdown" class="subnav-switch-dropdown">
      <el-dropdown-item
        :command="sn.route"
        v-for="sn in subnavs"
        :key="sn.key"
      >
        {{ sn.title }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "ts-subnav-switcher",
  props: {
    title: {
      type: String,
    },
    subnavs: {
      type: Array,
    },
  },
  methods: {
    handleRoute(route) {
      this.$router
        .push({
          path: route,
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.subnav-switch-dropdown {
  background: #fff !important;
  & .el-dropdown-menu__item {
    font-size: 16px;
    color: #606266 !important;
  }
}
.subnav-switch {
  & .subnav-title {
    color: #4D515A !important;
    font-size: 16px;
  }
}
</style>