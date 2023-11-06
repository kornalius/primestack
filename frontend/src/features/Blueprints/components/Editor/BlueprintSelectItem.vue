<template>
  <q-item
    :key="blueprint._id"
    clickable
    v-close-popup
    v-ripple
    @mouseover="$emit('focus')"
    @mouseleave="$emit('blur')"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @click="$emit('click', blueprint)"
  >
    <!-- Checkmark -->

    <q-item-section style="width: 24px;" avatar>
      <q-icon
        v-if="editor.isBlueprintApplied(blueprint._id, field)"
        name="mdi-check"
        size="xs"
      />
    </q-item-section>

    <!-- Name + Description -->

    <q-item-section>
      <q-item-label>
        {{ blueprint.name }}
      </q-item-label>
      <q-item-label caption>
        {{ blueprint.description }}
      </q-item-label>
    </q-item-section>

    <!-- Edit Button -->

    <q-item-section side>
      <q-btn
        :style="{ opacity: hovered ? 1 : 0 }"
        icon="mdi-tune-vertical-variant"
        size="sm"
        dense
        round
        flat
        @click.stop="$emit('edit', blueprint)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { fieldSchema } from '@/shared/schemas/form'
import { useAppEditor } from '@/features/Editor/store'

type Blueprint = Static<typeof blueprintSchema>
type Field = Static<typeof fieldSchema>

defineProps<{
  field: Field
  blueprint: Blueprint
  index: number
  hovered: boolean
}>()

defineEmits<{
  (e: 'click', blueprint: Blueprint): void,
  (e: 'edit', blueprint: Blueprint): void,
  (e: 'focus'): void,
  (e: 'blur'): void,
}>()

const editor = useAppEditor()
</script>
