import { ComputedRef } from 'vue'
import { ServiceInstance } from 'feathers-pinia/src/modeling'
// eslint-disable-next-line import/no-cycle
import { api } from '@/plugins/pinia'
import { PiniaService } from 'feathers-pinia'
import { FeathersService } from '@feathersjs/feathers'

// Provides access to Feathers Client(s)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFeathers = () => ({ api })

export const useFeathersService = (
  servicePath: string,
  clientAlias = 'api',
): PiniaService<FeathersService> => {
  const clients = useFeathers()
  const client = clients[clientAlias as keyof typeof clients]
  return client.service(servicePath) as unknown as PiniaService<FeathersService>
}

export type ServiceType<T> = ComputedRef<ServiceInstance<T>>
