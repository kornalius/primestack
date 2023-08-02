import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Is being authenticated required to navigate to this route?
     */
    requiresAuth?: boolean
    /**
     * Do we need specific rights to navigate to this route?
     */
    requiredRights?: string[]
    /**
     * Do this route requires the editor to be active or not?
     */
    editor?: boolean
  }
}
