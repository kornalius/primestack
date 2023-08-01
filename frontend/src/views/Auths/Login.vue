<template>
  <q-page class="bg-blue window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">
          PrimeStack
        </h5>
      </div>

      <div class="row">
        <q-card
          class="q-pa-lg shadow-1"
          bordered
          square
        >
          <q-form
            class="q-gutter-md"
            autofocus
            greedy
            @submit="login"
          >
            <q-card-section>
              <q-input
                v-model="email"
                label="email"
                type="email"
                autocomplete="email"
                :rules="[isRequired(t), isEmail(t)]"
                dense
                outlined
                clearable
              />

              <q-input
                v-model="password"
                label="password"
                type="password"
                autocomplete="password"
                :rules="[isRequired(t)]"
                dense
                outlined
                clearable
              />
            </q-card-section>

            <q-card-actions class="q-px-md">
              <q-btn
                class="full-width"
                label="Login"
                type="submit"
                color="primary"
                size="lg"
                unelevated
              />
            </q-card-actions>
          </q-form>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-8">
              Not registered?
              <router-link to="/signup">
                Create an account
              </router-link>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useAuth from '@/features/Auth/store'
import useValidator from '@/features/Validation/composites'

const { t } = useI18n()

const { required: isRequired, email: isEmail } = useValidator()

const auth = useAuth()

const route = useRoute()

const router = useRouter()

const email = ref()
const password = ref()

const login = () => {
  auth.authenticate('local', {
    email: email.value,
    password: password.value,
  })
}

watch(() => auth.authenticated, () => {
  if (auth.authenticated) {
    router
      .replace(route.query.redirect as string || '/')
      .catch(() => true)
  }
}, { immediate: true })
</script>
