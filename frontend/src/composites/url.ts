export const useUrl = () => ({
  menuUrl: (menuId: string): string => {
    const u = ['menus', menuId]
    return `/${u.join('/')}`
  },

  menuTabUrl: (menuId: string, tabId: string, formId?: string, create?: boolean): string => {
    const u = ['menus', menuId, tabId]
    if (formId) {
      u.push(formId)
    }
    if (create) {
      u.push('create')
    }
    return `/${u.join('/')}`
  },
})
