import label from './label'
import chip from './chip'
import icon from './icon'
import image from './image'
import video from './video'
import input from './input'
import select from './select'
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

export const components = [
  label,
  chip,
  icon,
  image,
  video,
  progress,
  separator,
  skeleton,
  input,
  select,
  table,
  color,
  iconSelect,
  date,
  time,
  paragraph,
  checkbox,
  toggle,
  button,
  buttonToggle,
  optionGroup,
  knob,
  slider,
  range,
  rating,
  row,
  col,
  card,
  carSection,
  cardActions,
]

export const componentForType = (
  components.reduce((acc, c) => (
    { ...acc, [c.type]: c.component }
  ), {})
)