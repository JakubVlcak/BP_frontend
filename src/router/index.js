import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JS from '../views/JS.vue'
import LoginPageView from '@/views/LoginPageView.vue'
import RegisterPageView from '@/views/RegisterPageView.vue'
const routes = [
  { path: '/', name: 'loginpage', component: LoginPageView },
  { path: '/home', name: 'HOME', component: HomeView },
  { path: '/JS', name: 'JS', component: JS },
  {
    path: '/registerpageview',
    name: 'registerpage',
    component: RegisterPageView,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
