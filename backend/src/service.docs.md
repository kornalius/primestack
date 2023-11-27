# Service
Services in PrimeStack are created using a wrapper that handles all the complexities of creating a service manually.

<!-- TOC -->
* [Service](#service)
  * [Options](#options)
<!-- TOC -->

## Options
| Option         |  Optional ?  | Description                                                                                       |
|----------------|:------------:|---------------------------------------------------------------------------------------------------|
| schema         |              | TypeBox schema for the service                                                                    |
| hooks          |      ✔       | Hooks for the service                                                                             |
| paginate       |      ✔       | Pagination options for the service                                                                |
| collection     |      ✔       | Mongodb collection name to use                                                                    |
| authentication |      ✔       | Should the user be authenticated to access this service?                                          |
| methods        |      ✔       | Supported method names for the service (ex: `get`, `find`, `create`, `update`, `patch`, `remove`) |
| events         |      ✔       | Custom event names array                                                                          |
| indexes        |      ✔       | Indexes to create                                                                                 |
| created        |      ✔       | Should we manage createdAt and createdBy fields automatically?                                    |
| updated        |      ✔       | Should we manage updatedAt and updatedBy fields automatically?                                    |
| userRead       |      ✔       | Should we assign the userId to createdBy when creating                                            |
| userWrite      |      ✔       | Should we protect updating and removing documents for owner only?                                 |
| softDelete     |      ✔       | Should we manage deletedAt and deletedBy fields automatically?                                    |
| validators     |      ✔       | Service validators                                                                                |
| resolvers      |      ✔       | Service resolvers                                                                                 |
| middlewares    |      ✔       | Service middlewares object (`before`, `after`)                                                    |
