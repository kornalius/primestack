<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <div class="col">
        <schema-table
          v-model:selected="selectedShare"
          style="height: calc(100vh - 72px)"
          :schema="shareSchema"
          :pagination="{}"
          :columns="columns"
          table-id="shares"
          title="Shares"
          add-button="start"
          selection-style="single"
          row-key="_id"
          remove-button
          temps
          editable
          virtual-scroll
          bordered
          dense
          flat
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useFeathersService } from '@/composites/feathers'
import { menuSchema } from '@/shared/schemas/menu'
import { schema as shareSchema } from '@/shared/schemas/share'
import { ExTableColumn } from '@/features/Fields/interfaces'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'

type Menu = Static<typeof menuSchema>

const selectedShare = ref()

const userMenu = useFeathersService('menus')
  .findOneInStore({ query: {} })

const menu = (id: string): Menu => (
  userMenu.value?.list.find((m) => m._id === id)
)

const columns = computed(() => ([
  {
    name: 'user',
    label: 'User',
    required: true,
    align: 'left',
    field: 'userId',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Email',
    required: true,
    align: 'left',
    field: 'email',
    sortable: true,
  },
  {
    name: 'menu',
    label: 'Menu',
    required: true,
    align: 'left',
    field: 'menuId',
    sortable: true,
    format: (val: string) => menu(val)?.label,
  },
  {
    name: 'disabled',
    label: 'Disabled',
    align: 'center',
    field: 'disabled',
    sortable: true,
    format: (val) => (val ? '\u2714' : ''),
  },
  {
    name: 'validFrom',
    label: 'Valid from',
    align: 'left',
    field: 'validFrom',
    sortable: true,
  },
  {
    name: 'validUntil',
    label: 'Valid until',
    align: 'left',
    field: 'validUntil',
    sortable: true,
  },
  {
    name: 'rules',
    label: '# Rules',
    align: 'left',
    field: 'rules',
    sortable: true,
    format: (val, row) => (!row ? val : val?.length),
  },
]) as ExTableColumn[])
</script>
