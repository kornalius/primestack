// import { useFeathers } from '@/composites/feathers'
// import { AnyData } from '@/shared/interfaces/commons'

// const { api } = useFeathers()

/**
 * Remove items from the store by their Id's
 */
// export const removeStoreItems = (servicePath: string, instancesOrIds: AnyData[]): void => {
//   instancesOrIds.forEach((i) => {
//     if (typeof i === 'string' || typeof i === 'number') {
//       const instance = api.service(servicePath).getFromStrore(i)
//       instance.removeFromStore()
//       return
//     }
//
//     // eslint-disable-next-line no-underscore-dangle
//     if (i.__isServiceInstance) {
//       i.removeFromStore()
//     }
//   })
// }

export default {}
