import { Ref, computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { feathersClient as app } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import { Static } from '@feathersjs/typebox'
import { schema as userSchema } from '@/shared/schemas/user'

type User = Static<typeof userSchema>

export const useAuth = defineStore('auth', () => {
  const processing = ref(false)

  const authenticated = ref(false)

  const user = ref() as Ref<User>

  const userId = computed(() => user.value?._id)

  const reAuthenticate = async (): Promise<void> => {
    try {
      processing.value = true
      const r = await app.reAuthenticate()
      user.value = r.user
      authenticated.value = true
    } catch (e) {
      authenticated.value = false
      throw e
    } finally {
      processing.value = false
    }
  }

  const authenticate = async (strategy: string, args: AnyData): Promise<void> => {
    try {
      processing.value = true
      const r = await app.authenticate({
        strategy: 'local',
        ...args,
      })
      user.value = r.user
      authenticated.value = true
    } catch (e) {
      authenticated.value = false
      throw e
    } finally {
      processing.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      processing.value = true
      await app.logout()
      authenticated.value = false
    } finally {
      processing.value = false
    }
  }

  return {
    processing,
    authenticated,
    user,
    userId,
    reAuthenticate,
    authenticate,
    logout,
  }
})
