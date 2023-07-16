<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!--          <q-tabs align="left">-->
          <!--            <q-route-tab to="/test" label="Test" />-->
          <!--            <q-route-tab to="/page2" label="Page Two" />-->
          <!--            <q-route-tab to="/page3" label="Page Three" />-->
          <!--          </q-tabs>-->
        </q-toolbar-title>

        <!--        <q-btn-->
        <!--          v-if="false"-->
        <!--          icon="mdi-menu"-->
        <!--          aria-label="Menu"-->
        <!--          flat-->
        <!--          dense-->
        <!--          round-->
        <!--          @click="toggleRightDrawer"-->
        <!--        />-->
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-dark text-white"
      :model-value="true"
      :width="leftDrawerExpanded ? 250 : 50"
      side="left"
    >
      <q-list>
        <q-item-label
          class="Drawer__title row items-center"
          :class="{ leftDrawerExpanded }"
          header
        >
          <q-icon
            v-if="leftDrawerExpanded"
            name="mdi-chart-line-stacked"
            size="sm"
          />

          <span
            v-if="leftDrawerExpanded"
            class="text-h6 q-mx-sm"
          >
            PrimeStack
          </span>

          <span
            v-if="leftDrawerExpanded"
            class="text-italic text-grey text-caption q-mr-sm"
          >
            v{{ version }}
          </span>

          <q-btn
            class="Drawer__toggle self-end"
            :icon="leftDrawerExpanded ? 'mdi-arrow-collapse-left' : 'mdi-arrow-expand-right'"
            aria-label="Menu"
            flat
            dense
            round
            @click="toggleLeftDrawer"
          />

          <!--          <q-btn-->
          <!--            size="x-small"-->
          <!--            flat-->
          <!--            round-->
          <!--            @click="refreshHealth"-->
          <!--          >-->
          <!--            <q-icon name="mdi-refresh" />-->
          <!--          </q-btn>-->
        </q-item-label>

        <div v-if="menu">
          <q-item
            v-for="m in menu.list"
            :key="m._id"
            class="Drawer__item"
            :class="{ leftDrawerExpanded }"
            tag="router-link"
            to="/test"
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

        <q-item v-else>
          <q-item-section>
            <q-skeleton type="rect" />
          </q-item-section>
        </q-item>

        <q-item
          class="Drawer__item"
          :class="{ leftDrawerExpanded }"
          tag="router-link"
          to="/test"
          clickable
        >
          <q-item-section avatar>
            <q-icon name="mdi-cloud-braces" />
          </q-item-section>

          <q-item-section v-if="leftDrawerExpanded">
            <q-item-label>Test Section</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container style="padding-bottom: 0 !important;">
      <q-page class="q-ma-md">
        <snacks />

        <router-view />
      </q-page>
    </q-page-container>

    <q-footer class="bg-dark text-white">
      <q-toolbar />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useSnacks from '@/features/Snacks/composites'
import Snacks from '@/features/Snacks/components/Snacks.vue'
import { api } from '@/plugins/pinia'

const {
  pushError,
  pushWarn,
  pushInfo,
  pushSuccess,
} = useSnacks()

onMounted(() => {
  pushError('Error, this is an error')
  pushWarn('Warning, this is a warning')
  pushInfo('Info, this is an info')
  pushSuccess('Success, this is a success')
})

const version = import.meta.env.PACKAGE_VERSION

const leftDrawerExpanded = ref(true)

function toggleLeftDrawer() {
  leftDrawerExpanded.value = !leftDrawerExpanded.value
}

// function refreshHealth() {
//   api.service('health').get(0).then((result) => {
//     // eslint-disable-next-line no-console
//     console.log(result)
//   })
// }

const { data: menus, find } = api.service('menus').useFind({
  query: {},
})
find()

const menu = computed(() => menus.value?.[0])
</script>

<style scoped lang="sass">
.Drawer__item
  line-height: 24px
  border-radius: 0 24px 24px 0
  margin-right: 8px
  color: $blue-1

  &:not(.leftDrawerExpanded)
    padding-left: 4px

  .q-item__section--avatar
    width: 24px
    min-width: unset
    margin-right: 8px

.Drawer__title
  padding-right: 0
  padding-bottom: 8px

  &:not(.leftDrawerExpanded)
    padding-left: 4px
</style>
