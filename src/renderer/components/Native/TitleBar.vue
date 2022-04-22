<template>
  <div class="title-bar">
    <div class="title-bar-dragger"></div>
    <ul class="window-actions">
      <li @click="handleMinimize">
        <ts-icon name="win-minimize" width="12" height="12" />
      </li>
      <li @click="handleMaximize">
        <ts-icon name="win-maximize" width="12" height="12" />
      </li>
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

const remote = require("@electron/remote");

export default {
  name: "ts-title-bar",
  computed: {
    win: function () {
      return remote.getCurrentWindow();
      // return this.$electron.remote.getCurrentWindow()
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
  },
};
</script>

<style>
.title-bar {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 36px;
  z-index: 5000;
}
.title-bar:hover .window-actions {
  opacity: 1;
}
.title-bar .title-bar-dragger {
  flex: 1;
  user-select: none;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.title-bar .window-actions {
  opacity: 0.4;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 5100;
}
.title-bar .window-actions > li {
  display: inline-block;
  padding: 5px 15px;
  margin: 0;
  color: #1f1f1f;
}

.title-bar .window-actions > li:hover {
  background-color: #eee;
}

.title-bar .window-actions > li.win-close-btn:hover {
  color: #fff;
  background-color: #fd0007;
}
</style>
