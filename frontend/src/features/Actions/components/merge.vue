<template>
  <div>
    <div class="row full-height items-center">
      <div class="col-auto">
        <property-highlight
          :model-value="obj1"
          language="json"
        />
      </div>

      <div class="col-auto q-mx-md">
        <div>
          <q-icon name="mdi-arrow-left-right-bold" size="sm" />
        </div>
      </div>

      <div class="col-auto">
        <property-highlight
          :model-value="obj2"
          language="json"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import hljs from 'highlight.js'
import json from 'highlight.js/lib/languages/json'
// eslint-disable-next-line import/no-cycle
import { exprToString } from '@/features/Expression/composites'
import { AnyData } from '@/shared/interfaces/commons'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'

hljs.registerLanguage('json', json)

const props = defineProps<{
  modelValue: AnyData
}>()

const obj1 = computed(() => (
  JSON.stringify(
    exprToString(props.modelValue.object1) || {},
    undefined,
    2,
  )
))

const obj2 = computed(() => (
  JSON.stringify(
    exprToString(props.modelValue.object2) || {},
    undefined,
    2,
  )
))
</script>
