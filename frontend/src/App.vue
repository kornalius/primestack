<template>
  <q-layout view="lHh LpR lFr">
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
            :tab="app.tabId"
          />

          <q-tabs
            v-else-if="!editor.active"
            align="left"
            inline-label
            dense
          >
            <q-route-tab
              v-for="r in routeTabs"
              :key="r._id"
              v-bind="fieldBinds(r, tabSchema, ctx, ['click'])"
              :name="r._id"
              :content-class="`text-${r.color}`"
              :to="menuUrl(routeMenu._id, r._id)"
            >
              <q-tooltip
                v-if="r.description"
                :delay="500"
              >
                {{ r.description }}
              </q-tooltip>

              <q-icon
                v-if="r.icon"
                class="q-mr-sm"
                :name="r.icon"
                size="sm"
              />

              <span class="text-subtitle2">
                {{ r.label }}
              </span>

              <q-badge
                v-if="r.badgeTableId"
                style="right: -28px;"
                color="red-9"
                floating
                rounded
              >
                {{ badgeValues[(r as AnyData)._id]?.value }}
              </q-badge>
            </q-route-tab>
          </q-tabs>
        </q-toolbar-title>

        <q-btn
          v-if="editor.active"
          :disable="!editor.canSave"
          icon="mdi-check"
          :label="$t('editor.save.title')"
          color="green-4"
          size="sm"
          outline
          no-caps
          @click="save"
        >
          <q-tooltip :delay="500">
            {{ $t('editor.save.tooltip') }}
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="editor.active"
          class="q-mx-sm"
          icon="mdi-check"
          :label="$t('editor.cancel.title')"
          color="red-3"
          size="sm"
          outline
          no-caps
          @click="cancel"
        >
          <q-tooltip :delay="500">
            {{ $t('editor.cancel.tooltip') }}
          </q-tooltip>
        </q-btn>

        <div class="row items-center q-gutter-sm">
          <div
            v-if="app.menuId && auth.authenticated && !sharedMenu[app.menuId]"
            class="col-auto"
          >
            <share-menu
              :menu-id="app.menuId"
            />
          </div>

          <div class="col-auto">
            <user-menu />
          </div>
        </div>
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

        <div>
          <q-item
            v-if="editor.active"
            class="Drawer__item"
            :class="{ leftDrawerExpanded }"
            :to="formUrl()"
            :active="$route.path.startsWith(formUrl())"
            name="forms"
            tag="router-link"
            clickable
          >
            <q-tooltip :delay="500" anchor="bottom left">
              {{ $t('editor.forms.tooltip') }}
            </q-tooltip>

            <q-item-section avatar>
              <q-icon name="mdi-format-line-style" />
            </q-item-section>

            <q-item-section v-if="leftDrawerExpanded">
              <q-item-label>
                {{ $t('editor.forms.title') }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="editor.active"
            class="Drawer__item"
            :class="{ leftDrawerExpanded }"
            :to="tableUrl()"
            :active="$route.path.startsWith(tableUrl())"
            name="schemas"
            tag="router-link"
            clickable
          >
            <q-tooltip :delay="500" anchor="bottom left">
              {{ $t('editor.tables.tooltip') }}
            </q-tooltip>

            <q-item-section avatar>
              <q-icon name="mdi-database-cog" />
            </q-item-section>

            <q-item-section v-if="leftDrawerExpanded">
              <q-item-label>
                {{ $t('editor.tables.title') }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <menus-editor
            v-if="editor.active"
            v-model="editor.menus"
          />

          <div v-else-if="userDataLoaded">
            <q-item
              v-for="m in userMenu?.list || []"
              :key="m._id"
              v-bind="fieldBinds(m, menuSchema, ctx, ['click'])"
              class="Drawer__item"
              :class="{ leftDrawerExpanded }"
              :name="m._id"
              :to="m.href || menuUrl(m._id)"
              :active="$route.path.startsWith(menuUrl(m._id))"
              :target="m.target"
              tag="router-link"
              clickable
            >
              <q-tooltip
                v-if="m.description"
                :delay="500"
                anchor="bottom left"
              >
                {{ m.description }}
              </q-tooltip>

              <q-item-section avatar>
                <q-icon :name="m.icon" :color="m.color" />
              </q-item-section>

              <q-item-section v-if="leftDrawerExpanded">
                <q-item-label :class="{ [`text-${m.color}`]: true }">
                  {{ m.label }}
                </q-item-label>
              </q-item-section>

              <q-icon
                v-if="sharedMenu[m._id]"
                class="share-icon-shadow"
                color="black"
                name="mdi-share"
                size="xs"
              />

              <q-icon
                v-if="sharedMenu[m._id]"
                class="share-icon"
                color="green-4"
                name="mdi-share"
                size="xs"
              />
            </q-item>
          </div>

          <div v-else>
            <q-item v-for="i in 5" :key="i">
              <q-item-section>
                <q-skeleton type="rect" />
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <app-properties v-if="!hideUI && !editor.preview" />

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
import { Static } from '@feathersjs/typebox'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApp } from '@/features/App/store'
import { useAppEditor } from '@/features/Editor/store'
import { useAuth } from '@/features/Auth/store'
import { useUrl } from '@/composites/url'
import { useFeathersService } from '@/composites/feathers'
import { useExpression } from '@/features/Expression/composites'
import { useStats } from '@/features/Stats/store'
import { useFormElements } from '@/features/Forms/composites'
import { useMenus } from '@/features/Menus/composites'
import { useShareStore } from '@/features/Shares/store'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { tableSchema } from '@/shared/schemas/table'
import { queryToMongo } from '@/features/Query/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { Query } from '@/shared/interfaces/query'
import SnacksDisplay from '@/features/Snacks/components/Snacks.vue'
import TabsEditor from '@/features/Tabs/components/TabsEditor.vue'
import MenusEditor from '@/features/Menus/components/MenusEditor.vue'
import AppProperties from '@/features/App/components/AppProperties.vue'
import UserMenu from '@/features/Users/components/UserMenu.vue'
import ShareMenu from '@/features/Shares/components/ShareMenu.vue'

type Tab = Static<typeof tabSchema>
type Table = Static<typeof tableSchema>
type Menu = Static<typeof menuSchema>

const quasar = useQuasar()

const { t } = useI18n()

const version = import.meta.env.PACKAGE_VERSION

const leftDrawerExpanded = ref(true)

const app = useApp()

const editor = useAppEditor()

const { setVariables } = useMenus()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const route = useRoute()

const router = useRouter()

const { fieldBinds } = useFormElements()

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

const userDataLoaded = ref(false)

/**
 * Selected menu instance
 */
const selectedMenuObject = computed(() => (
  editor.menuInstance(editor.menuId)
))

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
})

