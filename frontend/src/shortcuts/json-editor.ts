import hotkeys from 'hotkeys-js'
import { useJsonEditor } from '@/features/Json/store'

const scope = 'json'

export default () => {
  hotkeys('ctrl+z', scope, (e) => {
    const editor = useJsonEditor()
    editor.undo()
    e.preventDefault()
  })

  hotkeys('ctrl+shift+z', scope, (e) => {
    const editor = useJsonEditor()
    editor.redo()
    e.preventDefault()
  })
}
