<template>
  <q-page class="bg-blue window-height window-width row justify-center items-center">
    <span class="text-h1 text-white">
      Logging you out...
    </span>
  </q-page>
</template>

<script setup lang="ts">
import useAuth from '@/features/Auth/store'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const auth = useAuth()
const router = useRouter()

onMounted(() => {
  setTimeout(async () => {
    await auth.logout()
    await router.replace('/')
  }, 2000)
})
</script>
