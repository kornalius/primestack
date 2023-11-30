<template>
  <q-page class="q-pa-sm" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useShareStore } from '@/features/Shares/store'

const props = defineProps<{
  id: string
}>()

const share = useShareStore()

onMounted(() => {
  share.setShareId(props.id)
  share.setLinkClicked(Date.now())

  document.location.replace('/login')
})
</script>
