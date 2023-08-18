<template>
  <div class="q-pa-md flex flex-center">
    <uploader
      :accept="mimetypes"
      :max-file-size="maxFileSize"
      :max-files="10"
      :query="{}"
      label="Select a file or drag one here..."
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFiles } from '@/features/Files/composites'
import Uploader from '@/features/Files/components/Uploader.vue'

const { t } = useI18n()

const { mimetypes, maxFileSize } = useFiles(t)
</script>
