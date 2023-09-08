<template>
  <q-layout view="lHh LpR lff">
    <q-header
      v-if="!hideUI"
      class="bg-dark text-white"
      :style="{ backgroundColor: editor.active ? '#401a00 !important' : '' }"
    >
      <q-toolbar>
        <q-toolbar-title>
          <tabs-editor
            v-if="editor.active && selectedMenuObject"
            v-model="selectedMenuObject.tabs"
            :menu="selectedMenuObject"
          />

          <q-tabs
            v-else
            align="left"
            inline-label
            dense
          >
            <q-route-tab
              v-for="r in routeTabs"
              :key="r._id"
              :name="r._id"
              :label="r.label"
              :icon="r.icon"
              :content-class="`text-${r.color}`"
              :to="menuUrl(routeMenu._id, r._id)"
            />
          </q-tabs>
        </q-toolbar-title>

        <q-btn
          v-if="editor.active"
          :disable="!editor.canSave"
          icon="mdi-check"
          label="Save"
          color="green-4"
          size="sm"
          outline
          no-caps
          @click="save"
        />

        <q-btn
          v-if="editor.active"
          class="q-ml-sm"
          icon="mdi-check"
          label="Cancel"
          color="red-3"
          size="sm"
          outline
          no-caps
          @click="cancel"
        />

        <q-btn
          v-if="auth.authenticated"
          icon="mdi-account-circle"
          aria-label="Menu"
          flat
          dense
          round
        >
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
                />
              </div>

              <div class="col-auto">
                <q-btn
                  :color="editor.active ? 'red-7' : 'grey-7'"
                  :disable="editor.active"
                  icon="mdi-pencil-ruler"
                  size="sm"
                  flat
                  round
                  v-close-popup
                  @click="editor.startEdit"
                >
                  <q-tooltip :delay="500">
                    Toggle editor
                  </q-tooltip>
                </q-btn>
              </div>

              <div class="col-auto">
                <q-btn
                  icon="mdi-bell-outline"
                  color="grey-7"
                  size="sm"
                  flat
                  round
                  v-close-popup
                />
              </div>

              <div class="col">
                <q-btn
                  color="green-7"
                  size="sm"
                  label="Upgrade"
                  no-caps
                  outline
                  v-close-popup
                />
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
                  <span>{{ auth.userEmail }}</span>
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
                <q-item-section avatar>
                  <q-icon name="mdi-account-edit" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    User Profile
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="logout"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Logout
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!hideUI"
      class="bg-dark text-white"
      :model-value="true"
      :width="leftDrawerExpanded ? 250 : 50"
      side="left"
    >
      <q-list>
        <q-item
          class="Drawer__item q-pr-none"
          :class="{ leftDrawerExpanded }"
        >
          <q-item-section
            v-if="leftDrawerExpanded"
            avatar
          >
            <q-icon
              name="mdi-chart-line-stacked"
              size="sm"
            />
          </q-item-section>

          <q-item-label
            class="Drawer__title row items-center q-gutter-sm"
            :class="{ leftDrawerExpanded }"
            header
          >
            <div
              v-if="leftDrawerExpanded"
              class="col-auto"
            >
              <span class="text-h6">
                PrimeStack
              </span>
            </div>

            <div
              v-if="leftDrawerExpanded"
              class="col"
            >
              <span class="text-italic text-grey text-caption">
                v{{ version }}
              </span>
            </div>

            <div
              v-if="!editor.active"
              class="col-auto"
            >
              <q-btn
                class="Drawer__toggle"
                :icon="leftDrawerExpanded ? 'mdi-arrow-collapse-left' : 'mdi-arrow-expand-right'"
                aria-label="Menu"
                size="sm"
                flat
                dense
                round
                @click="toggleLeftDrawer"
              />
            </div>
          </q-item-label>
        </q-item>

        <div v-if="userMenu">
          <q-item
            v-if="editor.active"
            class="Drawer__item"
            :class="{ leftDrawerExpanded, selected: $route.path === tableUrl() }"
            :to="tableUrl()"
            name="schemas"
            tag="router-link"
            clickable
          >
            <q-item-section avatar>
              <q-icon name="mdi-database-cog" />
            </q-item-section>

            <q-item-section v-if="leftDrawerExpanded">
              <q-item-label>
                Tables
              </q-item-label>
            </q-item-section>
          </q-item>

          <menus-editor
            v-if="editor.active"
            v-model="editor.menus"
          />

          <div v-else>
            <q-item
              v-for="m in userMenu.list"
              :key="m._id"
              class="Drawer__item"
              :class="{ leftDrawerExpanded }"
              :name="m._id"
              tag="router-link"
              :to="m.href || menuUrl(m._id)"
              :target="m.target"
              clickable
            >
              <q-item-section avatar>
                <q-icon :name="m.icon" :color="m.color" />
              </q-item-section>

              <q-item-section v-if="leftDrawerExpanded">
                <q-item-label :class="{ [`text-${m.color}`]: true }">
                  {{ m.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <div v-else>
          <q-item v-for="i in 5" :key="i">
            <q-item-section>
              <q-skeleton type="rect" />
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <app-properties
      v-if="!hideUI"
      :components="components"
      :actions="actions"
    />

    <q-page-container>
      <snacks-display class="q-pt-md" />

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
// import { useSnacks } from '@/features/Snacks/store'
import SnacksDisplay from '@/features/Snacks/components/Snacks.vue'
import { useAppEditor } from '@/features/App/editor-store'
import { useAuth } from '@/features/Auth/store'
import { useFormElements } from '@/features/Forms/composites'
import { useActions } from '@/features/Actions/composites'
import TabsEditor from '@/features/Tabs/components/TabsEditor.vue'
import MenusEditor from '@/features/Menus/components/MenusEditor.vue'
import AppProperties from '@/features/App/components/AppProperties.vue'
import { useUrl } from '@/composites/url'
import { useFeathers } from '@/composites/feathers'
import { useI18n } from 'vue-i18n'

const quasar = useQuasar()

const { api } = useFeathers()

const { t } = useI18n()

// const snacks = useSnacks()

// onMounted(() => {
//   snacks.pushError('Error, this is an error')
//   snacks.pushWarn('Warning, this is a warning')
//   snacks.pushInfo('Info, this is an info')
//   snacks.pushSuccess('Success, this is a success')
// })

const version = import.meta.env.PACKAGE_VERSION

const leftDrawerExpanded = ref(true)

const editor = useAppEditor()

const route = useRoute()

const router = useRouter()

/**
 * End editor editing, if the current route needs the editor to be active, exit out of it
 */
const endEdit = () => {
  editor.endEdit()

  const isEditorRequired = route.matched.some((r) => r.meta.editor)

  if (isEditorRequired) {
    router.push('/')
  }
}

const userMenu = ref()

/**
 * Selected menu instance
 */
const selectedMenuObject = computed(() => editor.menuInstance(editor.selectedMenu))

/**
 * Toggle left drawer expanded or collapsed states
 */
function toggleLeftDrawer() {
  leftDrawerExpanded.value = !leftDrawerExpanded.value
}

/**
 * When editor becomes active, expand the drawer and unselect all menus
 */
watch(() => editor.active, () => {
  if (editor.active) {
    leftDrawerExpanded.value = true
  }
  editor.unselectMenu()
})

const { actions } = useActions()

const { components: comps } = useFormElements()

const components = ref(comps)

// function refreshHealth() {
//   api.service('health').get(0).then((result) => {
//     // eslint-disable-next-line no-console
//     console.log(result)
//   })
// }

const { menuUrl, tableUrl } = useUrl()

/**
 * Returns the current route menu instance when editor is not active
 */
const routeMenu = computed(() => (
  userMenu.value?.list.find((m) => m._id === route.params.menuId)
))

/**
 * Returns the tabs instances when editor is not active
 */
const routeTabs = computed(() => routeMenu.value?.tabs)

/**
 * Auth
 */

const auth = useAuth()

/**
 * Load user's editor data
 */
const loadUserData = async () => {
  api.service('users').get(auth.userId)
  userMenu.value = (await api.service('menus').find({ query: {} })).data?.[0]
  api.service('tables').find({ query: {} })
  api.service('forms').find({ query: {} })
  api.service('actions').find({ query: {} })
}

/**
 * When mounted, tries to re-authenticate and reload user's data
 */
onMounted(() => {
  auth.reAuthenticate()
  if (auth.authenticated) {
    loadUserData()
  }
})

/**
 * When authenticated, load all user's data, else go to the login view
 */
watch(() => auth.authenticated, () => {
  if (auth.authenticated) {
    loadUserData()
  } else {
    router.push('/login')
  }
})

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

/**
 * Hide the UI (drawer, topbar etc...) when not authenticated or in the logout route
 */
const hideUI = computed(() => (
  !auth.authenticated || route.name === 'Logout'
))

/**
 * Editor save and end
 */
const save = async () => {
  try {
    await editor.save()
  } finally {
    endEdit()
  }
}

/**
 * If changes are detected, ask to save or cancel first
 */
const cancel = () => {
  if (editor.isModified) {
    quasar.dialog({
      title: t('form.dialog.unsaved.title'),
      persistent: true,
      message: t('form.dialog.unsaved.message'),
      ok: {
        label: t('dialog.ok'),
        color: 'green',
        outline: true,
      },
      cancel: {
        label: t('dialog.cancel'),
        color: 'negative',
        outline: true,
      },
    }).onOk(() => {
      endEdit()
    })
  } else {
    endEdit()
  }
}
</script>
