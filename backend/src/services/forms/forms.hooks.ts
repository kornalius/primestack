import { Static } from '@feathersjs/typebox'
import i18next from 'i18next'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { checkPaidComponents } from '@/hooks/check-paid-components'
import { getSharedMenus } from '@/shared-utils'
import { schema } from '@/shared/schemas/form'

type FormList = Static<typeof schema>

/**
 * Checks if the user does not have more forms than allowed
 */
const checkMaxForms = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxForms
  if (m !== -1 && context.data?.list.length >= m) {
    throw new Forbidden(i18next.t('paid_feature.form', {
      formCount: m,
      count: m,
      lng: context.params?.user?.lng as string || 'en',
    }))
  }
  return context
}

/**
 * Populate list of forms with shared forms as well
 */
const populateSharedForms = () => async (context: HookContext): Promise<HookContext> => {
  const sharedMenus = await getSharedMenus(context)

  const sharedFormIds: string[] = []
  sharedMenus.forEach((m) => {
    m.tabs.forEach((t) => {
      sharedFormIds.push(t.formId.toString())
    })
  })

  if (sharedFormIds.length > 0) {
    const { data: sharedForms } = await context.app.service('forms').find({
      query: {
        formIds: { $in: sharedFormIds },
        $limit: -1,
        $skip: 0,
      }
    })

    if (context.result) {
      if (Array.isArray(context.result)) {
        (context.result as FormList[]).forEach((r) => {
          // eslint-disable-next-line no-param-reassign
          r.list = [...r.list, ...sharedForms]
        })
      } else {
        (context.result as FormList).list = [
          ...(context.result as FormList).list || [],
          ...sharedForms,
        ]
      }
    }
  }

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxForms(),
      checkPaidComponents(),
    ],
    update: [
      checkMaxForms(),
      checkPaidComponents(),
    ],
    patch: [
      checkMaxForms(),
      checkPaidComponents(),
    ],
  },
  after: {
    all: [
      populateSharedForms(),
    ],
  },
}
