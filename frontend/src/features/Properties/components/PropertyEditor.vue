<template>
  <div
    v-if="horizontal && label && !embedLabel"
    class="col-auto q-mr-md"
    :class="{ 'q-mt-sm': type === 'array' }"
    style="width: 125px;"
  >
    <property-label
      :multiple-types="multipleTypes"
      :label="label"
      @change-type="changeType"
    />
  </div>

  <div
    v-if="horizontal"
    class="col"
  >
    <schema-field
      v-model="value"
      v-model:forced-types="currentForcedTypes"
      :schema="schema"
      :key-name="propName"
      :label="label"
      :embed-label="embedLabel"
      property
    />
  </div>

  <q-item
    v-else-if="nonExpandable"
    style="padding: 2px 0 !important;"
    dense
  >
    <q-item-section>
      <div
        :class="{
          label: true,
          row: true,
          'q-pr-sm': true,
          'items-center': true,
        }"
      >
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          style="width: 125px;"
        >
          <property-label
            :multiple-types="multipleTypes"
            :label="label"
            @change-type="changeType"
          />
        </div>

        <div class="col">
          <schema-field
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :schema="schema"
            :key-name="propName"
            :label="label"
            :embed-label="embedLabel"
            property
          />
        </div>
      </div>
    </q-item-section>
  </q-item>

  <q-expansion-item
    v-else
    header-class="q-pa-none"
    expand-separator
  >
    <template #header>
      <div class="label row q-pr-sm full-width items-center">
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          style="width: 125px;"
        >
          <q-btn
            v-if="type === 'array' && Array.isArray(value)"
            style="position: absolute; left: 8px; top: 14px;"
            size="sm"
            color="grey-7"
            dense
            flat
            @click.stop=""
          >
            <q-icon name="mdi-pencil" />

            <q-popup-edit
              v-model="value"
              :title="label"
              auto-save
              v-slot="scope"
            >
              <array-editor
                v-model="scope.value"
                style="min-width: 600px; min-height: 400px;"
                add-button="end"
                add-label="Click here to add a new item"
                :add-function="() => addItem(scope.value)"
                :remove-function="(v: unknown, idx: number) => removeItem(scope.value, idx)"
                :no-separator="!arraySchemaIsObject"
                reorderable
              >
                <template #default="{ index }">
                  <properties-editor
                    v-if="arraySchemaIsObject"
                    v-model="scope.value[index]"
                    v-model:forced-types="currentForcedTypes"
                    :prop-name="subPropName(index)"
                    :schema="arraySchema"
                    :horizontal="arrayIsHorizontalPopup"
                    embed-label
                    flat
                  />

                  <property-editor
                    v-else
                    v-model="scope.value[index]"
                    v-model:forced-types="currentForcedTypes"
                    :prop-name="subPropName(index)"
                    :schema="arraySchema"
                    :required="arraySchema.required"
                    embed-label
                  />
                </template>
              </array-editor>
            </q-popup-edit>
          </q-btn>

          <property-label
            :multiple-types="multipleTypes"
            :label="label"
            :embed-label="embedLabel"
            @change-type="changeType"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div
        :class="{
          label: true,
          row: true,
          'items-center': type !== 'array',
        }"
      >
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          style="width: 125px;"
        />

        <div class="col">
          <schema-field
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :schema="schema"
            :key-name="propName"
            :label="label"
            embed-label
            property
          />
        </div>
      </div>
    </template>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { getTypeFor, defaultValueForSchema } from '@/shared/schema'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import PropertyLabel from '@/features/Properties/components/PropertyLabel.vue'
import SchemaField from '@/features/Properties/components/SchemaField.vue'

const props = defineProps<{
  modelValue: unknown
  schema: TSchema
  required?: boolean
  label?: string
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
  horizontal?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

const type = computed((): string => {
  const p = props.schema
  return getTypeFor(p, currentForcedTypes.value?.[props.propName])
})

const multipleTypes = computed((): string[] | undefined => {
  const p = props.schema
  if (p.anyOf) {
    return p.anyOf.map((t) => t.type)
  }
  return undefined
})

watch(value, () => {
  // when the value changes to '' and its type is 'string', set it to undefined instead
  if (value.value === '' && type.value === 'string') {
    emit('update:model-value', undefined)
  }
})

const arraySchema = computed(() => props.schema.items)

const arrayIsHorizontalPopup = computed(() => arraySchema.value?.horizontalPopup)

const arraySchemaIsObject = computed(() => (
  getTypeFor(arraySchema.value, currentForcedTypes.value[props.propName]) === 'object'
))

const addItem = (arr: unknown[]): unknown | undefined => {
  const newValue = defaultValueForSchema(arraySchema.value)
  arr.push(newValue)
  return newValue
}

const removeItem = (arr: unknown[], index: number): boolean => {
  arr.splice(index, 1)
  return true
}

const changeType = (t: string) => {
  currentForcedTypes.value[props.propName] = t
  emit('update:model-value', undefined)
}

const subPropName = (name: string | number) => (
  props.propName ? `${props.propName}.${name.toString()}` : name.toString()
)

const nonExpandable = computed(() => !['object', 'array'].includes(type.value))
</script>

<style scoped lang="sass">
.label
  min-height: 40px
</style>
