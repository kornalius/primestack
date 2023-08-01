import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'
import { mongoIdString } from '@/features/Validation/helpers'

export default (lazyLoad) => ([
  {
    path: `/tables/:id(${mongoIdString}|create)?`,
    component: lazyLoad('views/Table/Main'),
    props: (route: RouteLocationNormalized): AnyData => ({
      id: route.params.id !== 'create' ? route.params.id : undefined,
      create: route.params.id === 'create',
    }),
    meta: {
      requiresAuth: true,
    },
  },
])
