import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'
import { mongoIdString } from '@/features/Validation/helpers'

export default (lazyLoad) => ([
  {
    path: `/menus/:menuId(${mongoIdString})`,
    component: lazyLoad('views/Menu/Main'),
    props: (route: RouteLocationNormalized): AnyData => ({
      menuId: route.params.menuId,
    }),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: `/menus/:menuId(${mongoIdString})/:tabId(${mongoIdString})/:id(${mongoIdString}|create)?`,
    component: lazyLoad('views/Form/Main'),
    props: (route: RouteLocationNormalized): AnyData => ({
      menuId: route.params.menuId,
      tabId: route.params.tabId,
      id: route.params.id !== 'create' ? route.params.id : undefined,
      create: route.params.id === 'create',
    }),
    meta: {
      requiresAuth: true,
    },
  },
])
