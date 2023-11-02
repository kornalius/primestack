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
import { useFeathersService } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'

const props = defineProps<{
  modelValue: unknown
  service?: string
  tableId?: string
  query?: AnyData
  createNew?: boolean
  createLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void,
  (e: 'create'): void,
}>()

const reservedTableNames = ['tables', 'menus', 'forms', 'tabs', 'actions']

const value = useModelValue(props, emit)

const userTable = useFeathersService('tables')
  .findOneInStore({ query: {} })

const userForm = useFeathersService('forms')
  .findOneInStore({ query: {} })

const userMenu = useFeathersService('menus')
  .findOneInStore({ query: {} })

const userAction = useFeathersService('actions')
  .findOneInStore({ query: {} })

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
        label: f.name,
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
      return data.value?.value
  }
})

const params = computed(() => ({
  query: {
    ...(props.query || {}),
    $limit: -1,
    $skip: 0,
  },
}))

watch([() => props.service, () => props.tableId], () => {
  if (props.service && !reservedTableNames.includes(props.service)) {
    const { data: c, find } = useFeathersService(props.service)
      .useFind(params)
    find()
    watch(c, () => {
      data.value = c.value
    }, { immediate: true })
  } else if (props.tableId) {
    const { data: c, find } = useFeathersService(props.tableId)
      .useFind(params)
    find()
    watch(c, () => {
      data.value = c.value
    }, { immediate: true })
  }
}, { immediate: true })
</script>
