<template>
  <div class="file-upload row">
    <div class="col-5 file-upload-area flex align-center justify-center">
      <input
        id="file-upload-input"
        ref="uploadInput"
        :accept="accept"
        :disabled="disabled || hasMaximumFiles"
        :multiple="multiple"
        name="file"
        type="file"
        @change="handleFileChange"
      >

      <div class="content">
        <div class="row justify-center">
          <div class="col-auto">
            <q-icon name="mdi-cloud-upload-outline" size="xl" color="grey-7" />
          </div>
        </div>

        <div class="row justify-center q-mt-sm">
          <div class="col-auto" :class="{ 'text-grey-4': disabled }">
            {{ label }}
          </div>
        </div>

        <div class="row justify-center q-mt-sm">
          <div class="col-auto">
            <div class="q-btn q-btn--no-uppercase bg-primary text-white">
              Select a file...
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col q-ml-md">
      <files-list
        :query="query"
        @remove="removeFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useSnacks } from '@/features/Snacks/store'
import { useFiles } from '@/features/Files/composites'
import { schema } from '@/shared/schemas/file'
import { useFeathers } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import FilesList from './Files.vue'

type StoreFile = Static<typeof schema>

const props = defineProps<{
  /**
   * Is the uploader disabled?
   */
  disabled?: boolean
  /**
   * Label
   */
  label: string
  /**
   * List of mime types of files that are accepted
   */
  accept: string[]
  /**
   * The query to add to the useFind for files, to restrict to a specific section or record attached to
   */
  query: AnyData
  /**
   * Limit the maximum number of files that can be uploaded.
   * -1 is unlimited
   */
  maxFiles: number
  /**
   * Limit the file size of each file
   */
  maxFileSize: number
  /**
   * Allow selecting multiple files
   */
  multiple?: boolean
}>()

defineEmits<{
  (e: 'update:model-value', value: string[]): void,
}>()

const uploadInput = ref()

const { api } = useFeathers()

const { t } = useI18n()

const snacks = useSnacks()

const quasar = useQuasar()

const {
  formatSize,
  fileStates,
  uploadFile,
} = useFiles(t)

const { data: files, find } = api.service('files').useFind({ query: props.query, temps: true })
find()

/**
 * Check if the file is in the uploaded files list
 *
 * @param filename Filename to check
 */
const fileExists = (filename: string): boolean => (
  !!files.value.find((f) => f.originalFilename === filename)
)

/**
 * Has the maximum number of files been uploaded yet?
 */
const hasMaximumFiles = computed(() => (
  props.maxFiles > 0 && files.value.length >= props.maxFiles
))

/**
 * Check before upload file if it's valid
 *
 * @param file File to check
 */
const isValidFile = (file: StoreFile): boolean => {
  if (props.maxFiles > 0 && files.value.length >= props.maxFiles) {
    snacks.pushError(
      t('uploader.tooManyFiles', { count: props.maxFiles }),
    )
    return false
  }
  if (file.size > props.maxFileSize) {
    snacks.pushError(
      t('uploader.fileTooBig', { size: formatSize(props.maxFileSize) }),
    )
    return false
  }
  if (!props.accept.includes(file.mimetype)) {
    snacks.pushError(t('uploader.incorrectType'))
    return false
  }
  if (fileExists(file.originalFilename)) {
    snacks.pushError(t('uploader.alreadyExist'))
    return false
  }
  return true
}

const handleFileChange = (e) => {
  if (e.target.files) {
    e.target.files.forEach(async (file: File) => {
      const def = {
        newFilename: null,
        originalFilename: file.name,
        mimetype: file.type,
        size: file.size,
        extension: file.name.split('.').pop(),
        state: fileStates.NONE,
        progress: 0,
      } as StoreFile

      if (isValidFile(def)) {
        const f = api.service('files').new(def)
        f.createInStore()

        // stream upload file directly to uploads service
        await uploadFile(f, file)

        if (f.state === fileStates.UPLOAD_END) {
          f.removeFromStore()
        }
      }
    })
  }

  // weird trick to reset the input tooltip etc...
  // eslint-disable-next-line no-self-assign
  uploadInput.value.value = []
}

/**
 * Remove the file from the store and possibly the backend
 *
 * @param file File to remove
 */
const removeFile = (file: StoreFile) => {
  const ff = files.value.find((f) => f._id === file._id)
  if (ff) {
    quasar.dialog({
      title: t('file.dialog.delete.title'),
      persistent: true,
      message: t('file.dialog.delete.message'),
      ok: {
        label: t('dialog.delete'),
        color: 'negative',
        outline: true,
      },
      cancel: {
        label: t('dialog.cancel'),
        outline: true,
      },
    }).onOk(() => {
      ff.remove()
    })
  }
}
</script>

<style scoped lang="sass">
.file-upload
  & .file-upload-area
    position: relative
    width: 400px
    height: 200px
    border: 2px dashed #ccc
    border-radius: 8px

    &:hover
      border-color: $blue-grey-3

    & .content
      position: absolute
      height: 130px
      margin-top: 30px
      user-select: none
      pointer-events: none

#file-upload-input
  opacity: 0
  width: 100%
  height: 100%
  cursor: pointer
</style>
