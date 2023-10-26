<template>
  <form-display
    v-if="fields"
    v-bind="$attrs"
    :model-value="data || {}"
    :fields="fields"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { formSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathersService } from '@/composites/feathers'
import FormDisplay from '@/features/Forms/components/FormDisplay.vue'

type Form = Static<typeof formSchema>

const props = defineProps<{
  formId?: string
  data?: AnyData
}>()

const userForm = useFeathersService('forms')
  .findOneInStore({ query: {} })

const form = computed(() => (
  userForm.value?.list.find((frm: Form) => frm._id === props.formId)
))

const fields = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  form.value?._fields
))

</script>
