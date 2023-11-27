# Forms service
The forms service. Each form is stored in a very specific format to help the frontend handle editing or user's forms.

<!-- TOC -->
* [Forms service](#forms-service)
  * [Schema of a form](#schema-of-a-form)
<!-- TOC -->

## Schema of a form
User's forms are stored in a `list` which is an array of Form objects.

- list []
  - form 1
  - form 2 
  - ...
