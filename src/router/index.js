import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Purchases.vue'
import Purchases from '../views/Purchases.vue'
import Sales from '../views/Sales.vue'
import Reports from '../views/Reports.vue'
import PurchaseDetails from '../views/PurchaseDetails.vue'
import MasterDetails from '../views/MasterDetails.vue'
import PurchaseScreen from '@/views/PurchaseScreen.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'purchases',
    component: Purchases
  },
  {
    path: '/purchasedetails',
    name: 'purchasedetails',
    component: PurchaseDetails
  },
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
