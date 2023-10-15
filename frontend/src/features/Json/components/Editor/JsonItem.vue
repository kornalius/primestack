<template>
  <div>
    <li
      class="row items-center"
      @mouseover.stop="hover = true"
      @mouseleave="hover = false"
      @focus.stop="hover = true"
      @blur="hover = false"
    >
      <!-- Expand/Collapse button -->

      <div class="col-auto q-mr-sm relative-position" style="width: 20px;">
        <q-btn
          v-if="isArray || isObject"
          :style="{ opacity: hover ? 1 : .25 }"
          :icon="isExpanded ? 'mdi-minus' : 'mdi-plus'"
          size="sm"
          dense
          round
          flat
          @click="jsonEditor.togglePath(pathString)"
        >
          <q-tooltip :delay="500">
            {{ isExpanded ? $t('json_editor.collapse') : $t('json_editor.expand') }}
          </q-tooltip>
        </q-btn>
      </div>

      <!-- Drag handle -->

      <div
        v-if="typeof itemKey === 'number'"
        class="col-auto"
        style="cursor: move; padding-bottom: 4px;"
      >
        <q-icon class="drag-handle" name="mdi-drag" size="large" />
      </div>

      <div class="col">
        <div class="row items-center">
          <!-- Types button -->

          <div class="col-auto q-mr-xs">
            <q-btn
              :icon="types[itemType]?.icon"
              :color="types[itemType]?.color"
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

                    <q-item-section
                      v-if="types[k].shortcut"
                      side
                    >
                      <span class="text-grey-8 text-caption">
                        &lt;{{ types[k].shortcut }}&gt;
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

          <div class="col" style="height: 40px;">
            <value-item
              v-if="!isArray && !isObject"
              v-model="item"
              :parent="parent"
              :path="path"
            />
          </div>

          <!-- Add button -->

          <div class="col-auto q-ml-sm">
            <q-btn
              v-if="path.length > 0"
              :style="{ opacity: hover ? 1 : 0 }"
              icon="mdi-plus"
              size="sm"
              color="blue-5"
              tabindex="-1"
              dense
              round
              flat
              @click="add"
            >
              <q-tooltip :delay="500">
                {{ $t('json_editor.add') }}
              </q-tooltip>
            </q-btn>
          </div>

          <!-- Remove button -->

          <div class="col-auto q-ml-sm">
            <q-btn
              v-if="path.length > 0"
              :style="{ opacity: hover ? 1 : 0 }"
              icon="mdi-close"
              size="sm"
              color="red-5"
              tabindex="-1"
              dense
              round
              flat
              @click="$emit('remove', itemKey)"
            >
              <q-tooltip :delay="500">
                {{ $t('json_editor.remove') }}
              </q-tooltip>
            </q-btn>
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
  (e: 'insert-before', key: string | number): void,
  (e: 'insert-after', key: string | number): void,
  (e: 'change-key', newValue: string, oldValue: string): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const item = useModelValue(props, emit)

const jsonEditor = useJsonEditor()

const hover = ref(false)

const types = ref({
  string: { icon: 'mdi-code-string', color: 'green', shortcut: 'ctrl+s' },
  number: { icon: 'mdi-numeric-1-box', color: 'blue', shortcut: 'ctrl+n' },
  boolean: { icon: 'mdi-checkbox-marked', color: 'orange', shortcut: 'ctrl+b' },
  array: { icon: 'mdi-code-array', color: 'purple', shortcut: 'ctrl+a' },
  object: { icon: 'mdi-code-braces-box', color: 'grey', shortcut: 'ctrl+o' },
  null: { icon: 'mdi-close-box', color: 'red', shortcut: 'ctrl+l' },
  undefined: { icon: 'mdi-help-box', color: 'brown', shortcut: 'ctrl+u' },
})

const isArray = computed(() => Array.isArray(item.value))

const isObject = computed(() => (
  !isArray.value && typeof item.value === 'object' && item.value !== null
))

const pathString = computed(() => props.path.join('.'))

const itemType = computed(() => jsonEditor.itemType(pathString.value))

const setItemType = (type: string) => {
  jsonEditor.changeType(pathString.value, type)
}

const add = (e: MouseEvent) => {
  if (e.altKey) {
    emit('insert-before', props.itemKey)
  } else {
    emit('insert-after', props.itemKey)
  }
}

const isExpanded = computed(() => jsonEditor.isPathExpanded(pathString.value))
</script>

<style scoped lang="sass">
</style>
