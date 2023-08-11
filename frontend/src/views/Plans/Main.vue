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
import { useFeathers } from '@/composites/feathers'
import Plan from '@/features/Plans/components/Plan.vue'

const { api } = useFeathers()

const { data: plans, find } = api.service('plans').useFind({ query: {} })
find()
</script>
