<template>
  <div class="row">
    <div class="col">
      <!-- Share items -->

      <share-item
        v-for="(share, i) in shares"
        :key="getId(share)"
        v-model="shares[i]"
        :menu-id="menuId"
        :disable="disable"
        :show-separator="i < shares.length - 1"
        @save="saveShare(share)"
        @remove="removeShare(share)"
        @make-readonly="makeReadonly(share)"
        @make-editable="makeEditable(share)"
        @make-full="makeFull(share)"
        @resend-email="resendShare(share)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { ServiceInstance } from 'feathers-pinia/src/modeling'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useFeathersService } from '@/composites/feathers'
import { useAuth } from '@/features/Auth/store'
import { useSnacks } from '@/features/Snacks/store'
import { getId } from '@/composites/utilities'
import {
  ACCESS_LEVEL_EDIT,
  ACCESS_LEVEL_FULL,
  ACCESS_LEVEL_READONLY,
  schema as shareSchema,
} from '@/shared/schemas/share'
import ShareItem from '@/features/Shares/components/ShareItem.vue'

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

const snacks = useSnacks()

const { t } = useI18n()

const quasar = useQuasar()

const auth = useAuth()

const params = computed(() => ({
  query: {
    createdBy: auth.userId,
    menuId: props.menuId,
  },
  temps: true,
}))

const { data: shares, find } = useFeathersService('shares').useFind(params)

watch(() => auth.userId, () => {
  if (auth.userId) {
    find({
      query: {
        createdBy: auth.userId,
        $limit: -1,
        $skip: 0,
      },
    })
  }
}, { immediate: true })

const removeShare = (share: ServiceInstance<Share>) => {
  quasar.dialog({
    title: t('share.dialog.remove.title'),
    persistent: true,
    message: t('share.dialog.remove.message'),
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
  }).onOk(async () => {
    const r = share as ServiceInstance<Share>
    const id = r._id
    const tempId = r.__tempId
    await r.remove()
    if (tempId) {
      useFeathersService('shares').removeFromStore(tempId)
    }
    emit('remove', tempId || id)
  })
}

const saveShare = async (share: ServiceInstance<Share>) => {
  await share.save()
  emit('save', share)
}

const makeReadonly = async (share: ServiceInstance<Share>) => {
  // eslint-disable-next-line no-param-reassign
  share.accessLevel = ACCESS_LEVEL_READONLY
  await share.save()
  emit('make-readonly', share)
}

const makeEditable = async (share: ServiceInstance<Share>) => {
  // eslint-disable-next-line no-param-reassign
  share.accessLevel = ACCESS_LEVEL_EDIT
  await share.save()
  emit('make-editable', share)
}

const makeFull = async (share: ServiceInstance<Share>) => {
  // eslint-disable-next-line no-param-reassign
  share.accessLevel = ACCESS_LEVEL_FULL
  await share.save()
  emit('make-full', share)
}

const resendShare = async (share: ServiceInstance<Share>) => {
  // eslint-disable-next-line no-param-reassign
  share.emailResend = true
  await share.save()
  snacks.pushSuccess(t('share.email.sent'))
  emit('resend-email', share)
}
</script>
