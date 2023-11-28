# Stats service
The stats service is a very specialized service. It calculates statistics on a user's table using MongoDB's aggregation pipelines.

> The stats are kept in memory (not in a collection) and the results are stored in the `value` field.

<!-- TOC -->
* [Stats service](#stats-service)
  * [Obtaining a stat for a table](#obtaining-a-stat-for-a-table)
    * [Stat types](#stat-types)
<!-- TOC -->

## Obtaining a stat for a table
To obtain a stat for a table you need to issue a `create` or `patch` method and pass the following arguments:

| Name        | Description                             |
|-------------|-----------------------------------------|
| uuid        | Unique id identifying the stat          |
| path        | Service path (usually a tableId)        |
| field       | Field to obtain stats on                |
| type        | Type of statistic you want to calculate |
| groupFields | Array of field names used for grouping  |
| query       | Custom query to apply in the pipeline   |

### Stat types

| Name    | Description                 |
|---------|-----------------------------|
| count   | Number of document in table |
| sum     | Sum of values of field      |
| avg     | Average value of field      |
| min     | Minimum value of field      |
| max     | Maximum value of field      |
| empty   | Number of empty fields      |
| !empty  | Number of non empty fields  |
| %empty  | Percent of empty fields     |
| %!empty | Percent of non empty fields |
