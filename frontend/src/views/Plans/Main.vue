<template>
  <div class="q-pa-md flex flex-center">
    <plan
      v-for="plan in plans"
      :key="plan._id"
      :model-value="plan"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFeathersService } from '@/composites/feathers'
import Plan from '@/features/Plans/components/Plan.vue'

const { data: plans, find } = useFeathersService('plans')
  .useFind(computed(() => ({ query: {} })))
find()
</script>
