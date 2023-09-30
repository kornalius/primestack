import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'
import { mongoIdString } from '@/features/Validation/helpers'

export default (lazyLoad) => ([
  {
    path: '/forms',
    component: lazyLoad('views/Form/Main'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: `/forms/:formId(${mongoIdString})`,
    component: lazyLoad('views/Form/Main'),
    props: (route: RouteLocationNormalized): AnyData => ({
      formId: route.params.formId,
    }),
    meta: {
      requiresAuth: true,
    },
  },
])
