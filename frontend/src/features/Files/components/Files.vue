<template>
  <q-list separator dense>
    <file-document
      v-for="file in files"
      :key="file.filename"
      :model-value="file"
      :disabled="disabled"
      @remove="$emit('remove', file)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/file'
import { useFeathers } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import FileDocument from './File.vue'

type StoreFile = Static<typeof schema>

const props = defineProps<{
  /**
   * Is the uploader disabled?
   */
  disabled?: boolean
  /**
   * The query to add to the useFind for files, to restrict to a specific section or record attached to
   */
  query: AnyData
}>()

defineEmits<{
  (e: 'remove', file: StoreFile): void,
}>()

const { api } = useFeathers()

const params = computed(() => ({
  query: props.query,
  temps: true,
}))

const { data: files, find } = api.service('files').useFind(params)
find()
</script>

<style scoped lang="sass">
.file-upload
  position: relative
  width: 100%
  border: 2px dashed #ccc
  border-radius: 8px

  & .file-upload-area
    height: 50px

#file-upload-input
  opacity: 0
  width: 100%
  height: 50px
  cursor: pointer
  position: absolute
</style>
