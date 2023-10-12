<template>
  <div>
    <div class="row">
      <div class="col">
        <property-highlight
          :model-value="value"
          language="json"
        />
      </div>

      <div class="col">
        <div
          v-for="k in modelValue.fields"
          :key="k"
          class="row"
        >
          <div class="col-auto">
            <q-icon name="mdi-key" size="xs" color="green-4" />
          </div>

          <div class="col q-ml-sm">
            {{ exprToString(k) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import hljs from 'highlight.js'
import json from 'highlight.js/lib/languages/json'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exprToString } from '@/features/Expression/composites'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'

hljs.registerLanguage('json', json)

const props = defineProps<{
  modelValue: AnyData
}>()

const value = computed(() => (
  JSON.stringify(
    props.modelValue.value || {},
    undefined,
    2,
  )
))
</script>
