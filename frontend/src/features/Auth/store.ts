import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { feathersClient as app } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'

export default defineStore('auth', () => {
  const states = ref({
    processing: false,
    authenticated: false,
  })

  const processing = computed(() => states.value.processing)
  const authenticated = computed(() => states.value.authenticated)

  const reAuthenticate = async (): Promise<void> => {
    try {
      states.value.processing = true
      await app.reAuthenticate()
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
      console.log('Authenticated!', r)
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
      const r = await app.logout()
      console.log('Logged out!', r)
      states.value.authenticated = false
    } finally {
      states.value.processing = false
    }
  }

  return {
    states,
    processing,
    authenticated,
    reAuthenticate,
    authenticate,
    logout,
  }
})
