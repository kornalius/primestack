import { createRouter, createWebHistory } from 'vue-router'
import { getEnv } from '@/utils/variables'
import routes from '@/routes'

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(getEnv(import.meta.env.VITE_BASE_URL) as string),
  routes,
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router
