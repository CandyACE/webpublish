<template>
  <div v-if="false"></div>
</template>

<script>
import { ADD_TASK_TYPE } from "../../../shared/constants";
export default {
  name: "ts-dragger",
  mounted() {
    this.preventDefault = (ev) => ev.preventDefault();
    let count = 0;
    this.onDragEnter = (ev) => {
      if (count === 0) {
        this.$store.dispatch("app/showAddTaskDialog", ADD_TASK_TYPE.DEFAULT);
      }
      count++;
    };

    this.onDragLeave = (ev) => {
      count--;
      if (count === 0) {
        this.$store.dispatch("app/hideAddTaskDialog");
      }
    };

    this.onDrop = (ev) => {
      count = 0;
      const fileList = [...ev.dataTransfer.files].map((item) => ({
        raw: item,
        name: item.name,
      }));
      if (!fileList.length) {
        this.$msg.error(this.$t("task.select-folder"));
      }
    };

    document.addEventListener("dragover", this.preventDefault);
    document.body.addEventListener("dragenter", this.onDragEnter);
    document.body.addEventListener("dragleave", this.onDragLeave);
    document.body.addEventListener("drop", this.onDrop);
  },
  destroyed() {
    document.addEventListener("dragover", this.preventDefault);
    document.body.addEventListener("dragenter", this.onDragEnter);
    document.body.addEventListener("dragleave", this.onDragLeave);
    document.body.addEventListener("drop", this.onDrop);
  },
};
</script>