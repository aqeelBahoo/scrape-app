import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import AdminSearch from '@/components/Admin/AdminSearch/AdminSearch'
import AdminSearchItemList from '@/components/Admin/AdminSearchItemList/adminSearchItemList'
import UserDashboard from '@/components/UserDashboard/userDashboard'
import Login from '@/components/Login'
import Register from '@/components/Register'
import AdminHistory from '@/components/Admin/AdminHistory/AdminHistory'
import users from '@/components/Admin/Users/Users'

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/admin/search',
      name: 'AdminSearch',
      component: AdminSearch,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    },
    {
      path: '/admin/search/items',
      name: 'AdminSearchItemList',
      component: AdminSearchItemList,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    },
    {
      path: '/dashboard',
      name: 'UserDashboard',
      component: UserDashboard,
      // TODO: Create user dashboard component where user can view all valid searches
      // component: ,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/admin/history',
      name: 'AdminHistory',
      component: AdminHistory,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: users,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.admin === true) {
          next()
        } else {
          next({ name: 'UserDashboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next({ name: 'AdminSearch' })
    }
  } else {
    next()
  }
})

export default router
