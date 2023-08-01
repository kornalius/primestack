export default (lazyLoad) => ([
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
