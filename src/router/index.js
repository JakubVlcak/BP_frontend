import { createWebHistory, createRouter } from 'vue-router'
import JS from '../views/JS.vue'
import LoginPageView from '@/views/LoginPageView.vue'
import RegisterPageView from '@/views/RegisterPageView.vue'
import DashboardView from '../views/DashboardView.vue'
import ActivityView from '@/views/ActivityView.vue'
import CalendarView from '@/views/CalendarView.vue'
const routes = [
  { path: '/', name: 'loginpage', component: LoginPageView },
  { path: '/loginpageview', name: 'LoginPageView', component: LoginPageView },
  { path: '/home', name: 'HOME', component: DashboardView },
  { path: '/JS', name: 'JS', component: JS },
  {
    path: '/registerpageview',
    name: 'registerpage',
    component: RegisterPageView,
  },
  {
    path: '/activity/:ActivityID', // Use :ActivityID instead of :id
    name: 'ActivityView',
    component: ActivityView,
    props: true, // Pass route params as props
  },
  {
    path: '/calendar', // Add the calendar route here
    name: 'calendar',
    component: CalendarView, // The component where your calendar will be
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
