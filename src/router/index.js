import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SearchView from '../views/SearchView.vue'
import ListView from '../views/ListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: 'About',
    }
  },
  {
    path: '/search/:query',
    name: 'search',
    component: SearchView,
    meta: {
      title: 'Search',
    }
  },
  {
    path: '/list/:category',
    name: 'list',
    component: ListView,
    meta: {
      title: 'List',
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Set the title of the page
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + " - Upsilon Workshop"
  } else {
    document.title = 'Upsilon Workshop'
  }
  next()
})

export default router
