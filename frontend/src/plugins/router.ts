import { createRouter, createWebHistory } from 'vue-router'
import { getEnv } from '@/utils/variables'
import routes from '@/routes'
import { useAuth } from '@/features/Auth/store'
import { useAppEditor } from '@/features/App/editor-store'

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(getEnv(import.meta.env.VITE_BASE_URL) as string),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuth()

  const isAuthRequired = to?.matched.some((r) => r.meta.requiresAuth)

  if (isAuthRequired) {
    try {
      await auth.reAuthenticate()
    } catch (e) {
      await auth.logout()
      const p = Object.keys(to.query)
        .map((k) => `${k}=${to.query[k]}`)
        .join('&')
      next(`/login/?redirect=${to.path}&${p}`)
      return
    }
  }

  const editor = useAppEditor()

  const isEditorRequired = to?.matched.some((r) => r.meta.editor)

  if (isEditorRequired) {
    if (!editor.active) {
      next('/')
      return
    }
  }

  next()
})

export default router
