import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@/declarations'
import { formSchema } from '@/shared/schemas/form'
import { isComponentAvailable } from '@/shared/plan'
import { flattenFields } from '@/shared/form'
import { Static } from '@feathersjs/typebox'

type Form = Static<typeof formSchema>

export const checkPaidComponents = async (context: HookContext) => {
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
        // eslint-disable-next-line no-underscore-dangle
        throw new Forbidden(`Component ${f._type} is a paid feature`)
      }
    })
  })

  return context
}
