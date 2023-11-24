import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { feathersClient as app } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import { Static } from '@feathersjs/typebox'
import { schema as userSchema } from '@/shared/schemas/user'

type User = Static<typeof userSchema>

export const useAuth = defineStore('auth', () => {
  const states = ref({
    processing: false,
    authenticated: false,
    user: undefined as User,
  })

  const processing = computed(() => states.value.processing)
  const authenticated = computed(() => states.value.authenticated)
  const user = computed(() => states.value.user)
  const userId = computed(() => states.value.user?._id)

  const reAuthenticate = async (): Promise<void> => {
    try {
      states.value.processing = true
      const r = await app.reAuthenticate()
      states.value.user = r.user
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
      states.value.user = r.user
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
    user,
    userId,
    reAuthenticate,
    authenticate,
    logout,
  }
})
