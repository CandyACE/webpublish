import Vue from 'vue'
import Router from 'vue-router'

const orginalPush = Router.prototype.push;
Router.prototype.push = function (location) {
  return orginalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/Main').default,
      children: [
        {
          path: '/task',
          alias: '/',
          component: require('@/components/Task/Index').default,
          props: {
            status: 'all'
          }
        },
        {
          path: '/task/:status',
          alias: 'task',
          component: require('@/components/Task/Index').default,
          props: true
        },
        {
          path: "/options",
          name: "options",
          component: require('@/components/Options/Index').default,
          props: true,
          children: [
            {
              path: 'basic',
              alias: '',
              components: {
                subnav: require('@/components/Options/OptionsSubnav').default,
                form: require('@/components/Options/Basic').default
              },
              props: {
                subnav: { current: 'basic' }
              }
            }
          ]
        }
      ]
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})
