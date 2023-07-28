// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'

export default (lazyLoad, patterns) => {
  const mid = patterns.mongoId.string
  return [
    {
      path: `/tables/:id(${mid}|create)?`,
      component: lazyLoad('views/Table/Main'),
      props: (route: RouteLocationNormalized): AnyData => ({
        id: route.params.id !== 'create' ? route.params.id : undefined,
        create: route.params.id === 'create',
      }),
      meta: {
        requiresAuth: true,
      },
    },
  ]
}