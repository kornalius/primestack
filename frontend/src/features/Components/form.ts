import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, modelIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import FormEmbedded from '@/features/Forms/components/FormEmbedded.vue'
import { keyboardEvent } from '@/shared/action'
import { properties } from './common'

export default {
  type: 'form-embedded',
  icon: 'mdi-window-maximize',
  label: 'components.form.label',
  component: FormEmbedded,
  numericInput: true,
  schema: properties([
    Type.Object({
      data: ExType.JSON(),
      formId: ExType.Id({ service: 'forms' }),
      mounted: ExType.Action(),
      updated: ExType.Action(),
      unmounted: ExType.Action(),
      keydown: ExType.Action(),
      keyup: ExType.Action(),
    }),
  ]),
  modelValueField: 'data',
  defaultValues: {
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'formId',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'name',
        'data',
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'mounted',
        'updated',
        'unmounted',
        'keydown',
        'keyup',
      ],
    },
  },
  eventArgs: {
    mounted: () => ({}),
    updated: () => ({}),
    unmounted: () => ({}),
    keydown: keyboardEvent,
    keyup: keyboardEvent,
  },
} as TFormComponent
