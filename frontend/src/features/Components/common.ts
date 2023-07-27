import { TObject, Type } from '@feathersjs/typebox'

export const sizeString = Type.String({
  options: [
    { value: 'xs', icon: 'mdi-size-xs' },
    { value: 'sm', icon: 'mdi-size-s' },
    { value: 'md', icon: 'mdi-size-m' },
    { value: 'lg', icon: 'mdi-size-l' },
    { value: 'xl', icon: 'mdi-size-xl' },
  ],
  toggles: true,
  clearable: true,
})

export const commonProperties = {
  name: Type.Object({
    name: Type.String(),
  }),

  state: Type.Object({
    disable: Type.Boolean(),
    readonly: Type.Boolean(),
  }),

  style: Type.Object({
    dense: Type.Boolean(),
    padding: Type.Object({
      top: Type.String(),
      left: Type.String(),
      bottom: Type.String(),
      right: Type.String(),
    }, { style: true, padding: true }),
    margin: Type.Object({
      top: Type.String(),
      left: Type.String(),
      bottom: Type.String(),
      right: Type.String(),
    }, { style: true, margin: true }),
  }),

  size: Type.Object({
    size: sizeString,
  }),
}

export const properties = (props: TObject[]) => Type.Intersect(
  [
    ...props,
    commonProperties.name,
  ],
)
