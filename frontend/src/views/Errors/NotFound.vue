<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{ $t('404.title') }}
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ $t('404.message') }}
      </div>

      <q-btn
        class="q-mt-xl"
        :label="$t('404.go_home')"
        color="white"
        text-color="blue"
        to="/"
        unelevated
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
