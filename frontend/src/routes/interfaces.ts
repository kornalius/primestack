export interface RouteMetadataInterface {
  /**
   * Is being authenticated required to navigate to this route?
   */
  requiresAuth?: boolean
  /**
   * Do we need specific rights to navigate to this route?
   */
  requiredRights?: string[]
}
