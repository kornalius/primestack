# Frontend

The frontend is structure into feature folders which allow the grouping of visual components, interfaces, stores and services into neatly encapsulated  modules.

<!-- TOC -->
* [Frontend](#frontend)
  * [Structure of the frontend project](#structure-of-the-frontend-project)
  * [What are composables (composites)?](#what-are-composables-composites)
  * [Structure of the features folder](#structure-of-the-features-folder)
  * [Running the frontend](#running-the-frontend)
    * [Running the frontend in development mode](#running-the-frontend-in-development-mode)
    * [Building the frontend for production](#building-the-frontend-for-production)
<!-- TOC -->

## Structure of the frontend project

| Folder     | Description                                    |
|------------|------------------------------------------------|
| composites | Gloval Vue composables                         |
| features   | Encapsulated components, interfaces, stores... |
| plugins    | External libraries setup                       |
| routes     | Vue Router routes setup                        |
| shortcuts  | Hotkeys-js shortcuts and their actions         |
| styles     | Global SASS styling                            |
| utils      | Gloval utilities                               |
| views      | Vue Router views                               |

## What are composables (composites)?
In the context of Vue applications, a "composable" is a function that leverages Vue's Composition API to encapsulate and reuse stateful logic.

## Structure of the features folder
A feature folder is usually well defined and neatly organized

- MyFeature/ `<- Pascal casing!!!`
  - components/
  - composites.ts
  - interfaces.ts
  - service.ts 
  - store.ts

| File or Folder | Description                                            |
|----------------|--------------------------------------------------------|
| components     | Vue components                                         |
| interfaces.ts  | Typescript interfaces                                  |
| service.ts     | Feathers-pinia connection to the backend micro-service |
| store          | Pinia store                                            |

## Running the frontend

### Running the frontend in development mode
```bash
yarn dev
```

### Building the frontend for production
```bash
yarn build
```
