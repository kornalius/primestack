export const componentPlans: Record<string, string[]> = {
  table: ['personal', 'business', 'enterprise'],
  video: ['personal', 'business', 'enterprise'],
}

export const actionPlans: Record<string, string[]> = {
  insert: ['personal', 'business', 'enterprise'],
  patch: ['personal', 'business', 'enterprise'],
}

export const servicePlans: Record<string, string[]> = {
  events: ['business', 'enterprise'],
}

/**
 * Checks if the component is available to the user's current plan
 *
 * @param componentType Component type
 * @param planCode Plan's code
 *
 * @returns {boolean} Returns true if the component is available
 */
export const isComponentAvailable = (componentType: string, planCode: string): boolean => (
  componentPlans[componentType] ? componentPlans[componentType].includes(planCode) : true
)

/**
 * Checks if the action is available to the user's current plan
 *
 * @param actionType Action type
 * @param planCode Plan's code
 *
 * @returns {boolean} Returns true if the action is available
 */
export const isActionAvailable = (actionType: string, planCode: string): boolean => (
  actionPlans[actionType] ? actionPlans[actionType].includes(planCode) : true
)

/**
 * Checks if the service is available to the user's current plan
 *
 * @param serviceName Service name
 * @param planCode Plan's code
 *
 * @returns {boolean} Returns true if the action is available
 */
export const isServiceAvailable = (serviceName: string, planCode: string): boolean => (
  servicePlans[serviceName] ? servicePlans[serviceName].includes(planCode) : true
)
