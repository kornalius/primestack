# Forms service
The forms service. Each form is stored in a very specific format to help the frontend handle editing or user's forms.

<!-- TOC -->
* [Forms service](#forms-service)
  * [Schema of a form](#schema-of-a-form)
    * [Important fields](#important-fields)
  * [Form's Table](#forms-table)
<!-- TOC -->

## Schema of a form
User's forms are stored in a `list` which is an array of Form objects.

- list []
  - form 1
  - form 2 
  - ...

### Important fields
The important internal fields in the form schema are:

- _id
- _type
- _internalType
- _fields


## Form's Table
Each form is connected to a `tableId`. The table is displayed as a filterable list in a collapsable drawer on the left side of the form.
