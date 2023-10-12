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
            {{ createLabel || $t('buttons.add') }}
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
            {{ createLabel || $t('buttons.add') }}
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
import { computed, ref, watch } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useFeathers } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'

const props = defineProps<{
  modelValue: unknown
  service?: string
  tableId?: string
  query?: AnyData
  createNew?: boolean
  createLabel?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void,
  (e: 'create'): void,
}>()

const reservedTableNames = ['tables', 'menus', 'forms', 'tabs', 'actions']

const value = useModelValue(props, emit)

const { api } = useFeathers()

const userTable = api.service('tables').findOneInStore({ query: {} })
const userForm = api.service('forms').findOneInStore({ query: {} })
const userMenu = api.service('menus').findOneInStore({ query: {} })
const userAction = api.service('actions').findOneInStore({ query: {} })

const data = ref()

const entities = computed(() => {
  switch (props.service) {
    case 'tables':
      return userTable.value?.list.map((t) => ({
        label: t.name,
        value: t._id,
      }))
    case 'forms':
      return userForm.value?.list.map((f) => ({
        label: f._id,
        value: f._id,
      }))
    case 'actions':
      return userAction.value?.list.map((a) => ({
        label: a.label,
        value: a._id,
      }))
    case 'menus':
      return userMenu.value?.list.map((m) => ({
        label: m.label,
        value: m._id,
      }))
    case 'tabs':
      return userMenu.value?.list.reduce((acc, m) => ([
        ...acc,
        ...m.tabs.map((t) => ({
          label: `${m.label} > ${t.label}`,
          value: t._id,
        })),
      ]), [])
    default:
      return data?.value
  }
})

watch([() => props.service, () => props.tableId], () => {
  if (props.service && !reservedTableNames.includes(props.service)) {
    const { data: c, find: findEntities } = api.service(props.service).useFind({
      query: props.query || {},
    })
    findEntities()
    watch(c, () => {
      data.value = c.value
    }, { immediate: true })
  } else if (props.tableId) {
    const { data: c, find } = api.service(props.tableId).useFind({
      query: props.query || {},
    })
    find()
    watch(c, () => {
      data.value = c.value
    }, { immediate: true })
  }
}, { immediate: true })
</script>
