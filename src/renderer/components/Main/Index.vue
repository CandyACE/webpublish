<template>
  <el-container class="content panel" direction="horizontal">
    <el-aside width="200px" class="subnav hidden-xs-only">
      <ts-task-subnav :current="status" v-on:changeMenu="onStatusChange" />
      <div class="menu-about">
        <ts-icon name="menu-about" width="20" height="20" />
      </div>
    </el-aside>
    <el-container class="content panel" direction="vertical">
      <el-header class="panel-header" height="84">
        <h4 class="task-title hidden-xs-only">{{ title }}</h4>
      </el-header>
      <el-main class="panel-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TaskSubnav from "@/components/Subnav/Index"
import "@/components/Icons/menu-about"

export default {
  name: "ts-content-task",
  components: {
    [TaskSubnav.name]: TaskSubnav
  },
  props: {},
  data() {
    return {
      // _status: "home"
      _status: window.config.Menu[0]
    }
  },
  computed: {
    title: function() {
      const subnav = window.config.Menu.find(
        item => item.key === this.status.key
      )
      return subnav.title
    },
    status: {
      get() {
        return this.$data._status
      },
      set(value) {
        this.$data._status = value
      }
    }
  },
  methods: {
    onStatusChange(value) {
      this.status = value
      this.changeTools()
    },
    changeTools() {
      this.$router.push({
        path: `${this.status.path}`
      })
    }
  },
  created: function() {
    this.changeTools()
  }
}
</script>

<style lang="scss">
.menu-about {
  width: 32px;
  height: 32px;
  margin-top: 24px;
  cursor: pointer;
  border-radius: 16px;
  transition: background-color 0.25s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }

  svg{
    padding: 6px;
    color: #000;
  }
}
</style>
