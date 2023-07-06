export interface HealthInterface {
  id: number
  version: string
  calls: {
    total: number
    find: number
    get: number
    create: number
    update: number
    patch: number
    remove: number
  }
}

export default {}
