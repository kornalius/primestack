import { RouteRecordRaw } from 'vue-router'

import Home from './home'
import Login from './login'
import Form from './form'
import Menu from './menu'
import Table from './table'
import User from './user'
import Plan from './plan'
import Upload from './upload'
import Share from './share'

function lazyLoad(view: string) {
  const dynamicPath = `../${view}.vue`
  return () => import(/* @vite-ignore */ dynamicPath)
}

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: () => '/home',
  },
  ...Login(lazyLoad),
  ...Home(lazyLoad),
  ...Form(lazyLoad),
  ...Menu(lazyLoad),
  ...Table(lazyLoad),
  ...User(lazyLoad),
  ...Plan(lazyLoad),
  ...Upload(lazyLoad),
  ...Share(lazyLoad),
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: lazyLoad('views/Errors/NotFound'),
  },
] as RouteRecordRaw[]

export default routes
