
export const getCurrentTimestamp = () => {
  return ~~(new Date().getTime() / 1000)
}

export const formatToMysqlDateTime = (date: string | Date) => {
  return new Date(date).toISOString().substring(0, 19).replace('T', ' ')
}
