export default (lazyLoad) => ([
  {
    path: '/uploads',
    component: lazyLoad('views/Uploads/Main'),
  },
])
