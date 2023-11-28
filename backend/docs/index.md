# Backend
The backend is composed of feathers.js micro-services all encapsulated into their own folder.

<!-- TOC -->
* [Backend](#backend)
  * [Service](#service)
    * [Structure of a service:](#structure-of-a-service)
      * [Service filenaming standard:](#service-filenaming-standard)
      * [Example of a service folder structure:](#example-of-a-service-folder-structure)
      * [What are the different types:](#what-are-the-different-types)
      * [Schema](#schema)
  * [Services](#services)
  * [Setup & Installation](#setup--installation)
    * [Installing required packages](#installing-required-packages)
  * [Environment files](#environment-files)
  * [Running the server](#running-the-server)
    * [Running the server in development mode](#running-the-server-in-development-mode)
    * [Building the server for production](#building-the-server-for-production)
    * [Running the server in production mode](#running-the-server-in-production-mode)
<!-- TOC -->

## Service

### Structure of a service:
The micro-services are located in the `services/` folder.

#### Service filenaming standard:
The service files all follow a specific naming standard.

> `serviceName`.`type`.`filetype`

#### Example of a service folder structure:
- services/
  - my-service/ `<- kebab casing!!!`
    - my-service.hooks.ts
    - my-service.seeds.ts
    - my-service.service.ts
    - my-service.test.http
    - my-service.docs.md

#### What are the different types:
| Type       | Description                                                                                                                                                                                                                 |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Service    | Services are the heart of every Feathers application. Services are objects or instances of classes that implement certain methods. Feathers itself will also add some additional methods and functionality to its services. |
| Hooks      | Hooks are pluggable middleware functions that can be registered around, before, after or on error(s) of a service method. Multiple hook functions can be chained to create complex work-flows.                              |
| Resolvers  | Resolvers dynamically resolve individual properties based on a context, in a Feathers application usually the hook context. It allows easy populating associations, computing properties, securing properties or queries... |
| Seeds      | Populates the database collections with initial sets of data.                                                                                                                                                               | 
| Http tests | Allows you to test your service HTTP Api endpoints.                                                                                                                                                                         |
| Docs       | These files are merged into the documentation of the project.                                                                                                                                                               |

#### Schema
Each service data model must have a [Typebox](https://feathersjs.com/api/schema/typebox.html) schema which is stored in a `shared` folder in the root folder of the project.

## Services
| Name                                                        | Description                       |
|-------------------------------------------------------------|-----------------------------------|
| [Actions](../src/services/actions/_docs.md)          | User's visual programming actions |          
| [Blueprints](../src/services/blueprints/_docs.md) | User's custom UI properties       |
| [Events](../src/services/events/_docs.md)             | Service method events             |
| [Files](../src/services/files/_docs.md)                | Files listing and downloads       |
| [Forms](../src/services/forms/_docs.md)                | User's UI forms                   |
| [Groups](../src/services/groups/_docs.md)             | User's groups                     |
| [Health](../src/services/health/_docs.md)             | Server's health API               |
| [Menus](../src/services/menus/_docs.md)                | User's menus                      |
| [Plans](../src/services/plans/_docs.md)                | Subscription plans                |
| [Shares](../src/services/shares/_docs.md)             | User's menu shares                |
| [Stats](../src/services/stats/_docs.md)                | User's tables statistics          |
| [Tables](../src/services/tables/_docs.md)             | User's tables definitions         |
| [Uploads](../src/services/uploads/_docs.md)          | Files upload                      |
| [Users](../src/services/users/_docs.md)                | Users                             |

## Setup & Installation

### Installing required packages
```bash
yarn
```

## Environment files
Read about [Environment files](../env.md) here

## Running the server

### Running the server in development mode
```bash
yarn dev
```

### Building the server for production
```bash
yarn build
```

### Running the server in production mode
```bash
yarn start
```
