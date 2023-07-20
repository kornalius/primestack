import { RouteRecordRaw } from 'vue-router'
import { usePatterns } from '@/composites/parser'

import Home from './home'
import Login from './login'
import Menu from './menu'
import Schema from './schema'

const patterns = usePatterns()

function lazyLoad(view) {
  const dynamicPath = `../${view}.vue`
  return () => import(/* @vite-ignore */ dynamicPath)
}

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: () => '/home',
  },
  ...Login(lazyLoad, patterns),
  ...Home(lazyLoad, patterns),
  ...Menu(lazyLoad, patterns),
  ...Schema(lazyLoad, patterns),
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: lazyLoad('views/Errors/NotFound'),
  },
] as RouteRecordRaw[]

export default routes
