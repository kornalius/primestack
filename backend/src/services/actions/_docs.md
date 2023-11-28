# Actions service
Actions are triggered by frontend events on UI elements, tables, ... They are visual code nodes.

<!-- TOC -->
* [Actions service](#actions-service)
  * [Schema of an action](#schema-of-an-action)
<!-- TOC -->

## Schema of an action
User's actions are stored in a `list` which is an array of Action objects.

- list []
  - action 1
  - action 2 
  - ...

> Some action can have an array of children actions which are executed when the parent action decides to.
