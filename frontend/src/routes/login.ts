import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
export default (lazyLoad, patterns) => ([
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('views/Login/Main'),
    props: (route: RouteLocationNormalized): AnyData => ({
      code: route.query.code,
      sessionState: route.query.session_state,
      state: route.query.state,
    }),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: lazyLoad('views/Logout/Main'),
  },
])
