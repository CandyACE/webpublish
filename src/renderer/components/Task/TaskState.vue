<template>
  <div class="task-states">
    <div
      class="task-state"
      @click="changeServerState"
      :class="{ stop: isRunning }"
    ></div>
  </div>
</template>

<script>
import { remote } from "electron";
export default {
  name: "ts-task-state",
  data() {
    var application = remote.getGlobal("application");
    return {
      isRunning: application.serverManager.isRunning,
    };
  },
  methods: {
    changeServerState() {
      var application = remote.getGlobal("application");
      if (this.isRunning) {
        application.serverManager.stop();
        this.isRunning = false;
      } else {
        application.serverManager.start();
        this.isRunning = true;
      }
    },
  },
};
</script>

<style lang="scss">
.task-states {
  position: absolute;
  top: 44px;
  right: 0;
  height: 24px;
  padding: 0;
  overflow: hidden;
  user-select: none;
  cursor: default;
  text-align: right;
  color: #4d515a;
  transition: all 0.25s;

  .task-state {
    // display: inline-block;
    // margin: 0 4px;
    // font-size: 0;
    // outline: none;
    // &:hover {
    //   color: #5b5bfa;
    // }
    // &.disabled {
    //   color: rgba(77, 81, 90, 0.5);
    // }
    padding: 6px;
    cursor: pointer;

    &::after {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: absolute;
      left: 0px;
      background-color: rgb(13, 187, 13);
    }

    &.stop::after {
      background-color: red;
    }
  }
}
</style>