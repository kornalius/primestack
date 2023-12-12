<template>
  <schema-table
    v-model:selected="selected"
    class="table-editor"
    v-bind="$attrs"
    :table-id="modelValue._id"
    :columns="columns"
    row-key="_id"
    add-button="end"
    remove-button
    editable
    hide-filter
    @click="emit('select-field', undefined)"
  >
    <template #header="p">
      <draggable
        v-model="columns"
        tag="tr"
        :component-data="p"
        :group="{ name: 'table-editor-headers' }"
        filter=".overlay"
        :animation="150"
        easing="cubic-bezier(1, 0, 0, 1)"
        item-key="name"
        @start="editor.setDragging(true)"
        @end="editor.setDragging(false)"
      >
        <template #item="{ index }">
          <q-th
            :props="p"
            style="position: relative;"
            @mouseover="hover = index as number"
            @mouseleave="hover = -1"
            @focus="hover = index as number"
            @blur="hover = -1"
          >
            <div
              :class="{
                label: true,
                hovered: hover === index,
                selected: editor.isSelected(fields[index]._id),
              }"
              style="min-height: 18px;"
              @click.stop="emit('select-field', fields[index])"
            >
              {{ columns[index].label }}
            </div>

            <q-btn
              v-show="hover === index"
              :class="{ actionButton: true, remove: true, dense: $attrs.dense }"
              :disable="disable || removeDisable"
              icon="mdi-trash-can-outline"
              color="red-6"
              size="xs"
              dense
              round
              flat
              @click.stop="emit('remove-field', fields[index], index)"
            />
          </q-th>
        </template>
      </draggable>

      <q-btn
        :class="{ actionButton: true, add: true, dense: $attrs.dense }"
        :disable="disable || addDisable"
        icon="mdi-plus"
        color="primary"
        size="xs"
        round
        flat
        @click.stop="emit('add-field')"
      />
    </template>
  </schema-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import isEqual from 'lodash/isEqual'
import { Static } from '@feathersjs/typebox'
import draggable from 'vuedraggable'
import { useSyncedProp } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: Table
  fields: TableField[]
  selected?: unknown[]
  disable?: boolean
  addDisable?: boolean
  removeDisable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: unknown[]): void,
  (e: 'update:fields', value: TableField[]): void,
  (e: 'add-field'): void,
  (e: 'remove-field', value: TableField, index: number): void,
  (e: 'select-field', value: TableField): void,
}>()

const selected = useSyncedProp(props, 'selected', emit)

const editor = useAppEditor()

const hover = ref(-1)

const columns = ref([])

watch(() => props.fields, () => {
  columns.value = props.fields.map((f: TableField) => ({
    name: f._id,
    label: f.name,
    field: f.name,
    sortable: false,
  })) || []
}, { immediate: true, deep: true })

watch(columns, () => {
  const newFields = columns.value.map((c) => props.fields.find((f) => f._id === c.name))
  if (!isEqual(props.fields, newFields)) {
    emit('update:fields', newFields)
  }
})
</script>

<style scoped lang="sass">
.actionButton
  position: absolute

  &.add
    top: 34px
    right: 4px

  &.remove
    top: 5px
    left: 8px
</style>

<style lang="sass">
@import 'quasar/src/css/variables'

.table-editor
  thead tr th
    .label
      &.selected
        outline: 2px solid $blue-grey-5 !important

      &.hovered
        outline: 1px dashed $blue-grey-4
</style>
