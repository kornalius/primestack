/**
 * Format a file size into a human readable string
 *
 * @param size {number} file size
 *
 * @return {string}
 */
export const formatSize = (size: number): string => {
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return `${parseFloat((size / k ** i).toFixed(2))} ${sizes[i]}`
}
