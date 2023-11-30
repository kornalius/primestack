import i18next from 'i18next'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@/declarations'
import { formSchema } from '@/shared/schemas/form'
import { isComponentAvailable } from '@/shared/plan'
import { flattenFields } from '@/shared/form'
import { Static } from '@feathersjs/typebox'

type Form = Static<typeof formSchema>

/**
 * Checks is a form's component is a paid feature without rights to use it
 */
export const checkPaidComponents = () => async (context: HookContext) => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { user } = context.params
  const { _plan } = user

  context.data.list.forEach((form: Form) => {
    // eslint-disable-next-line no-underscore-dangle
    const fields = flattenFields(form._fields)

    fields.forEach((f) => {
      // eslint-disable-next-line no-underscore-dangle
      if (!isComponentAvailable(f._type, _plan.code)) {
        throw new Forbidden(i18next.t('paid_feature.component', {
          // eslint-disable-next-line no-underscore-dangle
          type: f._type,
          lng: user.locale || 'en',
        }))
      }
    })
  })

  return context
}
