import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { LRUCache } from 'lru-cache'
import { Static, TSchema } from '@feathersjs/typebox'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import expr2fn from 'expr2fn'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import { components, componentForType, componentForField } from '@/features/Components'
import useValidators from '@/features/Validation/composites'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { getTypeFor } from '@/shared/schema'
import { actionSchema } from '@/shared/schemas/actions'
import { useFeathers } from '@/composites/feathers'
import useActions from '@/features/Actions/composites'
import useSnacks from '@/features/Snacks/store'
import useVariables from '@/features/Variables/store'
// eslint-disable-next-line import/no-cycle
import useAppEditor from '@/features/App/store'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type Action = Static<typeof actionSchema>

const validators = useValidators()

const flattenFields = (fields: FormField[] | FormColumn[]): FormField[] => {
  const flattended = []

  const flatten = (list: FormField[] | FormColumn[]): void => {
    list.forEach((f: FormField | FormColumn) => {
      flattended.push(f)

      // eslint-disable-next-line no-underscore-dangle
      const cols = (f as FormField)._columns
      if (cols) {
        flatten(cols)
      }

      // eslint-disable-next-line no-underscore-dangle
      const flds = (f as FormColumn)._fields
      if (flds) {
        flatten(flds)
      }
    })
  }

  flatten(fields)

  return flattended
}

const isExpr = (v: string): boolean => typeof v === 'string' && v.startsWith('```') && v.endsWith('```')

const exprCode = (v: string): string => (isExpr(v) ? v.substring(3, v.length - 3) : undefined)

const exprToString = (v: string): string => (isExpr(v) ? v.substring(3, v.length - 3) : v)

const stringToExpr = (v: string): string => {
  const quotes = '```'
  return `${quotes}${exprToString(v)}${quotes}`
}

const options = {
  max: 500,
  ttl: 1000 * 60 * 5,
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
}

const cache = new LRUCache(options)

const runExpr = (v: string, ctx: AnyData): unknown => {
  let fn = cache.get(v) as (ctx: AnyData) => unknown
  if (!fn) {
    fn = expr2fn(v) as (ctx: AnyData) => unknown
    cache.set(v, fn)
  }
  return fn({
    doc: ctx.doc,
    var: (name: string): unknown => ctx.store.getVariable(name),
    route: (): string => ctx.route.path,
  })
}

const getProp = (field: TFormField | TFormColumn, propName: string, ctx: AnyData): unknown => {
  const v = field[propName] as string
  return isExpr(v) ? runExpr(exprCode(v), ctx) : v
}

export default () => ({
  componentForField,

  componentForType,

  components,

  newNameForField: (type: string, fields: AnyData[]): string => {
    let index = 1
    let newName = `${startCase(type)}${index}`
    let field = fields.find((f) => f.name === newName)
    while (field) {
      index += 1
      newName = `${startCase(type)}${index}`
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      field = fields.find((f) => f.name === newName)
    }
    return newName
  },

  flattenFields,

  fieldBinds: (field: TFormField | TFormColumn, schema: TSchema, ctx: AnyData): AnyData => {
    const fieldsToOmit = [
      '_id',
      '_type',
      '_fields',
      '_columns',
      'modelValue',
    ]

    const scanSchema = (s: TSchema): void => {
      Object.keys(s.properties).forEach((k) => {
        if (s.properties[k].style) {
          fieldsToOmit.push(k)
        }
      })
    }

    scanSchema(schema)

    const userActions = ctx.api.service('actions').findOneInStore({ query: {} })?.value.list

    const callEventAction = (id: string) => async () => {
      const act = userActions.find((a: Action) => a._id === id)
      if (act) {
        // eslint-disable-next-line no-underscore-dangle
        await ctx.exec(act._actions, ctx)
      }
    }

    return Object.keys(omit(field, fieldsToOmit))
      .reduce((acc, k) => {
        // if (ctx.editor.active) {
        //   return { ...acc, [k]: field[k] }
        // }
        // if it's an action, use onXxxx event key names instead
        if (schema.properties[k] && getTypeFor(schema.properties[k]) === 'action') {
          return { ...acc, [`on${startCase(k)}`]: callEventAction(field[k] as string) }
        }
        return { ...acc, [k]: getProp(field, k, ctx) }
      }, {})
  },

  schemaForType: (f: TFormField | TFormColumn): TSchema | undefined => (
    // eslint-disable-next-line no-underscore-dangle
    components.find((c) => c.type === f._type)?.schema
  ),

  // eslint-disable-next-line no-underscore-dangle
  isRow: (field: TFormField): boolean => field._type === 'row',

  // eslint-disable-next-line no-underscore-dangle
  isCard: (field: TFormField): boolean => field._type === 'card',

  // eslint-disable-next-line no-underscore-dangle
  isParagraph: (field: TFormField): boolean => field._type === 'paragraph',

  serializeRules: (t: T18N, field: TFormField): ((...args) => (val: string) => true | string)[] => (
    (field.rules as AnyData[])?.map((r) => validators[r.type](t, omit(r, ['type'])))
  ),

  isNumericInput: (field: TFormField): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const comp = components.find((c) => c.type === field._type)
    if (comp) {
      if (typeof comp.numericInput === 'function') {
        return comp.numericInput(field)
      }
      return comp.numericInput
    }
    return false
  },

  getProp,

  style: (field: AnyData): AnyData => {
    const component = components
      // eslint-disable-next-line no-underscore-dangle
      .find((c) => c.type === field._type)
    return {
      paddingTop: field.padding?.top,
      paddingLeft: field.padding?.left,
      paddingBottom: field.padding?.bottom,
      paddingRight: field.padding?.right,
      marginTop: field.margin?.top,
      marginLeft: field.margin?.left,
      marginBottom: field.margin?.bottom,
      marginRight: field.margin?.right,
      ...(component.editStyles || {}),
    }
  },

  isExpr,

  exprCode,

  stringToExpr,

  runExpr,

  buildCtx: (doc?: AnyData): AnyData => {
    const { t } = useI18n()
    const quasar = useQuasar()
    const { api } = useFeathers()
    const { exec } = useActions()
    const snacks = useSnacks()
    const store = useVariables()
    const route = useRoute()
    const router = useRouter()
    const editor = useAppEditor()

    return {
      quasar,
      snacks,
      api,
      editor,
      t,
      store,
      route,
      router,
      exec,
      doc,
    }
  },
})
