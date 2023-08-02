export const useUrl = () => ({
  menuUrl: (menuId: string, tabId?: string, formId?: string, create?: boolean): string => {
    const u = ['menus', menuId]
    if (tabId) {
      u.push(tabId)
    }
    if (formId) {
      u.push(formId)
    }
    if (create) {
      u.push('create')
    }
    return `/${u.join('/')}`
  },

  tableUrl: (tableId?: string, fieldId?: string, create?: boolean): string => {
    const u = ['tables']
    if (tableId) {
      u.push(tableId)
    }
    if (fieldId) {
      u.push(fieldId)
    }
    if (create) {
      u.push('create')
    }
    return `/${u.join('/')}`
  },
})
