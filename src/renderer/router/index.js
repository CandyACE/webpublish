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
          component: require('@/components/Task/Index').default
        },
        {
          path: '/optionsPage',
          component: require('@/components/options/Index').default
        }
      ]
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})
