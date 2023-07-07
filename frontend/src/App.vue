<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          icon="mdi-menu"
          aria-label="Menu"
          flat
          dense
          round
          @click="toggleLeftDrawer"
        />

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
      :model-value="leftDrawerOpen"
      :width="250"
      side="left"
    >
      <q-list>
        <q-item-label class="row items-center" header>
          <q-icon name="mdi-chart-line-stacked" size="x-large" />

          <span class="text-h6 q-mx-sm">PrimeStack</span>

          <span class="text-italic text-grey text-caption">v{{ version }}</span>

          <!--          <q-btn-->
          <!--            size="x-small"-->
          <!--            flat-->
          <!--            round-->
          <!--            @click="refreshHealth"-->
          <!--          >-->
          <!--            <q-icon name="mdi-refresh" />-->
          <!--          </q-btn>-->
        </q-item-label>

        <q-item-label header>
          Links
        </q-item-label>

        <q-item
          class="Drawer__item"
          tag="router-link"
          to="/test"
          clickable
        >
          <q-item-section avatar>
            <q-icon name="mdi-cloud-braces" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Title</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <snacks />

      <q-page class="q-ma-md">
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer class="bg-dark text-white">
      <q-toolbar />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useSnacks from '@/features/Snacks/composites'
import Snacks from '@/features/Snacks/components/Snacks.vue'
// import { useFeathers } from '@/composites/feathers'

// const { api } = useFeathers()

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

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// function refreshHealth() {
//   api.service('health').get(0).then((result) => {
//     // eslint-disable-next-line no-console
//     console.log(result)
//   })
// }
</script>

<style lang="sass">
.Drawer__item
  line-height: 24px
  border-radius: 0 24px 24px 0
  margin-right: 12px

  .q-item__section--avatar
    padding-left: 12px
</style>
