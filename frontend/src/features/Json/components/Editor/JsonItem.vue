<template>
  <div>
    <li>
      <div class="row items-center">
        <!-- Expand/Collapse button -->

        <div class="col-auto q-mr-sm relative-position" style="width: 20px;">
          <q-btn
            v-if="isArray || isObject"
            :icon="jsonEditor.isPathExpanded(pathString) ? 'mdi-minus' : 'mdi-plus'"
            size="sm"
            dense
            round
            flat
            @click="jsonEditor.togglePath(pathString)"
          />
        </div>

        <!-- Drag handle -->

        <div
          v-if="typeof itemKey === 'number'"
          class="col-auto"
          style="cursor: move; padding-bottom: 4px;"
        >
          <q-icon class="drag-handle" name="mdi-drag" size="large" />
        </div>

        <div class="col q-mb-xs">
          <div class="row items-center">
            <!-- Types button -->

            <div class="col-auto q-mr-xs">
              <q-btn
                :icon="types[itemType].icon"
                :color="types[itemType].color"
                :disable="path.length === 0"
                tabindex="-1"
                flat
                dense
              >
                <q-menu>
                  <q-list dense>
                    <q-item
                      v-for="k in Object.keys(types)"
                      :key="k"
                      clickable
                      v-close-popup
                      @click="setItemType(k)"
                    >
                      <q-item-section avatar>
                        <q-icon
                          :name="types[k].icon"
                          :color="types[k].color"
                          size="sm"
                        />
                      </q-item-section>

                      <q-item-section>
                        <span :class="`text-${types[k].color}`">
                          {{ startCase(k) }}
                        </span>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <!-- Key or index # -->

            <key-item
              :model-value="itemKey as string"
              :parent="parent"
              :path="path"
              @change-key="(newKey, oldKey) => $emit('change-key', newKey, oldKey)"
            />

            <div
              v-if="!isArray && !isObject"
              class="col-auto q-mr-md text-bold"
            >
              :
            </div>

            <!-- Value -->

            <div class="col">
              <value-item
                v-if="!isArray && !isObject"
                v-model="item"
                :parent="parent"
                :path="path"
              />
            </div>

            <div class="col-auto q-ml-sm">
              <q-btn
                v-if="path.length > 0"
                icon="mdi-close"
                size="sm"
                color="red-5"
                tabindex="-1"
                dense
                round
                flat
                @click="$emit('remove', itemKey)"
              />
            </div>
          </div>
        </div>
      </div>
    </li>

    <array-item
      v-if="isArray && jsonEditor.isPathExpanded(pathString)"
      v-model="item"
      :parent="parent"
      :path="path"
    />

    <object-item
      v-else-if="isObject && jsonEditor.isPathExpanded(pathString)"
      v-model="item"
      :parent="parent"
      :path="path"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import startCase from 'lodash/startCase'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import ArrayItem from '@/features/Json/components/Editor/ArrayItem.vue'
import ObjectItem from '@/features/Json/components/Editor/ObjectItem.vue'
import ValueItem from '@/features/Json/components/Editor/ValueItem.vue'
import KeyItem from '@/features/Json/components/Editor/KeyItem.vue'

const props = defineProps<{
  modelValue: unknown
  parent?: unknown
  itemKey?: string | number
  path?: (string | number)[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'remove', key: string | number): void,
  (e: 'change-key', newValue: string, oldValue: string): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const item = useModelValue(props, emit)

const jsonEditor = useJsonEditor()

const types = ref({
  string: { icon: 'mdi-code-string', color: 'green' },
  number: { icon: 'mdi-numeric-1-box', color: 'blue' },
  boolean: { icon: 'mdi-checkbox-marked', color: 'orange' },
  array: { icon: 'mdi-code-array', color: 'purple' },
  object: { icon: 'mdi-code-braces-box', color: 'grey' },
  null: { icon: 'mdi-close-box', color: 'red' },
  undefined: { icon: 'mdi-help-box', color: 'brown' },
})

const isArray = computed(() => Array.isArray(item.value))

const isObject = computed(() => (
  !isArray.value && typeof item.value === 'object' && item.value !== null
))

const itemType = computed(() => {
  if (isArray.value) {
    return 'array'
  }
  if (isObject.value) {
    return 'object'
  }
  if (item.value === null) {
    return 'null'
  }
  if (item.value === undefined) {
    return 'undefined'
  }
  return typeof item.value
})

const setItemType = (type: string) => {
  if (type === 'string') {
    if (['array', 'object'].includes(itemType.value)) {
      item.value = ''
    } else {
      item.value = (item.value || '').toString()
    }
  } else if (type === 'number') {
    item.value = Number(item.value) || 0
  } else if (type === 'boolean') {
    if (item.value === 'true') {
      item.value = true
    } else if (item.value === 'false') {
      item.value = true
    } else {
      item.value = item.value === 1
    }
  } else if (type === 'array') {
    item.value = [item.value]
  } else if (type === 'object') {
    item.value = { key: item.value }
  } else if (type === 'null') {
    item.value = null
  } else if (type === 'undefined') {
    item.value = undefined
  }
}

const pathString = computed(() => props.path.join('.'))
</script>

<style scoped lang="sass">
</style>
