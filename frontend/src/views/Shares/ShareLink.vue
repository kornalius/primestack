<template>
  <q-page class="q-pa-sm" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useShare } from '@/features/Shares/store'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
  linkClicked: number
}>()

const share = useShare()

const router = useRouter()

onMounted(() => {
  share.setShareId(props.id)
  share.setLinkClicked(props.linkClicked)

  router.replace('/')
})
</script>
