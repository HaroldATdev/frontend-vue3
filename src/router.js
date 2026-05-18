import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Products from './views/Products.vue'
import ProductForm from './views/ProductForm.vue'
import Categories from './views/Categories.vue'
import StockMovements from './views/StockMovements.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: Login, meta: { public: true } },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/products', component: Products, meta: { requiresAuth: true } },
    { path: '/products/new', component: ProductForm, meta: { requiresAuth: true } },
    { path: '/products/:id/edit', component: ProductForm, meta: { requiresAuth: true } },
    { path: '/products/:id/stock', component: StockMovements, meta: { requiresAuth: true } },
    { path: '/categories', component: Categories, meta: { requiresAuth: true } },
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) return '/login'
  if (to.meta.public && token) return '/dashboard'
})

export default router

