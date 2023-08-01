export default (lazyLoad) => ([
  {
    path: '/profile',
    component: lazyLoad('views/User/Profile'),
    meta: {
      requiresAuth: true,
    },
  },
])
