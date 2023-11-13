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

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(field._id)"
        class="action-button edit"
        icon="mdi-pencil"
        color="green-4"
        size="xs"
        round
        @click.stop="onEditForm"
      >
        <q-tooltip :delay="500">
          {{ $t('form.controls.editForm') }}
        </q-tooltip>
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import FormEmbedded from '@/features/Forms/components/FormEmbedded.vue'
import { useRouter } from 'vue-router'
import { useUrl } from '@/composites/url'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: FormField
}>()

const emit = defineEmits<{
  (e: 'click', value: FormColumn): void,
  (e: 'add', value: FormColumn): void,
  (e: 'remove', value: FormColumn): void,
  (e: 'add-action'): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)

const editor = useAppEditor()

const router = useRouter()

const { formUrl } = useUrl()

const onEditForm = () => {
  router.push(formUrl(field.value.formId))
}
</script>

<style scoped lang="sass">
.form
  position: relative
  min-height: 100px

.action-button
  position: absolute
  top: 0
  right: 0
  width: 24px
  height: 24px
  transform: translate(50%, -50%)
  z-index: 5

  &.edit
    right: 26px
</style>
