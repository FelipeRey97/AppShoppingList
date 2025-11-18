import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/addList',
    name: 'AddList',
    component: () => import('../views/addList.vue')
  },
  {
    path: '/ListDetail',
    name: 'ListDetail',
    component: () => import('../views/ListDetail.vue')
  },
  {
    path: '/AddItem',
    name: 'AddItem',
    component: () => import('../views/AddItem.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
