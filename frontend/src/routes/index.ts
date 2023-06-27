import { RouteRecordRaw } from 'vue-router'
import { usePatterns } from '@/composites/parser'

import Home from './home'
import Login from './login'

const patterns = usePatterns()

function lazyLoad(view) {
  const dynamicPath = `../${view}.vue`
  return () => import(/* @vite-ignore */ dynamicPath)
}

export const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: () => '/home',
  },
  ...Login(lazyLoad, patterns),
  ...Home(lazyLoad, patterns),
  {
    path: '/unauthenticated',
    name: 'Unauthenticated',
    component: lazyLoad('views/Error/Unauthenticated'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: lazyLoad('views/Error/NotFound'),
  },
  {
    path: '/network-error',
    name: 'NetworkError',
    component: lazyLoad('views/Error/NetworkError'),
  },
  {
    path: '/invalid-data',
    name: 'InvalidData',
    component: lazyLoad('views/Error/InvalidData'),
  },
] as RouteRecordRaw[]

export default routes
