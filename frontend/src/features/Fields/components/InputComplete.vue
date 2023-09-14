<template>
  <div
    ref="el"
    style="position: relative;"
  >
    <q-input
      v-model="value"
      v-bind="$attrs"
    />

    <div
      v-if="showMenu"
      class="menu bg-white shadow-4"
    >
      <q-list dense>
        <q-item
          v-for="(item, index) in filteredItems"
          :key="index"
          :active="selectedIndex === index"
          active-class="selected"
          clickable
          dense
        >
          <q-item-section avatar>
            <q-icon
              v-if="item.icon"
              :name="item.icon"
              :color="item.color"
              size="xs"
            />
          </q-item-section>

          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted, onUnmounted, onUpdated, Ref, ref, watch,
} from 'vue'
import getCaretPosition from 'textarea-caret'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | undefined
  items: { label: string, value: string, icon?: string, color?: string }[]
  // string to add to end of completion
  suffix?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void,
  (e: 'open'): void,
  (e: 'close'): void,
  (e: 'complete', value: string): void,
}>()

const value = useModelValue(props, emit)

const el = ref()
let input: HTMLElement
let menu: HTMLDivElement

const showMenu = ref(false)

const selectedIndex = ref(0)
const lastSearchText = ref() as Ref<string>
const lastSearchIndex = ref() as Ref<number>

/**
 * Input
 */

const emitInputEvent = (type: string) => {
  input.dispatchEvent(new Event(type))
}

const cancelEvent = (e: KeyboardEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const getSelectionStart = () => (input as HTMLInputElement).selectionStart

const setCaretPosition = (index: number) => {
  setTimeout(() => {
    (input as HTMLInputElement).selectionEnd = index
  })
}

const getInputValue = (): string => (input as HTMLInputElement).value

const setValue = (v: string) => {
  (input as HTMLInputElement).value = v
  emitInputEvent('input')
}

const getCurrentWord = (caretIndex: number) => {
  const v = getInputValue()
  let i = caretIndex - 1
  while (i >= 0) {
    if (!v[i].match(/[a-z0-9_]/i)) {
      i += 1
      break
    }
    i -= 1
  }
  lastSearchIndex.value = Math.max(0, i)
  return v.substring(i, caretIndex)
}

/**
 * Menu
 */

const updateMenuPosition = () => {
  const pos = getCaretPosition(input, lastSearchIndex.value)
  if (menu) {
    setTimeout(() => {
      menu.style.setProperty('left', `${pos.left}px`)
      menu.style.setProperty('top', `${pos.top + pos.height - input.scrollTop}px`)
    })
  }
}

const openMenu = () => {
  const index = getSelectionStart()
  if (index >= 0) {
    lastSearchText.value = getCurrentWord(index)
    showMenu.value = true
    selectedIndex.value = 0
    emit('open')
    setTimeout(() => {
      updateMenuPosition()
    })
  }
}

const closeMenu = () => {
  showMenu.value = false
  emit('close')
}

const onBlur = () => {
  closeMenu()
}

const onScroll = () => {
  updateMenuPosition()
}

/**
 * Items for the auto-completion
 */

const filteredItems = computed(() => {
  if (!lastSearchText.value || lastSearchText.value.length === 0) {
    return props.items
  }
  const finalSearchText = lastSearchText.value.toLowerCase()
  const items = props.items.filter((item) => item.label.toLowerCase().includes(finalSearchText))
  if (items.length === 0) {
    closeMenu()
  }
  return items
})

/**
 * Selection
 */

watch(filteredItems, () => {
  selectedIndex.value = 0
})

// Apply auto-completion

const replaceText = (text: string, searchString: string, newText: string, index: number) => (
  text.slice(0, index) + newText + text.slice(index + searchString.length + 1, text.length)
)

const applyCompletion = (itemIndex: number) => {
  const item = filteredItems.value[itemIndex]
  const v = `${item.value}${props.suffix || ''}`
  setValue(replaceText(getInputValue(), lastSearchText.value, v, lastSearchIndex.value))
  setCaretPosition(lastSearchIndex.value + v.length)
  emit('complete', item.value)
  closeMenu()
}

const onKeyDown = (e: KeyboardEvent) => {
  if (showMenu.value) {
    if (e.key === 'ArrowDown') {
      selectedIndex.value += 1
      if (selectedIndex.value >= filteredItems.value.length) {
        selectedIndex.value = 0
      }
      cancelEvent(e)
    }
    if (e.key === 'ArrowUp') {
      selectedIndex.value -= 1
      if (selectedIndex.value < 0) {
        selectedIndex.value = filteredItems.value.length - 1
      }
      cancelEvent(e)
    }
    if (
      (e.key === 'Enter' || e.key === 'Tab')
      && filteredItems.value.length > 0
    ) {
      applyCompletion(selectedIndex.value)
      cancelEvent(e)
    }
  } else if (e.key === ' ' && e.ctrlKey) {
    openMenu()
  }
}

const onKeyUp = (e: KeyboardEvent) => {
  if (showMenu.value) {
    if (e.key === 'Escape') {
      closeMenu()
      cancelEvent(e)
    }
  }
}

const onInput = (): boolean => {
  const index = getSelectionStart()
  if (index >= 0) {
    lastSearchText.value = getCurrentWord(index)
    openMenu()
    return true
  }
  closeMenu()
  return false
}

const attach = () => {
  if (input) {
    input.addEventListener('input', onInput)
    input.addEventListener('keydown', onKeyDown)
    input.addEventListener('keyup', onKeyUp)
    input.addEventListener('scroll', onScroll)
    input.addEventListener('blur', onBlur)
  }
}

const detach = () => {
  if (input) {
    input.removeEventListener('input', onInput)
    input.removeEventListener('keydown', onKeyDown)
    input.removeEventListener('keyup', onKeyUp)
    input.removeEventListener('scroll', onScroll)
    input.removeEventListener('blur', onBlur)
  }
}

const getInput = () => el.value.querySelector('input')

const getMenu = () => el.value.querySelector('.menu')

onMounted(() => {
  attach()
})

onUpdated(() => {
  const newInput = getInput()
  if (newInput !== input) {
    detach()
    input = newInput
    attach()
  }

  const newMenu = getMenu()
  if (newMenu !== menu) {
    menu = newMenu
  }
})

onUnmounted(() => {
  detach()
})
</script>

<style scoped lang="sass">
.menu
  position: absolute
  z-index: 10000
.selected
  background-color: #5781ab
  color: white
</style>
