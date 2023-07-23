<template>
  <q-layout view="lHh LpR lFf">
    <q-header
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
              v-for="t in routeTabs"
              :key="t._id"
              :name="t._id"
              :label="t.label"
              :icon="t.icon"
              :content-class="`text-${t.color}`"
              :to="menuTabUrl(routeMenu._id, t._id)"
            />
          </q-tabs>
        </q-toolbar-title>

        <q-toggle
          v-model="currentEditmode"
          label="Edit"
          color="orange-4"
          left-label
          keep-color
        />
      </q-toolbar>
    </q-header>

    <q-drawer
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
            :class="{ leftDrawerExpanded, selected: $route.path === schemasUrl() }"
            :to="schemasUrl()"
            name="schemas"
            tag="router-link"
            clickable
          >
            <q-item-section avatar>
              <q-icon name="mdi-database-cog" />
            </q-item-section>

            <q-item-section v-if="leftDrawerExpanded">
              <q-item-label>
                Schemas
              </q-item-label>
            </q-item-section>
          </q-item>

          <menus-editor
            v-if="editor.active"
            v-model="userMenu.list"
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

    <app-properties :components="components" />

    <q-page-container style="padding-bottom: 0 !important;">
      <q-page class="q-ma-md">
        <snacks-display />

        <router-view />
      </q-page>
    </q-page-container>

    <q-footer class="bg-dark text-white">
      <q-toolbar />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue'
import { useRoute } from 'vue-router'
import useSnacks from '@/features/Snacks/composites'
import SnacksDisplay from '@/features/Snacks/components/Snacks.vue'
import useAppEditor from '@/features/App/store'
import useFormElements from '@/features/Forms/composites'
import TabsEditor from '@/features/Tabs/components/TabsEditor.vue'
import MenusEditor from '@/features/Menus/components/MenusEditor.vue'
import AppProperties from '@/features/App/components/AppProperties.vue'
import { useUrl } from '@/composites/url'
import { useFeathers } from '@/composites/feathers'

const { api } = useFeathers()

const snacks = useSnacks()

onMounted(() => {
  snacks.pushError('Error, this is an error')
  snacks.pushWarn('Warning, this is a warning')
  snacks.pushInfo('Info, this is an info')
  snacks.pushSuccess('Success, this is a success')
})

const version = import.meta.env.PACKAGE_VERSION

const leftDrawerExpanded = ref(true)

function toggleLeftDrawer() {
  leftDrawerExpanded.value = !leftDrawerExpanded.value
}

const editor = useAppEditor()

const currentEditmode = ref(false)

watch(currentEditmode, () => {
  if (currentEditmode.value) {
    editor.startEdit()
  } else {
    editor.endEdit()
  }
})

const { data: menus, find: findMenus } = api.service('menus').useFind({
  query: {},
})
findMenus()

const userMenu = computed(() => menus.value?.[0])

const selectedMenuObject = computed(() => (
  userMenu.value?.list.find((m) => m._id === editor.selectedMenu)
))

watch(() => editor.active, () => {
  if (editor.active) {
    leftDrawerExpanded.value = true
  }
  editor.unselectMenu()
})

const { components: comps } = useFormElements()

const components = ref(comps)

// function refreshHealth() {
//   api.service('health').get(0).then((result) => {
//     // eslint-disable-next-line no-console
//     console.log(result)
//   })
// }

const { find: findSchemas } = api.service('schemas').useFind({
  query: {},
})
findSchemas()

const { find: findForms } = api.service('forms').useFind({
  query: {},
})
findForms()

const route = useRoute()

const { menuUrl, menuTabUrl, schemasUrl } = useUrl()

const routeMenu = computed(() => (
  userMenu.value?.list.find((m) => m._id === route.params.menuId)
))

const routeTabs = computed(() => routeMenu.value?.tabs)
</script>
