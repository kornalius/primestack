<template>
  <q-card
    class="q-mx-sm"
    style="width: 30%;"
    :flat="!modelValue.bestValue"
    bordered
  >
    <div
      v-if="modelValue.bestValue"
      class="row justify-center items-center"
    >
      <div class="best-value col-auto q-pa-sm bg-orange-4 shadow-2">
        Best Value
      </div>
    </div>

    <div :class="`bg-${modelValue.color}`">
      <q-card-section class="q-pa-sm q-pt-lg">
        <div class="row justify-center items-center">
          <div class="col-auto">
            <span class="text-h4">{{ modelValue.name }}</span>
          </div>
        </div>

        <div class="row justify-center items-center">
          <div class="col-auto">
            <div class="bg-grey-6" style="width: 30px; height: 3px;" />
          </div>
        </div>

        <div class="row justify-center items-center q-mt-sm">
          <div class="col-auto text-center">
            <span>{{ modelValue.description }}</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="row justify-center items-center">
          <div class="col-auto">
            <span class="text-h2">${{ modelValue.price }}</span>
            <span class="text-grey-8">USD</span>
          </div>
        </div>

        <div class="row justify-center items-center">
          <div class="col-auto">
            <span class="text-grey-8">Per Month</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-btn
          class="full-width"
          label="Select Plan"
          color="green-6"
          no-caps
          unelevated
        />
      </q-card-section>
    </div>

    <q-card-section>
      <q-list>
        <q-item
          v-for="item in modelValue.items"
          :key="item"
          dense
        >
          <q-item-section avatar>
            <q-icon name="mdi-check-circle" color="green-4" size="xs" />
          </q-item-section>

          <q-item-section>
            <span>{{ item }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/plan'

type Plan = Static<typeof schema>

defineProps<{
  modelValue: Plan
}>()
</script>

<style scoped lang="sass">
.best-value
  position: absolute
</style>
