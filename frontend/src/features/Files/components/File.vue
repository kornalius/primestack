<template>
  <q-card class="q-pa-sm q-mb-sm" flat bordered>
    <div class="row">
      <div class="col-auto" style="width: 44px;">
        <q-icon :name="icon" color="grey-7" size="lg" />
      </div>

      <div class="col">
        <div class="row">
          <div class="col-auto overflow-hidden ellipsis" style="max-width: 50%;">
            {{ name }}
          </div>

          <div class="col q-ml-md text-caption text-grey-6 text-right">
            {{ size }}
          </div>

          <div class="col-auto q-ml-md">
            <q-btn
              icon="mdi-close"
              size="xs"
              round
              flat
              @click="remove"
            >
              <q-tooltip :delay="500">
                {{ t('uploader.remove') }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <div class="row q-mt-xs">
          <div v-if="isProgressing" class="col">
            <q-linear-progress :value="progress" />
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-auto" style="width: 44px;" />
      <div v-if="isProgressing" class="col">
        <span :class="hasError">{{ state }}</span>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFiles } from '@/features/Files/composites'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/file'
import { useProp } from '@/composites/prop'

type StoreFile = Static<typeof schema>

const props = defineProps<{
  /**
   * File
   */
  modelValue: StoreFile
  /**
   * Is the file disabled?
   */
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void,
}>()

const file = useProp(props, 'modelValue') as Ref<StoreFile>

const { t } = useI18n()

const {
  formatSize,
  fileTypeForMimeType,
  fileStates,
  stateLabels,
} = useFiles(t)

const icon = computed(() => fileTypeForMimeType(file.value.mimetype)?.icon)

const name = computed(() => file.value.originalFilename)

const size = computed(() => formatSize(file.value.size))

const progress = computed(() => file.value.progress)

const isProgressing = computed(() => (
  ![fileStates.COMPLETED, fileStates.NONE, fileStates.ERROR]
    .includes(file.value.state)
))

const state = computed(() => {
  if (file.value.state === fileStates.ERROR) {
    return file.value.error
  }

  if (file.value.state === fileStates.COMPLETED) {
    return stateLabels[file.value.state]
  }

  return `${file.value.progress}% ${t('uploader.done')}`
})

const hasError = computed(() => file.value.state === fileStates.ERROR)

const remove = () => {
  emit('remove')
}
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.hasError
  color: $negative
</style>
