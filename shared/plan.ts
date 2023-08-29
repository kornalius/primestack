export const componentPlans: Record<string, string[]> = {
  'table': ['personal', 'business', 'enterprise'],
  'video': ['personal', 'business', 'enterprise'],
}

export const actionPlans: Record<string, string[]> = {
  insert: ['personal', 'business', 'enterprise'],
  patch: ['personal', 'business', 'enterprise'],
}

/**
 * Checks if the component is available the user's current plan
 *
 * @param componentType Component type
 * @param planCode Plan's code
 *
 * @returns {boolean} Returns true if the component is available
 */
export const isComponentPaid = (componentType: string, planCode: string): boolean => (
  componentPlans[componentType] ? !componentPlans[componentType].includes(planCode) : false
)

/**
 * Checks if the action is available the user's current plan
 *
 * @param actionType Action type
 * @param planCode Plan's code
 *
 * @returns {boolean} Returns true if the action is available
 */
export const isActionPaid = (actionType: string, planCode: string): boolean => (
  actionPlans[actionType] ? !actionPlans[actionType].includes(planCode) : false
)
