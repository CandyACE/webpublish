<template>
  <el-aside
    width="78px"
    :class="['aside', 'hidden-sm-and-down', { draggable: asideDraggable }]"
  >
    <div class="aside-inner">
      <ts-logo-mini class="logo-mini" />
      <ul class="menu top-menu">
        <li @click="nav('/taskList')" class="non-draggable">
          <ts-icon name="menu-task" width="20" height="20" />
        </li>
        <li class="non-draggable">
          <ts-icon name="menu-add" width="20" height="20"></ts-icon>
        </li>
      </ul>
      <ul class="menu bottom-menu">
        <li @click="nav('/optionsPage')" class="non-draggable">
          <ts-icon name="menu-preference" width="20" height="20" />
        </li>
        <li @click="showAboutPanel" class="non-draggable">
          <ts-icon name="menu-about" width="20" height="20" />
        </li>
      </ul>
    </div>
  </el-aside>
</template>

<script>
// import is from 'electron-is'
import { mapState } from "vuex";
import LogoMini from "@/components/Logo/LogoMini";
import "@/components/Icons/menu-task";
import "@/components/Icons/menu-add";
import "@/components/Icons/menu-preference";
import "@/components/Icons/menu-about";

export default {
  name: "ts-aside",
  components: {
    [LogoMini.name]: LogoMini,
  },
  computed: {
    asideDraggable: function () {
      return false;
    },
  },
  methods: {
    showAboutPanel() {
      this.$store.dispatch("app/showAboutPanel");
    },
    nav(page) {
      this.$router
        .push({
          path: page,
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.aside {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
}

.aside-inner {
  display: flex;
  height: 100%;
  flex-flow: column;
}

.logo-mini {
  margin-top: 40px !important;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  user-select: none;
  cursor: default;

  > li {
    width: 32px;
    height: 32px;
    margin-top: 24px;
    cursor: pointer;
    border-radius: 16px;
    transition: background-color 0.25s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  svg {
    padding: 6px;
    color: #fff;
  }
}

.top-menu {
  flex: 1;
}

.bottom-menu {
  margin-bottom: 24px;
}
</style>
