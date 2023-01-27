

export const getEnumValues = <T>(enumSrc: T, keys: any | any[]): (T[keyof T] | undefined)[] => {
  if (!keys) return []

  const enumKeys = getEnumKeys(enumSrc)

  return [keys].flat().map(key => {
    key = key.toUpperCase()
    return enumKeys.includes(key) ? enumSrc[key as keyof T] : undefined
  })
}

export const getEnumKeys = <T>(enumSrc: T): string[] => {
  return Object.keys(enumSrc || {}).filter(x => !(parseInt(x) >= 0))
}

export const isEnumKeys = <T>(enumSrc: T, keys: any | any[]) : boolean => {
  if (!keys) return false

  const enumKeys = getEnumKeys(enumSrc)
  const unknown = [keys].flat().find(key => !enumKeys.includes(key.toUpperCase()))

  return unknown ? false : true
}
