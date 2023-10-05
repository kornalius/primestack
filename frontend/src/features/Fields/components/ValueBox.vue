<template>
  <div :class="containerClass">
    <div class="row full-height">
      <div class="col">
        <div
          v-if="label"
          class="row q-mb-xs items-center"
        >
          <div class="col">
            <div :class="labelClass">
              {{ label }}
            </div>
          </div>
        </div>

        <div
          v-if="tag"
          class="row q-mb-xs items-center"
        >
          <div class="col-auto">
            <div :class="tagClass">
              {{ tag }}
            </div>
          </div>
        </div>

        <div
          v-if="diff && diffIcon"
          class="row q-mb-xs items-center"
        >
          <div class="col-auto">
            <q-icon
              v-if="diffIcon && !diffIconSuffix"
              :name="diffIcon"
              :color="diffIconColor"
              :size="diffIconSize"
            />

            <span :class="diffClass">
              {{ diffValue }}
            </span>

            <q-icon
              v-if="diffIcon && diffIconSuffix"
              :name="diffIcon"
              :color="diffIconColor"
              :size="diffIconSize"
            />
          </div>
        </div>

        <div
          v-if="value !== undefined"
          class="row q-mb-xs items-center"
        >
          <div class="col">
            <div :class="valueClass">
              {{ value }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-auto q-ml-md">
        <div class="row full-height items-center">
          <div class="col">
            <q-icon
              v-if="icon"
              class="icon"
              :name="icon"
              :color="iconColor"
              size="64px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AnyData } from '@/shared/interfaces/commons'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type FormatStyle = 'currency' | 'decimal' | 'percent'

type TextStyle = 'subtitle1' | 'subtitle2'
| 'body1' | 'body2'
| 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
| 'caption' | 'overline'

const props = defineProps<{
  modelValue: number | undefined
  // container class
  containerClass?: AnyData
  // value color
  valueColor?: string
  // format value style
  formatValue?: FormatStyle
  // format value style
  valueStyle?: TextStyle
  // format value currency
  valueCurrency?: string
  // hide the currency symbol
  valueCurrencyNarrow?: boolean
  // background color
  color?: string
  // label
  label?: string
  // label color
  labelColor?: string
  // format value style
  labelStyle?: TextStyle
  // icon
  icon?: string
  // icon color
  iconColor?: string
  // tag label
  tag?: string
  // tag color
  tagColor?: string
  // difference value
  // format value style
  tagStyle?: TextStyle
  diff?: number
  // format diff label style
  formatDiff?: FormatStyle
  // diff color
  diffColor?: string
  // diff icon
  // format value style
  diffStyle?: TextStyle
  diffIcon?: string
  // diff icon color
  diffIconColor?: string
  // tag label size
  diffIconSize?: Size
  // should we place the diff icon after the diff value
  diffIconSuffix?: boolean
}>()

const format = (style: FormatStyle, value: number, digits = 0): string => (
  style
    ? new Intl.NumberFormat(
      undefined,
      {
        style,
        localeMatcher: 'best fit',
        currencyDisplay: props.valueCurrencyNarrow ? 'narrowSymbol' : undefined,
        currency: props.valueCurrency || 'CAD',
        minimumFractionDigits: digits,
      },
    ).format(value || 0)
    : String(value)
)

const containerClass = computed(() => ({
  container: true,
  'q-pa-sm': true,
  [`bg-${props.color}`]: true,
  ...(props.containerClass || {}),
}))

const valueClass = computed(() => ({
  value: true,
  [`text-${props.valueColor}`]: true,
  [`text-${props.valueStyle || 'h5'}`]: true,
  'text-bold': true,
}))

const value = computed(() => (
  format(props.formatValue, props.modelValue)
))

const labelClass = computed(() => ({
  label: true,
  [`text-${props.labelColor}`]: true,
  [`text-${props.labelStyle || 'h6'}`]: true,
}))

const diffClass = computed(() => ({
  diff: true,
  [`text-${props.diffColor}`]: true,
  [`text-${props.diffStyle || 'subtitle1'}`]: true,
  'text-bold': true,
}))

const diffValue = computed(() => (
  format(props.formatDiff, props.diff, 2)
))

const tagClass = computed(() => ({
  tag: true,
  'q-py-xs': true,
  'q-px-sm': true,
  [`text-${props.tagColor}-10`]: true,
  [`bg-${props.tagColor}-2`]: true,
  [`text-${props.tagStyle || 'subtitle1'}`]: true,
}))
</script>

<style scoped lang="sass">
.container
  border-radius: 3px

.tag
  border-radius: 20px

.icon
  opacity: .5
</style>
