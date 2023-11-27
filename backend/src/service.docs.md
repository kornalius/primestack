# Service
Services in PrimeStack are created using a wrapper that handles all the complexities of creating a service manually.

<!-- TOC -->
* [Service](#service)
  * [createService function Options](#createservice-function-options)
    * [Structure of validators](#structure-of-validators)
      * [Example of validators](#example-of-validators)
    * [Structure of resolvers](#structure-of-resolvers)
      * [Example of resolvers](#example-of-resolvers)
    * [Structure of Indexes](#structure-of-indexes)
<!-- TOC -->

## createService function Options
| Option         | Optional ? | Description                                                                                       |
|----------------|:----------:|---------------------------------------------------------------------------------------------------|
| schema         |            | TypeBox schema for the service                                                                    |
| hooks          |     ✔      | Hooks for the service                                                                             |
| paginate       |     ✔      | Pagination options for the service                                                                |
| collection     |     ✔      | Mongodb collection name to use                                                                    |
| authentication |     ✔      | Should the user be authenticated to access this service?                                          |
| methods        |     ✔      | Supported method names for the service (ex: `get`, `find`, `create`, `update`, `patch`, `remove`) |
| events         |     ✔      | Custom event names array                                                                          |
| indexes        |     ✔      | Indexes to create                                                                                 |
| created        |     ✔      | Should we manage `createdAt` and `createdBy` fields automatically?                                |
| updated        |     ✔      | Should we manage `updatedAt` and `updatedBy` fields automatically?                                |
| userRead       |     ✔      | Should we assign the userId to `createdBy` when creating                                          |
| userWrite      |     ✔      | Should we protect updating and removing documents for owner only?                                 |
| softDelete     |     ✔      | Should we manage `deletedAt` and `deletedBy` fields automatically?                                |
| validators     |     ✔      | Service validators                                                                                |
| resolvers      |     ✔      | Service resolvers                                                                                 |
| middlewares    |     ✔      | Service middlewares object (`before`, `after`)                                                    |

### Structure of validators
```ts
interface CreateServiceValidators {
  data?: string[] | {
    $create?: string[]
    $patch?: string[]
  }
  result?: string[] | {
    $create?: string[]
    $patch?: string[]
  }
  query?: string[]
  querySyntax?: Record<string, TSchema>,
}
```

#### Example of validators

```ts
{
  validators: {
    data: {
      $create: ['my_field']
    }
  }
}
```
### Structure of resolvers
```ts
interface CreateServiceResolvers {
  data?: AnyData | {
    $create?: AnyData
    $patch?: AnyData
  }
  result?: AnyData
  external?: AnyData
  query?: AnyData
}
```

#### Example of resolvers

```ts
{
  resolvers: {
    result: async (record: AnyData, context: HookContext) => {
      if (context.user._id !== record.createdBy) {
        return undefined
      }
      return record[f.name]
    }
  }
}
```

### Structure of Indexes

```ts
interface Index {
  fields: Record<string, number>
  unique?: boolean
  sparse?: boolean
  expireAfterSeconds?: number
}
```
