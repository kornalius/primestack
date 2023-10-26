<template>
  <q-card
    class="form"
    style="background: transparent;"
    flat
  >
    <q-card-section class="q-pa-sm">
      <form-embedded
        :form-id="field.formId"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import FormEmbedded from '@/features/Forms/components/FormEmbedded.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: FormField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: FormColumn): void,
  (e: 'add', value: FormColumn): void,
  (e: 'remove', value: FormColumn): void,
  (e: 'add-action'): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)
</script>

<style scoped lang="sass">
.form
  position: relative
  min-height: 100px
</style>
