import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { feathersClient as app } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'

export default defineStore('auth', () => {
  const states = ref({
    processing: false,
    authenticated: false,
    userId: undefined,
    userEmail: undefined,
  })

  const processing = computed(() => states.value.processing)
  const authenticated = computed(() => states.value.authenticated)
  const userId = computed(() => states.value.userId)
  const userEmail = computed(() => states.value.userEmail)

  const reAuthenticate = async (): Promise<void> => {
    try {
      states.value.processing = true
      const r = await app.reAuthenticate()
      states.value.userId = r.user._id
      states.value.userEmail = r.user.email
      states.value.authenticated = true
    } catch (e) {
      states.value.authenticated = false
      throw e
    } finally {
      states.value.processing = false
    }
  }

  const authenticate = async (strategy: string, args: AnyData): Promise<void> => {
    try {
      states.value.processing = true
      const r = await app.authenticate({
        strategy: 'local',
        ...args,
      })
      states.value.userId = r.user._id
      states.value.userEmail = r.user.email
      states.value.authenticated = true
    } catch (e) {
      states.value.authenticated = false
      throw e
    } finally {
      states.value.processing = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      states.value.processing = true
      await app.logout()
      states.value.authenticated = false
    } finally {
      states.value.processing = false
    }
  }

  return {
    states,
    processing,
    authenticated,
    userId,
    userEmail,
    reAuthenticate,
    authenticate,
    logout,
  }
})
