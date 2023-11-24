<template>
  <q-btn
    icon="mdi-share-variant"
    aria-label="Share"
    size="sm"
    flat
    dense
    round
  >
    <q-tooltip :delay="500">
      {{ $t('app.share_menu.tooltip') }}
    </q-tooltip>

    <q-menu fit>
      <q-card style="width: 500px;">
        <q-card-section>
          <!-- Title -->

          <div class="row items-center q-gutter-sm">
            <div class="col">
              <div class="text-h6">
                {{ $t('share.title') }}
              </div>
            </div>

            <div class="col-auto">
              <q-btn
                :label="$t('share.add')"
                color="blue"
                class="q-px-md"
                dense
                outline
                no-caps
                @click="addShare"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list
            style="min-height: 72px; max-height: 300px; width: 100%; overflow-y: auto;"
            dense
          >
            <shares
              :menu-id="menuId"
              :disable="disable"
              @save="saveShare"
              @remove="removeShare"
              @resend-email="resendShare"
              @make-readonly="makeReadonly"
              @make-editable="makeEditable"
              @make-full="makeFull"
            />
          </q-list>
        </q-card-section>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { ServiceInstance } from 'feathers-pinia/src/modeling'
import { useFeathersService } from '@/composites/feathers'
import { useShare } from '@/features/Shares/composites'
import { useAuth } from '@/features/Auth/store'
import { schema as shareSchema } from '@/shared/schemas/share'
import Shares from '@/features/Shares/components/Shares.vue'

type Share = Static<typeof shareSchema>

const props = defineProps<{
  menuId: string
  disable?: boolean
}>()

const emit = defineEmits<{
  (e: 'add', value: ServiceInstance<Share>): void,
  (e: 'remove', id: string): void,
  (e: 'save', value: ServiceInstance<Share>): void,
  (e: 'resend-email', value: ServiceInstance<Share>): void,
  (e: 'make-readonly', value: ServiceInstance<Share>): void,
  (e: 'make-editable', value: ServiceInstance<Share>): void,
  (e: 'make-full', value: ServiceInstance<Share>): void,
}>()

const auth = useAuth()

const { extractInfo } = useShare()

const addShare = () => {
  const share = useFeathersService('shares').new({
    menuId: props.menuId,
    createdBy: auth.userId,
  })
  const info = extractInfo(share.menuId)
  Object.keys(info).forEach((k) => {
    // eslint-disable-next-line no-param-reassign
    share[k] = info[k]
  })
  share.createInStore()
  emit('add', share)
}

const removeShare = (id: string) => {
  emit('remove', id)
}

const saveShare = (share: ServiceInstance<Share>) => {
  emit('save', share)
}

const makeReadonly = (share: ServiceInstance<Share>) => {
  emit('make-readonly', share)
}

const makeEditable = (share: ServiceInstance<Share>) => {
  emit('make-editable', share)
}

const makeFull = (share: ServiceInstance<Share>) => {
  emit('make-full', share)
}

const resendShare = (share: ServiceInstance<Share>) => {
  emit('resend-email', share)
}
</script>
