import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'
import { mongoIdString } from '@/features/Validation/helpers'

export default (lazyLoad) => ([
  {
    path: `/share-link/:id(${mongoIdString})/:linkClicked`,
    component: lazyLoad('views/Shares/ShareLink'),
    props: (route: RouteLocationNormalized): AnyData => ({
      id: route.params.id,
      linkClicked: route.params.linkClicked,
    }),
  },
  {
    path: `/shares/:id(${mongoIdString}|create)?/`,
    component: lazyLoad('views/Shares/Main'),
    props: (route: RouteLocationNormalized): AnyData => ({
      id: route.params.id !== 'create' ? route.params.id : undefined,
      create: route.params.id === 'create',
    }),
    meta: {
      requiresAuth: true,
    },
  },
])
