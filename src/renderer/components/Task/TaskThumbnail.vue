<template>
  <div class="ts-thumbnail" v-if="false">
    <img :src="url" />
  </div>
</template>

<script>
import api from "../../api";

export default {
  name: "ts-task-thumbnail",
  computed: {
    url() {
      if (!this.task) return "";
      return `http://localhost:${api.getPort()}/${this.task.id}/${
        this.task.thumbnail
      }`;
    },
  },
  props: {
    task: {
      type: Object,
      default: undefined,
    },
  },
};
</script>

<style lang="scss">
.ts-thumbnail {
  width: 256px;
  height: 256px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -25%) scale(1.5);
  opacity: 0.5;

  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-shadow: 0 0 26px 31px #fff inset;
  }
}
</style>