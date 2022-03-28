<template>
  <nav class="subnav-inner">
    <h3>{{ title }}</h3>
    <ul>
      <li
        v-for="type in subnavs"
        :key="type.key"
        @click="() => nav(type.key)"
        :class="[current === type.key ? 'active' : '']"
      >
        <span>{{ $t("subnav.task-type-" + type.key) }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "ts-task-subnav",
  props: {
    current: {
      type: String,
      default: "all",
    },
    subnavs: {
      type: Array,
    },
  },
  computed: {
    title() {
      return this.$t("subnav.task-type");
    },
  },
  methods: {
    nav(status = "all") {
      this.$router
        .push({
          path: `/task/${status}`,
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>