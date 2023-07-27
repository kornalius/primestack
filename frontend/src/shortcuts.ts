import hotkeys from 'hotkeys-js'
import useAppEditor from '@/features/App/store'

hotkeys.setScope('app')

hotkeys('ctrl+s', 'edit', (e) => {
  const editor = useAppEditor()
  editor.save()
  e.preventDefault()
})

hotkeys('ctrl+z', 'edit', (e) => {
  const editor = useAppEditor()
  editor.undo()
  e.preventDefault()
})

hotkeys('ctrl+shift+z', 'edit', (e) => {
  const editor = useAppEditor()
  editor.redo()
  e.preventDefault()
})
