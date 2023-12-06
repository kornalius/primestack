<template>
  <input-complete
    v-bind="$attrs"
    v-model="value"
    style="font-family: monospace; font-size: 12px;"
    :items="items"
  >
    <template #append>
      <q-btn
        icon="mdi-text-box-search"
        size="md"
        color="grey-7"
        dense
        flat
        round
      >
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card style="min-width: 500px;">
            <q-card-section>
              <div class="text-h6">
                {{ $t('filterUI.title') }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div
                v-for="f in filterForm._fields"
                :key="f._id"
                class="row items-center"
              >
                <div class="col-4 q-mr-xs">
                  <q-select
                    v-if="optionsFor((f as any).field).length > 0"
                    v-model="filterConds[(f as any).field]"
                    class="q-mb-sm"
                    :options="optionsFor((f as any).field)"
                    tabindex="-1"
                    dense
                    borderless
                    options-dense
                    emit-value
                    map-options
                  />
                </div>

                <div class="col">
                  <form-display
                    v-model="filterValues"
                    :fields="[f]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-btn>
    </template>
  </input-complete>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useFilter } from '@/features/Filter/composites'
import { tableFieldSchema } from '@/shared/schemas/table'
import InputComplete from '@/features/Fields/components/InputComplete.vue'
import FormDisplay from '@/features/Forms/components/FormDisplay.vue'

type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: string | undefined
  fields?: TableField[]
  caretHeight?: number
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void,
}>()

const value = useModelValue(props, emit)

const { t } = useI18n()

const filterValues = ref({})

const filterConds = ref({})

const { generateFiltersForm } = useFilter()

const queryableFields = computed(() => (
  (props.fields || [])
    .filter((f) => f.queryable)
))

const filterForm = computed(() => (
  generateFiltersForm(undefined, queryableFields.value)
))

const items = computed(() => (
  queryableFields.value
    .map((f) => ({
      label: f.name,
      value: f.name,
      icon: 'mdi-key',
      color: 'orange-4',
    }))
))

watch(queryableFields, () => {
  filterConds.value = queryableFields.value.reduce((acc, f) => ({
    ...acc,
    [f.name]: filterConds.value[f.name] || ':',
  }), {})
}, { immediate: true })

const filterOptions = computed(() => ({
  string: [
    { label: t('filterUI.contains'), value: ':' },
    { label: t('filterUI.notContain'), value: ':-' },
  ],
  number: [
    { label: t('filterUI.isEqual'), value: ':' },
    { label: t('filterUI.isNotEqual'), value: ':-' },
    { label: t('filterUI.isLess'), value: '<' },
    { label: t('filterUI.isLessOrEqual'), value: '<=' },
    { label: t('filterUI.isGreater'), value: '>' },
    { label: t('filterUI.isGreaterOrEqual'), value: '>=' },
  ],
  // boolean: [
  //   { label: t('filterUI.isEqual'), value: ':' },
  //   { label: t('filterUI.isNotEqual'), value: ':-' },
  // ],
}))

const optionsFor = (name: string): { label: string, value: string }[] => {
  const f = queryableFields.value.find((ff) => ff.name === name)
  return (filterOptions.value?.[f?.type] || []) as { label: string, value: string }[]
}

watch([filterValues, filterConds], () => {
  const s = Object.keys(filterValues.value)
    .filter((k) => filterValues.value[k] !== undefined
      && filterValues.value[k] !== null
      && filterValues.value[k] !== '')
    .map((k) => {
      let v = filterValues.value[k]
      if (Number.isNaN(Number(v))) {
        v = `'${v}'`
      }
      return `${k}${filterConds.value[k]}${v}`
    })
  value.value = s.join(' ')
}, { deep: true })
</script>
