<template>
  <div class="app-info">
    <div class="app-version">
      <span>{{ appName }}</span>
      <span>Version {{ version }}</span>
    </div>
    <ts-logo-mini :width="128" :height="128" class="app-icon"></ts-logo-mini>
    <div class="thank-info">
      <h4>鸣谢（排名不分先后）</h4>
      <ul>
        <li>感谢 panweichen</li>
        <li>感谢 iKangxu</li>
        <li>感谢开源的 Motrix 提供参考</li>
      </ul>
    </div>
  </div>
</template>

<script>
import LogoMiniVue from "../Logo/LogoMini.vue";
export default {
  name: "ts-app-info",
  data() {
    return {
      version: __VERSION__,
      appName: "快速发布工具",
    };
  },
  components: {
    [LogoMiniVue.name]: LogoMiniVue,
  },
};
</script>

<style lang="scss">
.app-info {
  position: relative;
  margin: 8px 0;
  .app-version {
    span:nth-child(1) {
      display: inline-block;
      vertical-align: bottom;
      font-size: 24px;
      margin-left: 20px;
      color: black;
      line-height: 28px;
    }
    span:nth-child(2) {
      display: inline-block;
      vertical-align: bottom;
      font-size: 18px;
      margin-left: 20px;
      color: black;
      line-height: 18px;
    }
  }

  .app-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 128px;
    height: 128px;
  }

  .thank-info {
    margin: 50px 35% 0 8px;
    h4 {
      font-size: 14px;
      font-weight: normal;
      color: #606266;
    }
    ul {
      font-size: 12px;
      color: #909399;
      list-style: none;
      padding: 0;
      line-height: 20px;
      &:after {
        content: "";
        display: table;
        clear: both;
      }
      li {
        float: left;
        width: 50%;
      }
    }
  }
}
</style>