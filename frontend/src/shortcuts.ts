import hotkeys from 'hotkeys-js'
import useAppEditor from '@/features/App/store'

hotkeys.setScope('app')

hotkeys('ctrl+s', 'edit', (e) => {
  const editor = useAppEditor()
  editor.save()
  e.preventDefault()
})
