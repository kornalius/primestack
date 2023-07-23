<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="entities"
    autocomplete="label"
    emit-value
    map-options
  >
    <template v-if="createNew" #no-option>
      <q-item
        dense
        clickable
        @click="$emit('create')"
      >
        <q-item-section>
          <q-item-label class="text-blue-4">
            <q-icon name="mdi-plus" size="xs" />
            {{ createLabel || 'Create new...' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-if="createNew" #before-options>
      <q-item
        dense
        clickable
        @click="$emit('create')"
      >
        <q-item-section>
          <q-item-label class="text-blue-4">
            <q-icon name="mdi-plus" size="xs" />
            {{ createLabel || 'Create new...' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useFeathers } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'

const props = defineProps<{
  modelValue: unknown
  service?: string
  query?: AnyData
  createNew?: boolean
  createLabel?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void,
  (e: 'create'): void,
}>()

const value = useModelValue(props, emit)

const { api } = useFeathers()

const { data: schemas } = api.service('schemas').useFind({ query: {} })
const { data: forms } = api.service('forms').useFind({ query: {} })
const { data: menus } = api.service('menus').useFind({ query: {} })

const userSchema = computed(() => schemas.value?.[0])
const userForm = computed(() => forms.value?.[0])
const userMenu = computed(() => menus.value?.[0])

let data

const entities = computed(() => {
  switch (props.service) {
    case 'schemas':
      return userSchema.value?.list.map((s) => ({
        label: s.name,
        value: s._id,
      }))
    case 'forms':
      return userForm.value?.list.map((s) => ({
        label: s.name,
        value: s._id,
      }))
    case 'menus':
      return userMenu.value?.list.map((s) => ({
        label: s.name,
        value: s._id,
      }))
    default:
      return data?.value
  }
})

watch(() => props.service, () => {
  if (props.service && !['schemas', 'menus', 'forms'].includes(props.service)) {
    const { data: c, find: findEntities } = api.service(props.service).useFind({
      query: props.query || {},
    })
    data = c
    findEntities()
  }
})
</script>
