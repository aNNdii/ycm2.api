export enum EntityFilterMethod {
  RAW = "raw",
  EQUAL_NULL = "equal_null",
  NOT_EQUAL_NULL = "not_equal_null",
  EQUAL = "equal",
  NOT_EQUAL = "not_equal",
  GREATER = "greater",
  GREATER_EQUAL = "greater_equal",
  LESS = "less",
  LESS_EQUAL = "less_equal",
  IN = "in",
  LIKE = "like",
  BETWEEN = "between"
}

export type EntityTable = {}

export type EntityFilter<T> = T | [EntityFilterMethod, T | T[] | string]

export type EntityTableFilter<P extends string, T> = { [K in keyof T as K extends string ? `${P}.${K}` : never]?: EntityFilter<T[K]> }
