import { Static } from '@feathersjs/typebox'
import { TFormComponent } from '@/shared/interfaces/forms'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import label from './label'
import chip from './chip'
import icon from './icon'
import image from './image'
import video from './video'
import input from './input'
import select from './select'
import lookupSelect from './lookup-select'
import table from './table'
import color from './color'
import iconSelect from './icon-select'
import paragraph from './paragraph'
import checkbox from './checkbox'
import toggle from './toggle'
import buttonToggle from './button-toggle'
import optionGroup from './option-group'
import button from './button'
import knob from './knob'
import slider from './slider'
import range from './range'
import rating from './rating'
import date from './date'
import time from './time'
import row from './row'
import col from './col'
import card from './card'
import carSection from './card-section'
import cardActions from './card-actions'
import progress from './progress'
import separator from './separator'
import skeleton from './skeleton'
import spinner from './spinner'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const addSeparator = (l: string, i: string, c?: string): TFormComponent => ({
  type: '$separator',
  label: l,
  icon: i,
  color: c || 'white',
})

export const components = [
  addSeparator('Display', 'mdi-format-color-text', 'orange-2'),
  label,
  separator,
  chip,
  icon,
  image,
  video,
  skeleton,
  addSeparator('Progress', 'mdi-progress-clock', 'blue-2'),
  progress,
  spinner,
  addSeparator('Inputs', 'mdi-form-textbox', 'green-2'),
  input,
  select,
  lookupSelect,
  table,
  color,
  iconSelect,
  date,
  time,
  paragraph,
  checkbox,
  toggle,
  knob,
  slider,
  range,
  rating,
  addSeparator('Buttons', 'mdi-button-pointer', 'red-2'),
  button,
  buttonToggle,
  optionGroup,
  addSeparator('Flexbox', 'mdi-view-column-outline', 'pink-2'),
  row,
  col,
  addSeparator('Card', 'mdi-card'),
  card,
  carSection,
  cardActions,
]

export const componentForType = (
  components.reduce((acc, c) => (
    { ...acc, [c.type]: c.component }
  ), {})
)

export const componentsByType = (
  components.reduce((acc, c) => (
    { ...acc, [c.type]: c }
  ), {})
)

export const componentForField = (field: FormField | FormColumn): TFormComponent | undefined => {
  // eslint-disable-next-line no-underscore-dangle
  let comp = componentForType[field._type]
  if (typeof comp === 'function') {
    comp = comp(field)
  }
  return comp
}
