<template>
  <q-page class="bg-blue window-height window-width row justify-center items-center">
    <span class="text-h1 text-white">
      {{ $t('logout.message') }}
    </span>
  </q-page>
</template>

<script setup lang="ts">
import { useAuth } from '@/features/Auth/store'
import { onMounted } from 'vue'

const auth = useAuth()

onMounted(() => {
  setTimeout(async () => {
    await auth.logout()
    document.location.replace('/login')
  }, 2000)
})
</script>
