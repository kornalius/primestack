# Menus service
The menus service. Each menu is stored in a very specific format to help the frontend handle editing or user's menus.

<!-- TOC -->
* [Menus service](#menus-service)
  * [Schema of a menu](#schema-of-a-menu)
  * [Tabs](#tabs)
<!-- TOC -->

## Schema of a menu
User's menus are stored in a `list` which is an array of Menu objects.

- list []
  - menu 1
  - menu 2 
  - ...

## Tabs
Each menu contains an array of tabs. Each tab specifies a `formId` to display when active.
