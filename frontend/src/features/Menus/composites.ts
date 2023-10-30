import { Static } from '@feathersjs/typebox'
import { getProp } from '@/features/Expression/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { menuSchema } from '@/shared/schemas/menu'

type Menu = Static<typeof menuSchema>

export const useMenus = () => ({
  setVariables: (menu: Menu, ctx: AnyData) => {
    (menu.variables || []).forEach((variable) => {
      ctx.variables.setRaw(`${menu._id}-${variable.name}`, getProp(variable.value, ctx))
    })
  },
})
