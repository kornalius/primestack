import hotkeys from 'hotkeys-js'
import setupAppEditorKeys from './app-editor'
import setupJsonEditorKeys from './json-editor'

hotkeys.setScope('app')

setupAppEditorKeys()
setupJsonEditorKeys()
