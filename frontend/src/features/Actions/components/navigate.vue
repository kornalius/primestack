<template>
  <div class="row items-center">
    <div class="col-auto text-italic">
      to
    </div>

    <div class="col-auto q-ml-xs text-bold">
      {{ url }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUrl } from '@/composites/url'

const props = defineProps<{
  modelValue: unknown
}>()

const { menuUrl } = useUrl()

const url = computed(() => (
  props.modelValue.menuId
    ? menuUrl(props.modelValue.menuId as string, props.modelValue.tabId as string)
    : props.modelValue.href
))
</script>
