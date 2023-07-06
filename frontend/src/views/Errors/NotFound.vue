<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
    appear
  >
    <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">
          404
        </div>

        <div class="text-h2" style="opacity:.4">
          Oops. Nothing here...
        </div>

        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="blue"
          label="Go Home"
          to="/"
          unelevated
          no-caps
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
</script>
