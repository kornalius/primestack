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
])
