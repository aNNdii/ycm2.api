

export const chunks = <T = any>(items: T[], chunkSize: number): T[][] => {
  return items.reduce((a: any, o: any, i: number) => {
    const c = Math.floor(i / chunkSize)
    a[c] = [].concat((a[c] || []), o)
    return a
  }, [])
}

export const unique = (items: any[]) => [...new Set(items)]
