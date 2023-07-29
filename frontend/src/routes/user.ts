// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
export default (lazyLoad, patterns) => ([
  {
    path: '/profile',
    component: lazyLoad('views/User/Profile'),
    meta: {
      requiresAuth: true,
    },
  },
])
