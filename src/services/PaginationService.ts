import { Token } from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import HttpRouterError from "../entities/HttpRouterError";

import Service, { IService, ServiceOptions } from "./Service";

export const PaginationServiceToken = new Token<IPaginationService>("PaginationService")

export type PaginationColumn = {
  where?: (offset: number) => string[]
  having?: (offset: number) => string[],
  order: string[]
}

export type PaginationColumnOptions = {
  key: string
  column: string
}

export type PaginationOrderColumnOptions = {
  [key: string]: PaginationColumn
}

export type PaginationQueryOrderOptions = {
  orderId?: string
  offset?: number
  orders: PaginationOrderColumnOptions
}

export type PaginationCustomColumnOptions = PaginationColumnOptions & {
  selectColumn?: string
  offsetColumn: string
  selectOffsetColumn?: string
  table: string
  having?: boolean
}

export type PaginationRequestOptions = {
  limit?: number
  offset?: any
  order?: string
}

export type PaginationOptions = {
  limit?: number
  offset?: number
  orderId?: string
}

export type PaginationOptionsOptions = {
  offsetHandler: (offset: any) => number[]
}

export type PaginationQueryOptions = {
  where: any[]
  having: any[]
  order: any[]
}

export type PaginationServiceOptions = ServiceOptions & {
  limitDefault: number
  limitMin: number
  limitMax: number
}

export type IPaginationService = IService & {
  getPaginationOptions(params: any, options: PaginationOptionsOptions): PaginationOptions
  getPaginationQueryOptions(options: PaginationQueryOrderOptions): PaginationQueryOptions

  getPaginationColumnOptions(options: PaginationColumnOptions): PaginationOrderColumnOptions
  getPaginationCustomColumnOptions(options: PaginationCustomColumnOptions): PaginationOrderColumnOptions
}

export default class PaginationService extends Service<PaginationServiceOptions> implements IPaginationService {

  getPaginationOptions(params: PaginationRequestOptions, options: PaginationOptionsOptions): PaginationOptions {
    const { limitDefault, limitMax, limitMin } = this.options

    let { limit = limitDefault, offset, order: orderId = "id_asc" } = params || {}
    let { offsetHandler } = options || {}

    if (limit < limitMin || limit > limitMax) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.PAGINATION_LIMIT_INVALID)

    if (offset && offsetHandler) {
      [offset] = offsetHandler(offset)
      if (!offset) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.PAGINATION_OFFSET_INVALID)
    }

    return { limit, offset, orderId }
  }

  getPaginationQueryOptions(options: PaginationQueryOrderOptions): PaginationQueryOptions  {
    const { orderId, offset, orders } = options || {}

    if (!orderId) return { where: [], having: [], order: ['1 asc'] }
    if (!orders.hasOwnProperty(orderId)) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.PAGINATION_ORDER_INVALID)

    const { where, having, order } = orders[orderId]

    return { where: offset && where ? where(offset) : [], having: offset && having ? having(offset) : [], order }
  }

  getPaginationColumnOptions(options: PaginationColumnOptions): PaginationOrderColumnOptions {
    const { key, column } = options || {}

    return {
      [`${key}_asc`]: { where: (offset: number) => [`${column} > ${offset}`], order: [`${column} ASC`] },
      [`${key}_desc`]: { where: (offset: number) => [`${column} < ${offset}`], order: [`${column} DESC`] }
    }
  }

  getPaginationCustomColumnOptions(options: PaginationCustomColumnOptions): PaginationOrderColumnOptions {
    const { key, column, offsetColumn, table, having, selectColumn, selectOffsetColumn } = options || {}

    const propertyKey = having ? "having" : "where"

    return {
      [`${key}_asc`]: { [propertyKey]: (offset: number) => [`(${column} > (SELECT ${selectColumn || column} FROM ${table} WHERE ${selectOffsetColumn || offsetColumn} = ${offset}) OR (${column} = (SELECT ${selectColumn || column} FROM ${table} WHERE ${selectOffsetColumn || offsetColumn} = ${offset}) AND ${offsetColumn} > ${offset}))`], order: [`${column} ASC`, `${offsetColumn} ASC`] },
      [`${key}_desc`]: { [propertyKey]: (offset: number) => [`(${column} < (SELECT ${selectColumn || column} FROM ${table} WHERE ${selectOffsetColumn || offsetColumn} = ${offset}) OR (${column} = (SELECT ${selectColumn || column} FROM ${table} WHERE ${selectOffsetColumn || offsetColumn} = ${offset}) AND ${offsetColumn} < ${offset}))`], order: [`${column} DESC`, `${offsetColumn} DESC`] },
    }
  }

}