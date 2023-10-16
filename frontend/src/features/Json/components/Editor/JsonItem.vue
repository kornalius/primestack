<template>
  <div>
    <li
      class="row items-center"
      @mouseover.stop="hover = true"
      @mouseleave="hover = false"
      @focus.stop="hover = true"
      @blur="hover = false"
      @click="focusOnKeyOrValue"
    >
      <!-- Expand/Collapse button -->

      <div class="col-auto q-mr-sm relative-position" style="width: 20px;">
        <q-btn
          v-if="isArray || isObject"
          :style="{ opacity: hover || focused ? 1 : .25 }"
          :icon="isExpanded ? 'mdi-minus' : 'mdi-plus'"
          size="sm"
          dense
          round
          flat
          @focus="focusExpand"
          @blur="blurExpand"
          @keydown="jsonEditor.keydown"
          @click.stop="jsonEditor.togglePath(pathString)"
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
              tabindex="-1"
              flat
              dense
            >
              <q-menu>
                <q-list dense>
                  <template
                    v-for="k in Object.keys(types)"
                    :key="k"
                  >
                    <q-separator v-if="types[k].label === '-'" />

                    <q-item
                      v-else
                      clickable
                      v-ripple
                      v-close-popup
                      @click="setItemType(k)"
                    >
                      <q-item-section avatar>
                        <q-icon
                          :name="types[k].icon"
                          :color="types[k].color"
                          :size="types[k].size || 'sm'"
                        />
                      </q-item-section>

                      <q-item-section>
                        <span :class="`text-${types[k].color}`">
                          {{ types[k].label }}
                        </span>
                      </q-item-section>

                      <q-item-section
                        v-if="types[k].shortcut"
                        side
                      >
                        <span class="text-grey-8 text-caption text-weight-medium">
                          {{ types[k].shortcut }}
                        </span>
                      </q-item-section>
                    </q-item>
                  </template>
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
              :style="{ opacity: hover || focused ? 1 : 0 }"
              icon="mdi-plus"
              size="sm"
              color="blue-5"
              tabindex="-1"
              dense
              round
              flat
              @click.stop="add"
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
              :style="{ opacity: hover || focused ? 1 : 0 }"
              icon="mdi-close"
              size="sm"
              color="red-5"
              tabindex="-1"
              dense
              round
              flat
              @click.stop="$emit('remove', itemKey)"
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
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import ArrayItem from '@/features/Json/components/Editor/ArrayItem.vue'
import ObjectItem from '@/features/Json/components/Editor/ObjectItem.vue'
import ValueItem from '@/features/Json/components/Editor/ValueItem.vue'
import KeyItem from '@/features/Json/components/Editor/KeyItem.vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const hover = ref(false)

const types = computed(() => {
  const primary = {
    string: {
      label: t('json_editor.string'),
      icon: 'mdi-code-string',
      color: 'green',
      shortcut: 'Ctrl+$',
    },
    number: {
      label: t('json_editor.number'),
      icon: 'mdi-numeric-1-box',
      color: 'blue',
      shortcut: 'Ctrl+#',
    },
    boolean: {
      label: t('json_editor.boolean'),
      icon: 'mdi-checkbox-marked',
      color: 'orange',
      shortcut: 'Ctrl+!',
    },
    null: {
      label: t('json_editor.null'),
      icon: 'mdi-close-box',
      color: 'red',
      shortcut: 'Ctrl+)',
      disabled: () => props.path.length > 0,
    },
    undefined: {
      label: t('json_editor.undefined'),
      icon: 'mdi-help-box',
      color: 'brown',
      disabled: () => props.path.length > 0,
    },
  }

  const object = {
    array: {
      label: t('json_editor.array'),
      icon: 'mdi-code-array',
      color: 'purple',
      shortcut: 'Ctrl+[',
    },
    object: {
      label: t('json_editor.object'),
      icon: 'mdi-code-braces-box',
      color: 'grey',
      shortcut: 'Ctrl+{',
    },
  }

  const insert = {
    sep: {
      label: '-',
    },
    insertBefore: {
      label: t('json_editor.insertBefore'),
      icon: 'mdi-arrow-collapse-up',
      color: 'grey-8',
      size: 'xs',
      shortcut: 'Alt+Enter',
    },
    insertAfer: {
      label: t('json_editor.insertAfter'),
      icon: 'mdi-arrow-collapse-down',
      color: 'grey-8',
      size: 'xs',
      shortcut: 'Enter',
    },
  }

  const remove = {
    sep: {
      label: '-',
    },
    remove: {
      label: t('json_editor.remove'),
      icon: 'mdi-close',
      color: 'grey-8',
      size: 'xs',
      shortcut: 'Delete',
    },
  }

  if (props.path.length > 0) {
    return {
      ...primary,
      ...object,
      ...insert,
      ...remove,
    }
  }

  return object
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

const focused = computed(() => jsonEditor.focusedPath === pathString.value)

const focusExpand = () => {
  setTimeout(() => {
    jsonEditor.setFocusedPath(pathString.value)
  }, 10)
}

const blurExpand = () => {
  jsonEditor.setFocusedPath(undefined)
}

const focusOnKeyOrValue = () => {
  if (itemType.value === 'boolean') {
    jsonEditor.setFocusedPath(pathString.value)
    setTimeout(() => {
      jsonEditor.focusValueInputForPath(pathString.value)
    }, 10)
  } else {
    jsonEditor.setFocusedKey(pathString.value)
    setTimeout(() => {
      jsonEditor.setFocusedPath(pathString.value)
      jsonEditor.focusKeyInputForPath(pathString.value)
    }, 10)
  }
}
</script>

<style scoped lang="sass">
</style>
