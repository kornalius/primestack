import hotkeys from 'hotkeys-js'
import { useAppEditor } from '@/features/App/editor-store'

const scope = 'edit'

export default () => {
  hotkeys('ctrl+s', scope, (e) => {
    const editor = useAppEditor()
    if (editor.canSave) {
      editor.save()
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
}
