<template>
  <q-page class="q-pa-sm">
    <q-tabs
      v-model="tab"
      align="left"
      stretch
      no-caps
      dense
    >
      <q-tab :label="$t('user_profile.tabTitle')" name="profile" />
      <q-tab :label="$t('user_profile.settings.tabTitle')" name="settings" />
    </q-tabs>

    <q-tab-panels
      :model-value="tab"
      animated
    >
      <q-tab-panel name="profile">
        <div
          v-if="user"
          class="row"
        >
          <div class="col">
            <q-card>
              <q-card-section>
                <div class="row">
                  <div class="col">
                    <div class="text-h5">
                      {{ $t('user_profile.title') }}
                    </div>
                    <div>
                      {{ $t('user_profile.sub_title') }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row q-gutter-sm items-center">
                  <div class="col-auto">
                    <q-skeleton type="QAvatar" size="100px" animation="none" />
                  </div>
                  <div class="col">
                    <q-btn color="primary" rounded unelevated>
                      {{ $t('user_profile.add_photo') }}
                    </q-btn>
                  </div>
                </div>

                <div class="row q-gutter-sm q-pt-md">
                  <div class="col">
                    <q-input v-model="user.username" :label="$t('user_profile.username')" />
                  </div>
                  <div class="col">
                    <q-input v-model="user.email" :label="$t('user_profile.email')" />
                  </div>
                </div>

                <div class="row q-gutter-sm">
                  <div class="col">
                    <q-input v-model="user.firstname" :label="$t('user_profile.firstname')" />
                  </div>
                  <div class="col">
                    <q-input v-model="user.lastname" :label="$t('user_profile.lastname')" />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn color="primary" unelevated @click="updateProfile">
                  {{ $t('user_profile.update') }}
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="row q-pt-md q-gutter-sm">
          <div class="col">
            <q-card>
              <q-card-section>
                <div class="row">
                  <div class="col">
                    <div class="text-h6">
                      {{ $t('user_profile.change_password') }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row q-gutter-sm items-center">
                  <div class="col">
                    {{ $t('user_profile.current_password') }}
                  </div>
                  <div class="col">
                    <q-input v-model="currentPassword" label="Current Passsword" />
                  </div>
                </div>

                <div class="row q-gutter-sm items-center">
                  <div class="col">
                    {{ $t('user_profile.new_password') }}
                  </div>
                  <div class="col">
                    <q-input v-model="newPassword" :label="$t('user_profile.new_password')" />
                  </div>
                </div>

                <div class="row q-gutter-sm items-center">
                  <div class="col">
                    {{ $t('user_profile.current_new_password') }}
                  </div>
                  <div class="col">
                    <q-input v-model="confirmPassword" :label="$t('user_profile.confirm_new_password')" />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn color="primary" unelevated>
                  {{ $t('user_profile.change_password') }}
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="settings">
        <div
          v-if="user"
          class="row"
        >
          <div class="col">
            <q-card>
              <q-card-section class="q-pb-none">
                <div class="row">
                  <div class="col">
                    <div class="text-h5">
                      {{ $t('user_profile.settings.title') }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <array-editor
                  v-model="settings"
                  :add-function="addSetting"
                  :remove-function="removeSetting"
                  clearable
                  no-separator
                  @clear="clearSettings"
                >
                  <template #default="{ value }">
                    <div class="row q-gutter-sm q-mb-xs items-center">
                      <div class="col-2">
                        <q-input
                          v-model="value.key"
                          input-class="text-weight-medium"
                          borderless
                          dense
                        />
                      </div>

                      <div class="col">
                        <q-input
                          v-model="value.value"
                          outlined
                          dense
                        />
                      </div>
                    </div>
                  </template>
                </array-editor>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn color="primary" unelevated @click="updateProfile">
                  {{ $t('user_profile.update') }}
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import isEqual from 'lodash/isEqual'
import { Static } from '@feathersjs/typebox'
import { ServiceType, useFeathersService } from '@/composites/feathers'
import { useAuth } from '@/features/Auth/store'
import { schema } from '@/shared/schemas/user'
import { newNameForSetting, normalizeName } from '@/shared/user'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'

type User = Static<typeof schema>

const auth = useAuth()

const user = useFeathersService('users').getFromStore(auth.userId) as ServiceType<User>

const currentPassword = ref()

const newPassword = ref()

const confirmPassword = ref()

const tab = ref('profile')

const updateProfile = () => {
  user.value.save()
}

const settings = ref([])

watch(user, () => {
  if (user.value) {
    watch(() => user.value.settings, () => {
      const n = Object.keys(user.value.settings)
        .map((k) => ({ key: k, value: user.value.settings[k] }))
      if (!isEqual(settings.value, n)) {
        settings.value = n
      }
    }, { immediate: true, deep: true })
  }
}, { immediate: true })

watch(settings, () => {
  const n = settings.value.reduce((acc, s) => ({ ...acc, [normalizeName(s.key)]: s.value }), {})
  if (!isEqual(user.value.settings, n)) {
    user.value.settings = n
  }
}, { deep: true })

const addSetting = () => {
  settings.value.push({ key: newNameForSetting(user.value.settings), value: '' })
}

const removeSetting = (value: unknown, index: number) => {
  settings.value.splice(index, 1)
}

const clearSettings = () => {
  settings.value = []
}
</script>