const { menuUrl, tableUrl, formUrl } = useUrl()

/**
 * Returns the current route menu instance when editor is not active
 */
const routeMenu = computed(() => (
  userMenu.value?.list.find((m: Menu) => m._id === route.params.menuId)
))

/**
 * Returns the tabs instances when editor is not active
 */
const routeTabs = computed(() => routeMenu.value?.tabs)

/**
 * Auth
 */

const auth = useAuth()

const share = useShareStore()

/**
 * Load user's editor data
 */
const loadUserData = async () => {
  await useFeathersService('users').get(auth.userId)
  userMenu.value = (await useFeathersService('menus')
    .find({ query: {} })).data?.[0]
  await useFeathersService('tables').find({ query: {} })
  await useFeathersService('forms').find({ query: {} })
  await useFeathersService('actions').find({ query: {} })
  await useFeathersService('blueprints').find({ query: {} })

  userDataLoaded.value = true

  if (share.shareId) {
    const shareDoc = await useFeathersService('shares').get(share.shareId)
    if (shareDoc.createdBy !== auth.userId) {
      await share.assignUserToShare(share.shareId, share.linkClicked, auth.userId)
    }
    share.setShareId(undefined)
    share.setLinkClicked(undefined)
  }

  if (auth.user.locale) {
    await app.setLocale(auth.user.locale, false)
  }
}

const sharedMenu = ref({})

watch([() => userMenu.value?.list, () => auth.userId], () => {
  (userMenu.value?.list || []).forEach(async (m: Menu) => {
    setVariables(m, ctx)
    sharedMenu.value[m._id] = await share.isMenuShared(m._id, auth.userId)
  })
}, { deep: true })

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
 * Hide the UI (drawer, topbar etc...) when not authenticated or in the logout route
 */
const hideUI = computed(() => (
  !auth.authenticated || route.name === 'Logout'
))

/**
 * Editor save and end
 */
const save = async () => {
  await editor.save()
  endEdit()
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

/**
 * Tab badges
 */

const stats = useStats()

const badgeValues = ref({})

watch(routeTabs, () => {
  routeTabs.value?.forEach((r: Tab) => {
    const {
      badgeField, badgeFilter, badgeStat, badgeTableId, badgeGroupFields,
    } = r as Tab

    if (badgeTableId) {
      const userTable = useFeathersService('tables')
        .findOneInStore({ query: {} })
      const table = userTable.value?.list.find((tt: Table) => tt._id === badgeTableId)

      if (table) {
        const q = badgeFilter ? queryToMongo(badgeFilter as Query, table, ctx.$expr) : {}

        badgeValues.value[r._id] = stats.newStat({
          tableId: badgeTableId,
          query: q,
          type: badgeStat as string,
          field: badgeField,
          groupFields: badgeGroupFields,
        })
      }
    }
  })
}, { immediate: true })

/**
 * Document Title
 */

const title = computed(() => {
  const menuTitle = app.menuInstance?.label
  const tabTitle = app.tabInstance?.label
  const edit = editor.active ? '* ' : ''
  return `${edit}${menuTitle && tabTitle ? `[${menuTitle}:${tabTitle}] - ` : ''}PrimeStack`
})

watch(title, () => {
  document.title = title.value
}, { immediate: true })
</script>

<style scoped lang="sass">
.share-icon
  position: absolute
  bottom: 5px
  left: 10px
.share-icon-shadow
  position: absolute
  bottom: 5px
  left: 10px
  transform: scale(1.3)
</style>
