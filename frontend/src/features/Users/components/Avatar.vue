<template>
  <img
    v-if="imageSrc"
    :style="`width: ${avatarSize}px; height: ${avatarSize}px;`"
    :src="imageSrc"
    :alt="imageSrc"
  >

  <img
    v-else-if="avatarUrl && !forceUsername"
    class="avatar"
    :src="avatarUrl"
    :alt="email"
  >

  <vue-avatar
    v-else-if="username"
    :username="username"
    :size="avatarSize"
  />

  <q-skeleton
    v-else
    type="QAvatar"
    :size="`${avatarSize}px`"
    animation="none"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import '@webzlodimir/vue-avatar/dist/style.css'
import gravatarUrl from 'gravatar-url'
import { useProp } from '@/composites/prop'
import VueAvatar from '@webzlodimir/vue-avatar'

const props = defineProps<{
  email?: string
  name?: string
  username?: string
  size?: number
  forceUsername?: boolean
  imageSrc?: string
}>()

const avatarUrl = ref()

const avatarSize = useProp(props, 'size', 48)

const shouldLoadAvatar = computed(() => (
  props.email && !props.imageSrc && !props.forceUsername
))

watch([() => props.email, avatarSize], () => {
  if (shouldLoadAvatar.value) {
    avatarUrl.value = gravatarUrl(props.email, { size: avatarSize.value })
  }
}, { immediate: true })
</script>

<style scoped lang="sass">
.avatar
  border-radius: 50%
</style>
