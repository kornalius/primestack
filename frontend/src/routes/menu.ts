// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'

export default (lazyLoad, patterns) => {
  const mid = patterns.mongoId.string
  return [
    {
      path: `/menus/:menuId(${mid})`,
      component: lazyLoad('views/Menu/Main'),
      props: (route: RouteLocationNormalized): AnyData => ({
        menuId: route.params.menuId,
      }),
    },
    {
      path: `/menus/:menuId(${mid})/:tabId(${mid})/:id(${mid}|create)?`,
      component: lazyLoad('views/Form/Main'),
      props: (route: RouteLocationNormalized): AnyData => ({
        menuId: route.params.menuId,
        tabId: route.params.tabId,
        id: route.params.id !== 'create' ? route.params.id : undefined,
        create: route.params.id === 'create',
      }),
    },
  ]
}
