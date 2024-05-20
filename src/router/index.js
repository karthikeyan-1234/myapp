import Vue from 'vue'
import VueRouter from 'vue-router'
import Sales from '../views/Sales.vue'
import Reports from '../views/Reports.vue'
import MasterDetails from '../views/MasterDetails.vue'
import PurchaseScreen from '@/views/PurchaseScreen.vue'
import PurchaseReport from '@/views/reports/PurchaseReport.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/sales',
    name: 'sales',
    component: Sales
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/masterdetails',
    name: 'masterdetails',
    component: MasterDetails
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/PurchaseScreen',
    name: 'PurchaseScreen',
    component: PurchaseScreen
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/PurchaseReport',
    name: 'PurchaseReport',
    component: PurchaseReport
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
