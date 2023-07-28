<template>
  <div
    v-if="snacks.length"
    style="margin-top: -16px;"
  >
    <transition
      v-for="snack in snacks"
      :key="snack"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      appear
    >
      <q-banner :class="snackClass(snack)" inline-actions>
        {{ snack.message }}

        <template #action>
          <q-btn
            label="Dismiss"
            flat
            @click="removeSnack(snack.id)"
          />
        </template>
      </q-banner>
    </transition>
  </div>
</template>

<script setup lang="ts">
import useSnacks from '@/features/Snacks/store'

const {
  snacks,
  snackClass,
  removeSnack,
} = useSnacks()
</script>
