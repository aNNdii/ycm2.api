import { parseStream, writeToString } from "fast-csv";

import { getEnumValues } from "./Enum"

export const DefaultEncoding = "WIN1252"
export const KoreanEncoding = "EUC-KR"

export const getFlagIdByFlags = <T>(src: T, value: string | string[]) => {
  const values = Array.isArray(value) ? value : value.split(/\|| \| |,| , /)
  const valueIds = getEnumValues(src, values) as number[]

  return valueIds.reduce((p, c) => p + (c || 0), 0)
}

export const getFlagsByFlagId = <T>(src: T, id: number) => {
  const flags: string[] = []

  id && Object.keys(src || {}).map(key => {
    // @ts-ignore
    if (id & src[key]) flags.push(key)
  })

  return flags
}

export const parseProtoStream = async <T = any>(stream: NodeJS.ReadableStream, options: any) => {
  const {
    transform = (row: any) => row,
    delimiter = '\t',
    ...parserOptions
  } = options || {}

  const rows: T[] = []

  await new Promise((resolve, reject) => {
    parseStream(stream, {
      ...parserOptions,
      delimiter,
    })
      .transform(transform)
      .on('data', row => rows.push(row))
      .on('error', reject)
      .on('end', resolve)
  })

  return rows
}
