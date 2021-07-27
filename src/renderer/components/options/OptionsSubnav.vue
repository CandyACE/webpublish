<template>
  <nav class="subnav-inner">
    <h3>{{ title }}</h3>
    <ul>
      <li
        @click="() => nav('basic')"
        :class="[current === 'basic' ? 'active' : '']"
      >
        <i class="subnav-icon">
          <ts-icon name="preference-basic" width="20" height="20"></ts-icon
        ></i>
        <span>通用</span>
      </li>
    </ul>
  </nav>
</template>

<script>
import "@/components/Icons/preference-basic";

export default {
  name: "ts-options-subnav",
  props: {
    current: {
      type: String,
      default: "basic",
    },
  },
  computed: {
    title: function () {
      return "设置";
    },
  },
  methods: {
    nav: function (category = "basic") {
      this.$router
        .push({
          path: `/options/${category}`,
        })
        .catch((err) => {
          console.log(erro);
        });
    },
  },
};
</script>