import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/routes'

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router
