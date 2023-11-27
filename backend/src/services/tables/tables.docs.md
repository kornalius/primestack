# Tables service
The tables service. Each table is stored in a very specific format to help the frontend handle editing or user's tables.

<!-- TOC -->
* [Tables service](#tables-service)
  * [Schema of a table](#schema-of-a-table)
<!-- TOC -->

## Schema of a table
User's tables are stored in a `list` which is an array of Table objects.

- list []
  - table 1
  - table 2 
  - ...
