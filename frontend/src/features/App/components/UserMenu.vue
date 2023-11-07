<template>
  <q-btn
    v-if="auth.authenticated"
    icon="mdi-account-circle"
    aria-label="Menu"
    flat
    dense
    round
  >
    <q-tooltip :delay="500">
      {{ $t('app.user_menu.tooltip') }}
    </q-tooltip>

    <q-menu max-width="400px" fit>
      <div class="row q-pa-md q-gutter-sm items-center">
        <div class="col-auto">
          <q-btn
            icon="mdi-magnify"
            color="grey-7"
            size="sm"
            flat
            round
            v-close-popup
          >
            <q-tooltip :delay="500">
              {{ $t('app.search.tooltip') }}
            </q-tooltip>
          </q-btn>
        </div>

        <div class="col-auto">
          <q-btn
            v-if="(auth.userRights as AnyData).maxes.maxEdits === -1"
            :color="editor.active ? 'red-7' : 'blue-4'"
            :disable="editor.active"
            icon="mdi-pencil-ruler"
            size="sm"
            flat
            round
            v-close-popup
            @click="editor.startEdit"
          >
            <q-tooltip :delay="500">
              {{ $t('app.editor_toggle.tooltip') }}
            </q-tooltip>
          </q-btn>
        </div>

        <div class="col-auto">
          <q-btn
            icon="mdi-bell-outline"
            color="orange-7"
            size="sm"
            flat
            round
          >
            <q-tooltip :delay="500">
              {{ $t('app.notifications.tooltip') }}
            </q-tooltip>
          </q-btn>
        </div>

        <div class="col-auto">
          <div>
            <component
              :is="languagesByCode[app.locale]"
              class="cursor-pointer"
              style="width: 24px; margin-top: 4px;"
            />

            <q-menu separate-close-popup>
              <q-list dense>
                <q-item
                  v-for="l in languages"
                  :key="l.code"
                  clickable
                  v-close-popup
                  @click="app.setLocale(l.code)"
                >
                  <q-item-section avatar>
                    <component :is="l.component" style="width: 24px;" />
                  </q-item-section>
                  <q-item-section>
                    {{ $t(`languages.${l.code}`) }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>

            <q-tooltip :delay="500">
              {{ $t('app.language.tooltip') }}
            </q-tooltip>
          </div>
        </div>

        <div class="col">
          <q-btn
            :label="$t('app.upgrade.title')"
            color="green-7"
            size="sm"
            no-caps
            no-wrap
            outline
            v-close-popup
          >
            <q-tooltip :delay="500">
              {{ $t('app.upgrade.tooltip') }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-separator />

      <div class="row q-pa-md q-gutter-sm items-center">
        <div class="col-auto">
          <q-skeleton type="QAvatar" size="50px" animation="none" />
        </div>
        <div class="col">
          <div class="row">
            <span class="text-bold">{{ auth.username }}</span>
          </div>
          <div class="row">
            <span>{{ (auth as AnyData).userEmail }}</span>
          </div>
        </div>
      </div>

      <q-separator />

      <q-list>
        <q-item
          clickable
          v-close-popup
          @click="profileClick"
        >
          <q-tooltip :delay="500">
            {{ $t('app.profile.tooltip') }}
          </q-tooltip>

          <q-item-section avatar>
            <q-icon name="mdi-account-edit" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t('app.profile.title') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item
          clickable
          v-close-popup
          @click="logout"
        >
          <q-tooltip :delay="500">
            {{ $t('app.logout.tooltip') }}
          </q-tooltip>

          <q-item-section avatar>
            <q-icon name="mdi-logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t('app.logout.title') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/Auth/store'
import { useAppEditor } from '@/features/Editor/store'
import { useApp } from '@/features/App/store'
import { AnyData } from '@/shared/interfaces/commons'
import FrenchFlag from '../flags/FR.svg?component'
import EnglishFlag from '../flags/US.svg?component'

const auth = useAuth()

const app = useApp()

const editor = useAppEditor()

const router = useRouter()

const languages = computed(() => ([
  {
    code: 'en',
    component: EnglishFlag,
  },
  {
    code: 'fr',
    component: FrenchFlag,
  },
]))

const languagesByCode = computed(() => (
  languages.value.reduce((acc, l) => ({ ...acc, [l.code]: l.component }), {})
))

/**
 * Go to the profile view
 */
const profileClick = () => {
  router.push('/profile')
}

/**
 * Go to the logout view
 */
const logout = () => {
  router.push('/logout')
}
</script>
