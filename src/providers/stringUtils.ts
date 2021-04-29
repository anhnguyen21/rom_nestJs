import * as slug from 'slug'

export const getFileName = (fileName: string) => {
  const index = fileName.indexOf('.')
  const file = slug(fileName.substring(0, index))
  const extension = fileName.substring(index)
  return `${file}-${new Date().getTime()}${extension}`
}
