<template>
  <q-page class="q-pa-sm flex flex-center">
    <uploader
      :label="$t('upload.message')"
      :accept="mimetypes"
      :max-file-size="maxFileSize"
      :max-files="10"
      :query="{}"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFiles } from '@/features/Files/composites'
import Uploader from '@/features/Files/components/Uploader.vue'

const { t } = useI18n()

const { mimetypes, maxFileSize } = useFiles(t)
</script>
