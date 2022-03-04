<template>
  <div>
    <el-aside
      width="78px"
      :class="['aside', 'hidden-sm-and-close', { draggable: asideDraggable }]"
    >
      <div class="aside-inner">
        <ts-logo-mini class="logo-mini" />
        <ul class="menu top-menu">
          <li @click="nav('/task')" class="non-draggable">
            <ts-icon name="menu-task" width="20" height="20" />
          </li>
          <li @click="showAddTask()" class="non-draggable">
            <ts-icon name="menu-add" width="20" height="20"></ts-icon>
          </li>
        </ul>
        <ul class="menu bottom-menu">
          <li @click="nav('/options')" class="non-draggable">
            <ts-icon name="menu-preference" width="20" height="20" />
          </li>
          <li @click="showAboutPanel" class="non-draggable">
            <ts-icon name="menu-about" width="20" height="20" />
          </li>
        </ul>
      </div>
    </el-aside>
    <el-dropdown
      :class="['show-sm-and-down', 'small-nav']"
      style="display: none"
      @command="dropDownCommand"
    >
      <el-button size="small" icon="el-icon-menu" circle></el-button>
      <el-dropdown-menu slot="dropdown">
        <template v-for="group in menus">
          <template v-for="(item, index) in group.items">
            <el-dropdown-item
              :key="item.name"
              :divided="index == 0"
              :command="item"
              >{{ $t(item.name) }}</el-dropdown-item
            >
          </template>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
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
  data() {
    return {
      menus: [
        {
          type: "top-menu",
          items: [
            {
              name: "app.task-list",
              icon: "menu-task",
              click: () => this.nav("/task"),
            },
            {
              name: "task.new-folder-task",
              icon: "menu-add",
              click: () => this.showAddTask(),
            },
          ],
        },
        {
          type: "bottom-menu",
          items: [
            {
              name: "subnav.options",
              icon: "menu-preference",
              click: () => this.nav("/options"),
            },
            {
              name: "app.about",
              icon: "menu-about",
              click: () => this.showAboutPanel(),
            },
          ],
        },
      ],
    };
  },
  components: {
    [LogoMini.name]: LogoMini,
  },
  computed: {
    asideDraggable: function () {
      return false;
    },
  },
  methods: {
    dropDownCommand(item) {
      item.click();
    },
    showAddTask() {
      this.$store.dispatch("app/showAddTaskDialog");
    },
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
  height: 100%;
  transition: all 0.5s;
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

@media only screen and (max-width: 791px) {
  .show-sm-and-down {
    display: block !important;
  }

  .hidden-sm-and-close {
    width: 0px !important;
  }
}

.small-nav {
  position: absolute !important;
  bottom: 5px;
  left: 5px;
  z-index: 1;
}
</style>
