<template>
  <div class="title-bar">
    <ul class="window-menu">
      <li @click="handleOptions">
        <ts-icon
          name="menu-preference"
          width="12"
          height="12"
          v-show="!optionsVisible"
        />
        <ts-icon
          name="arrow-up"
          width="12"
          height="12"
          v-show="optionsVisible"
        />
      </li>
    </ul>
    <div class="title-bar-dragger">
      <div class="title-text">快速发布工具</div>
    </div>
    <ul class="window-actions">
      <li @click="handleMinimize">
        <ts-icon name="win-minimize" width="12" height="12" />
      </li>
      <!-- <li @click="handleMaximize">
        <ts-icon name="win-maximize" width="12" height="12" />
      </li> -->
      <li @click="handleClose" class="win-close-btn">
        <ts-icon name="win-close" width="12" height="12" />
      </li>
    </ul>
  </div>
</template>

<script>
import "@/components/Icons/win-minimize";
import "@/components/Icons/win-maximize";
import "@/components/Icons/win-close";
import "@/components/Icons/task-restart";
import "@/components/Icons/menu-preference";
import "@/components/Icons/arrow-up";

export default {
  name: "ts-title-bar",
  props: ["optionsVisible"],
  computed: {
    win: function () {
      return this.$electron.remote.getCurrentWindow();
    },
    isDevelop: function () {
      return process.env.NODE_ENV === "development";
    },
  },
  methods: {
    handleMinimize: function () {
      this.win.minimize();
    },
    handleMaximize: function () {
      if (this.win.isMaximized()) {
        this.win.unmaximize();
      } else {
        this.win.maximize();
      }
    },
    handleClose: function () {
      this.win.close();
    },
    handleOptions: function () {
      this.$parent.setOptionsVisible();
    },
  },
};
</script>

<style>
.title-text {
  font-size: 14px;
  font-family: "Segoe UI Regular";
  padding-top: 5px;
  padding-left: calc(50% - 20px);
  color: rgb(133, 132, 132);
}
.title-bar {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 27px;
  z-index: 5000;
}
.title-bar:hover .window-actions,
.title-bar:hover .window-menu {
  opacity: 1;
}
.title-bar .title-bar-dragger {
  flex: 1;
  user-select: none;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.title-bar .window-actions,
.title-bar .window-menu {
  opacity: 0.4;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 5100;
}
.title-bar .window-actions > li,
.title-bar .window-menu > li {
  display: inline-block;
  padding: 3px 10px;
  margin: 0;
  color: #1f1f1f;
  float: left;
  cursor: pointer;
}

.title-bar .window-actions > li:hover {
  background-color: #eee;
}

.title-bar .window-actions > li.win-close-btn:hover {
  color: #fff;
  background-color: #f56c6c;
}
.title-bar .window-menu > li:hover {
  background-color: #eee;
}
</style>
