<template>
  <schema-table
    v-model:selected="selected"
    class="table-editor"
    v-bind="$attrs"
    :columns="cols"
    hide-filter
  >
    <template #header="p">
      <draggable
        v-model="cols"
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
                selected: editor.isFormTableColumnSelected(cols[index]._id),
              }"
              @click.stop="editor.selectFormTableColumn(cols[index]._id)"
            >
              {{ cols[index].label }}
            </div>

            <q-btn
              v-show="hover === index"
              :class="{ remove: true, dense: $attrs.dense }"
              :disable="disable || removeColumnDisable"
              :icon="removeColumnIcon || 'mdi-trash-can-outline'"
              color="red-6"
              size="xs"
              round
              flat
              @click.stop="removeColumn(index)"
            />
          </q-th>
        </template>
      </draggable>

      <q-btn
        :class="{ add: true, dense: $attrs.dense }"
        :disable="disable || addColumnDisable"
        :icon="addColumnIcon || 'mdi-plus'"
        color="primary"
        size="xs"
        round
        flat
        @click.stop="addColumn"
      />
    </template>
  </schema-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import hexObjectId from 'hex-object-id'
import startCase from 'lodash/startCase'
import { useSyncedProp } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/editor-store'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[]
  visibleColumns?: string[]
  disable?: boolean
  addColumnIcon?: string
  addColumnDisable?: boolean
  removeColumnIcon?: string
  removeColumnDisable?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:columns', value: any[]): void,
  (e: 'update:visibleColumns', value: string[]): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:selected', value: any[]): void,
}>()

const selected = useSyncedProp(props, 'selected', emit)
const cols = useSyncedProp(props, 'columns', emit)
const visCols = useSyncedProp(props, 'visibleColumns', emit)

const editor = useAppEditor()

const hover = ref(-1)

const addColumn = (): void => {
  let index = 1
  let newName = `col${index}`
  let field = cols.value.find((f) => f.name === newName)
  while (field) {
    index += 1
    newName = `col${index}`
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    field = cols.value.find((f) => f.name === newName)
  }

  cols.value.push({
    _id: hexObjectId(),
    name: newName,
    label: startCase(newName),
    field: undefined,
    align: 'left',
    required: false,
    sortable: false,
    sortOrder: 'ad',
  })

  visCols.value.push(newName)
}

const removeColumn = (index: number): void => {
  if (index !== -1) {
    const { name } = cols.value[index]
    const visIdx = visCols.value.indexOf(name)
    if (visIdx !== -1) {
      visCols.value.splice(visIdx, 1)
    }
    cols.value.splice(index, 1)
  }
}
</script>

<style scoped lang="sass">
.add
  position: absolute
  top: 12px
  right: 24px

  &.dense
    right: 28px
    top: 0

.remove
  position: absolute
  top: 12px
  left: -6px

  &.dense
    left: -10px
    top: 4px

</style>

<style lang="sass">
.table-editor
  thead tr th
    .label
      &.selected
        outline: 2px solid $blue-grey-5 !important

      &.hovered
        outline: 1px dashed $blue-grey-4
</style>
