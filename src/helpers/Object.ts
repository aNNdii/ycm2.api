

export const isObject = (obj: any) => {
  return obj && typeof obj === 'object'
}

export const merge = (target: any, ...sources: any[]) => {
  const mergeSource = (source: any) => {
    if (!isObject(target) || !isObject(source)) return target

    Object.keys(source).forEach((key: any) => {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue)

      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = merge(Object.assign({}, targetValue), sourceValue)

      } else {
        target[key] = sourceValue
      }
    })
  }

  sources.map(source => mergeSource(source))

  return target
}