import hotkeys from 'hotkeys-js'
import { useAppEditor } from '@/features/Editor/store'

const scope = 'edit'

export default () => {
  hotkeys('del', scope, (e) => {
    const editor = useAppEditor()
    editor.removeSelected()
    e.preventDefault()
  })

  hotkeys('ctrl+s', scope, (e) => {
    const editor = useAppEditor()
    if (editor.canSave) {
      editor.save().then(() => {})
    }
    e.preventDefault()
  })

  hotkeys('ctrl+z', scope, (e) => {
    const editor = useAppEditor()
    editor.undo()
    e.preventDefault()
  })

  hotkeys('ctrl+shift+z', scope, (e) => {
    const editor = useAppEditor()
    editor.redo()
    e.preventDefault()
  })

  hotkeys('ctrl+c', scope, (e) => {
    const editor = useAppEditor()
    editor.copy().then(() => {})
    e.preventDefault()
  })

  hotkeys('ctrl+x', scope, (e) => {
    const editor = useAppEditor()
    editor.copy().then(() => {})
    editor.removeSelected()
    e.preventDefault()
  })

  hotkeys('ctrl+v', scope, (e) => {
    const editor = useAppEditor()
    editor.paste().then(() => {})
    e.preventDefault()
  })

  hotkeys('ctrl+d', scope, (e) => {
    const editor = useAppEditor()
    editor.duplicate()
    e.preventDefault()
  })
}
