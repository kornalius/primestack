// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
export default (lazyLoad, patterns) => ([
  {
    path: '/home',
    component: lazyLoad('views/Home/Main'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/test',
    component: lazyLoad('views/Home/Test'),
    meta: {
      requiresAuth: true,
    },
  },
])
