<template>
  <q-item class="q-px-none" style="height: 70px;">
    <div class="row full-width">
      <div class="col">
        <!-- Edit email -->

        <q-input
          v-if="value.__isTemp"
          v-model="value.email"
          :label="$t('share.emailInput')"
          :rules="[isRequired(t), isEmail(t)]"
          dense
          outlined
        />

        <!-- Display email -->

        <div v-else>
          <div class="row items-center q-gutter-xs">
            <div class="col-auto q-mr-sm">
              <avatar :email="value.email" />
            </div>

            <div class="col">
              <div
                v-if="dayjs(value.emailSent).isValid()"
                class="row items-center"
              >
                <div class="col">
                  <span class="text-body1 text-weight-medium">
                    {{ value.email }}
                  </span>
                </div>
              </div>

              <!-- Email sent information -->

              <div
                v-if="dayjs(value.emailSent).isValid()"
                class="row items-center q-gutter-xs"
              >
                <div class="col-auto">
                  <span class="text-caption">
                    {{ $t('share.emailSent') }}:
                  </span>
                  <span class="text-caption">
                    {{ dayjs(value.emailSent).format('llll') }}
                  </span>
                </div>

                <!-- Resend email -->

                <div class="col-auto q-ml-sm">
                  <q-btn
                    v-if="!value.emailClicked"
                    class="q-px-sm"
                    :label="$t('share.resend')"
                    icon="mdi-email"
                    color="blue-5"
                    size="sm"
                    dense
                    outline
                    no-caps
                    @click="resendShare"
                  />
                </div>
              </div>

              <!-- Share accepted information -->

              <div
                v-if="dayjs(value.emailClicked).isValid()"
                class="row items-center q-gutter-xs"
              >
                <div class="col-auto">
                  <span class="text-caption q-mr-xs">
                    {{ $t('share.shareAccepted') }}:
                  </span>
                  <span class="text-caption">
                    {{ dayjs(value.emailClicked).format('lll') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save / Cancel buttons -->

      <div
        v-if="value.__isTemp"
        class="col-auto q-mt-xs q-ml-sm"
      >
        <div class="row items-center">
          <div class="col-auto">
            <q-btn
              :disable="disable"
              icon="mdi-check"
              color="green-6"
              size="sm"
              round
              flat
              @click.stop="saveShare"
            >
              <q-tooltip :delay="500">
                {{ $t('buttons.save') }}
              </q-tooltip>
            </q-btn>
          </div>

          <div class="col-auto">
            <q-btn
              :disable="disable"
              icon="mdi-close"
              color="red-6"
              size="sm"
              round
              flat
              @click.stop="cancelShare"
            >
              <q-tooltip :delay="500">
                {{ $t('buttons.cancel') }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Access level + Remove dropdown menu -->

      <div
        v-else
        class="col-auto"
      >
        <q-btn
          :icon="levelIcon(value.accessLevel)"
          color="grey-8"
          flat
          dense
          round
        >
          <q-tooltip :delay="500">
            {{ $t(`share.accessLevels.${value.accessLevel}`) }}
          </q-tooltip>

          <q-menu fit separate-close-popup>
            <q-list dense>
              <!-- Make readonly -->

              <q-item
                clickable
                v-ripple
                v-close-popup
                @click="makeReadonly"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="levelIcon(ACCESS_LEVEL_READONLY)"
                    color="grey-8"
                    size="xs"
                  />
                </q-item-section>
                <q-item-section>
                  {{ $t(`share.accessLevels.${ACCESS_LEVEL_READONLY}`) }}
                </q-item-section>
              </q-item>

              <!-- Make editable -->

              <q-item
                clickable
                v-ripple
                v-close-popup
                @click="makeEditable"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="levelIcon(ACCESS_LEVEL_EDIT)"
                    color="grey-8"
                    size="xs"
                  />
                </q-item-section>
                <q-item-section>
                  {{ $t(`share.accessLevels.${ACCESS_LEVEL_EDIT}`) }}
                </q-item-section>
              </q-item>

              <!-- Make full access -->

              <q-item
                clickable
                v-ripple
                v-close-popup
                @click="makeFull"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="levelIcon(ACCESS_LEVEL_FULL)"
                    color="grey-8"
                    size="xs"
                  />
                </q-item-section>
                <q-item-section>
                  {{ $t(`share.accessLevels.${ACCESS_LEVEL_FULL}`) }}
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- Remove share -->

              <q-item
                clickable
                v-ripple
                v-close-popup
                @click="removeShare"
              >
                <q-item-section avatar>
                  <q-icon
                    name="mdi-trash-can"
                    color="grey-8"
                    size="xs"
                  />
                </q-item-section>
                <q-item-section>
                  {{ $t('share.remove') }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-item>

  <q-separator v-if="showSeparator" />
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { Static } from '@feathersjs/typebox'
import { ServiceInstance } from 'feathers-pinia/src/modeling'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useValidators } from '@/features/Validation/composites'
import { getId } from '@/composites/utilities'
import {
  ACCESS_LEVEL_EDIT,
  ACCESS_LEVEL_FULL,
  ACCESS_LEVEL_READONLY,
  schema as shareSchema,
} from '@/shared/schemas/share'
import Avatar from '@/features/Users/components/Avatar.vue'

dayjs.extend(LocalizedFormat)

type Share = Static<typeof shareSchema>

const props = defineProps<{
  modelValue: ServiceInstance<Share>
  menuId: string
  disable?: boolean
  showSeparator?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: ServiceInstance<Share>): void,
  (e: 'add', value: ServiceInstance<Share>): void,
  (e: 'remove', id: string): void,
  (e: 'save', value: ServiceInstance<Share>): void,
  (e: 'make-readonly', value: ServiceInstance<Share>): void,
  (e: 'make-editable', value: ServiceInstance<Share>): void,
  (e: 'make-full', value: ServiceInstance<Share>): void,
  (e: 'resend-email', value: ServiceInstance<Share>): void,
}>()

const { t } = useI18n()

const { required: isRequired, email: isEmail } = useValidators()

const value = useModelValue(props, emit) as Ref<ServiceInstance<Share>>

const removeShare = () => {
  emit('remove', getId(props.modelValue))
}

const saveShare = () => {
  emit('save', props.modelValue)
}

const cancelShare = () => {
  removeShare()
}

const levelIcon = (accessLevel: number) => {
  switch (accessLevel) {
    case ACCESS_LEVEL_READONLY: return 'mdi-eye-outline'
    case ACCESS_LEVEL_EDIT: return 'mdi-pencil'
    case ACCESS_LEVEL_FULL: return 'mdi-pencil-ruler'
    default: return 'mdi-help'
  }
}

const makeReadonly = () => {
  emit('make-readonly', props.modelValue)
}

const makeEditable = () => {
  emit('make-editable', props.modelValue)
}

const makeFull = () => {
  emit('make-full', props.modelValue)
}

const resendShare = () => {
  emit('resend-email', props.modelValue)
}
</script>
