import { RouteLocationNormalized } from 'vue-router'
import { AnyData } from '@/shared/interfaces/commons'

export default (lazyLoad) => ([
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('views/Auths/Login'),
    props: (route: RouteLocationNormalized): AnyData => ({
      code: route.query.code,
      sessionState: route.query.session_state,
      state: route.query.state,
    }),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: lazyLoad('views/Auths/Logout'),
  },
])
