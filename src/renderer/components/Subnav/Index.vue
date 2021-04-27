<template>
  <nav class="subnav-inner">
    <h3>{{title}}</h3>
    <ul>
      <!-- <li @click="() => nav('home')" :class="[ current === 'home' ? 'active' : '' ]">
        <i class="subnav-icon">
          <ts-icon name="task-start" width="20" height="20" />
        </i>
        <span>{{ "主页" }}</span>
      </li>
      <li @click="() => nav('example')" :class="[ current === 'example' ? 'active' : '' ]">
        <i class="subnav-icon">
          <ts-icon name="task-pause" width="20" height="20" />
        </i>
        <span>{{ "测试" }}</span>
      </li>-->
      <li
        v-for="(menu,index) in menus"
        v-bind:key="index"
        @click="()=>nav(menu)"
        :class="[current.key === menu.key ?'active':'']"
      >
        <i class="subnav-icon">
          <ts-icon name="menu-task" width="20" height="20" />
        </i>
        <span>{{ menu.title }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
import "@/components/Icons/menu-task"

export default {
  name: "ts-task-subnav",
  data() {
    return {
      menus: window.config.Menu
    }
  },
  props: {
    current: {
      type: Object
    }
  },
  computed: {
    title: function() {
      return "中科图新"
    }
  },
  methods: {
    nav: function(status) {
      // this.$router
      //   .push({
      //     path: `/txMenu/${status}`
      //   })
      // .catch(err => {
      //   console.log(err)
      // })
      this.$emit("changeMenu", status)
    }
  }
}
</script>

<style lang="scss">
.subnav-inner {
  margin-top: 44px;
  padding: 0 16px;
  user-select: none;

  h3 {
    font-size: 16px;
    color: #303133;
    font-weight: normal;
    line-height: 24px;
    margin: 0 0 28px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    cursor: default;

    li {
      margin-bottom: 8px;
      padding: 8px 10px;
      font-size: 0;
      line-height: 20px;
      border-radius: 3px;
      cursor: pointer;

      i,
      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }

      &:hover,
      &.active {
        background-color: #eaecf0;

        i,
        span,
        svg {
          color: #5b5bfa;
        }
      }
    }
  }
}

</style>