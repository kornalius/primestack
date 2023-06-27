import { api } from '@/plugins/pinia'

// Provides access to Feathers Client(s)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFeathers = () => ({ api })
