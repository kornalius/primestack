export default (lazyLoad) => ([
  {
    path: '/plans',
    component: lazyLoad('views/Plans/Main'),
  },
])
