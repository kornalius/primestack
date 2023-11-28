# Users service
Users service.

<!-- TOC -->
* [Users service](#users-service)
  * [User's rights and maximums](#users-rights-and-maximums)
    * [Rules and Maxes check precedence](#rules-and-maxes-check-precedence)
    * [Rights](#rights)
    * [Maximums](#maximums)
<!-- TOC -->

## User's rights and maximums
Roles are mainly handled by the `groupId` and `planId` fields.

- Each user can have custom rules
- Each user is assigned to a group and a plan
- Each group is assigned to a plan
- Each group has rules and maxes
- Each share has rules and maxes
- rules, check access (read, create, update, patch, delete) for a specific tableId
- maxes, check limits for features

### Rules and Maxes check precedence
```
user > [share] > group > plan
```

### Rights
Specify the service methods which are allowed on a user's table

| Name   | Description                        |
|--------|------------------------------------|
| read   | Allow `get` and `find` methods     |
| create | Allow `create` method              |
| update | Allow `update` and `patch` methods |
| delete | Allow `remove` method              |

### Maximums
A set of maximum values that limits the user's actions in the system and are checked by specialized service hooks.

> A value of `-1` indicates unlimited

| Name        | Description                                            |
|-------------|--------------------------------------------------------|
| maxShares   | Maximum number of shared menus a user can have         |
| maxTables   | Maximum number of tables a user can define             |
| maxRecords  | Maximum number of records per table a user can have    |
| maxMenus    | Maximum number of menus a user can create              |
| maxForms    | Maximum number of forms a user can create              |
| maxEdits    | If the user can go into edit mode or not. -1 means yes |
| maxFiles    | Maximum number of files a user can upload              |
| maxFileSize | Maximum file size a user can upload                    |
| maxSettings | Maximum number of custom setting keys a user can have  |
