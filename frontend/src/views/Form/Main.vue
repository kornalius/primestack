<template>
  <div v-if="editor.active" class="row">
    <div class="q-mb-sm full-width">
      <div class="row bg-grey-8 items-center q-px-sm">
        <div class="col">
          <span class="text-h6 text-white">Form</span>
        </div>

        <div class="col-auto">
          <q-toggle
            v-model="preview"
            class="q-ml-sm text-white"
            label="Preview"
            left-label
            dense
          />

          <q-toggle
            v-model="showPreviewFormData"
            class="q-ml-sm text-white"
            :disable="!preview"
            label="Data"
            left-label
            dense
          />
        </div>
      </div>
    </div>
  </div>

  <form-display
    v-if="!editor.active"
    v-model="formData"
    :fields="fields"
    :components="components"
  />

  <form-display
    v-else-if="preview"
    v-model="previewFormData"
    :fields="fields"
    :components="components"
  />

  <form-editor
    v-else
    v-model="fields"
    :components="components"
  />

  <div
    v-if="preview && showPreviewFormData"
    class="q-mt-sm"
  >
    <div class="bg-grey-8 q-pl-sm q-mb-sm">
      <div class="row items-center">
        <div class="col">
          <span class="text-h6 text-white">Data</span>
        </div>
      </div>
    </div>

    <pre>{{ previewFormData }}</pre>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue'
import { useSchema } from '@/composites/schema'
import useFormElements from '@/features/Forms/composites'
import FormEditor from '@/features/Forms/components/Editor/FormEditor.vue'
import FormDisplay from '@/features/Forms/components/FormDisplay.vue'
import { api } from '@/plugins/pinia'
import useAppEditor from '@/features/App/store'

const props = defineProps<{
  menuId: string
  tabId: string
  id?: string
  create?: boolean
}>()

const editor = useAppEditor()

const { data: menus } = api.service('menus').useFind({
  query: {},
})

const userMenu = computed(() => menus.value?.[0])

const menu = computed(() => userMenu.value?.list.find((m) => m._id === props.menuId))

const tab = computed(() => (
  menu.value?.tabs.find((t) => t._id === props.tabId)
))

const { data: forms } = api.service('forms').useFind({
  query: {},
})

const userForm = computed(() => forms.value?.[0])

const form = computed(() => userForm.value?.list.find((f) => f._id === tab.value?.formId))

const fields = ref([])

watch(form, () => {
  if (form.value) {
    fields.value = form.value.fields
    editor.setFormId(form.value._id)
  }
}, { immediate: true })

const { defaultValueForSchema } = useSchema()

const { components: comps, flattenFields } = useFormElements()

const components = ref(comps)

const defaultValues = computed(() => flattenFields(fields.value)
  .reduce((acc, f) => {
    // eslint-disable-next-line no-underscore-dangle
    const comp = components.value.find((c) => c.type === f._type)
    if (comp && !comp.nokey) {
      return { ...acc, [f.name]: defaultValueForSchema(comp.schema.properties.modelValue) }
    }
    return acc
  }, {}))

const formData = ref({
  ...defaultValues.value,
  ...(JSON.parse(form.value?.data || '{}')),
})

const preview = ref(false)
const previewFormData = ref({})
const showPreviewFormData = ref(false)

watch(preview, () => {
  previewFormData.value = {
    ...defaultValues.value,
    ...(JSON.parse(form.value?.data || '{}')),
  }
})

onBeforeUnmount(() => {
  editor.setFormId(undefined)
})
</script>
