import { escape, escapeId } from "sqlstring";

import { IMariaDatabaseConnection } from "../infrastructures/MariaDatabaseConnection";
import { MariaDatabaseToken } from "../infrastructures/MariaDatabase";
import Container, { Token } from "../infrastructures/Container";

import { EntityFilterMethod, EntityTable } from "../interfaces/Entity";

import Entity from "../entities/Entity";

import Repository, { IRepository } from "./Repository";

export const MariaRepositoryToken = new Token<IMariaRepository>("MariaRepository")

export enum MariaRepositorySortOrder {
  ASC = "asc",
  DESC = "desc"
}

export type MariaRepositoryQueryOptions = {
  connection?: IMariaDatabaseConnection
  table?: string
}

export type MariaRepositoryFilterOptions<T> = {
  filter?: Partial<T>
  where?: string[]
}

export type MariaRepositorySelectOptions<T> = MariaRepositoryQueryOptions & MariaRepositoryFilterOptions<T> & {
  parser?: (row: T) => any
  columns?: string[]
  order?: string[]
  joins?: string[]
  group?: string[]
  having?: string[]
  offset?: any
  sort?: MariaRepositorySortOrder
  limit?: number
}

export type MariaRepositoryInsertOptions<T> = MariaRepositoryQueryOptions & {
  entities?: Partial<T>[]
  ignore?: boolean
  duplicate?: (keyof T)[]
  returning?: string[]
}

export type MariaRepositoryUpdateOptions<T> = MariaRepositoryQueryOptions & MariaRepositoryFilterOptions<T> & {
  entity?: Partial<T>
}

export type IMariaRepository = IRepository & {
  query(query: string, values?: any, options?: any): Promise<any>
  
  getEntities<Entity, Filter>(options: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createEntities<Table = EntityTable, Response = any>(options: MariaRepositoryInsertOptions<Partial<Table>>): Promise<Response>
  updateEntities<Table = EntityTable, Response = any>(options: MariaRepositoryUpdateOptions<Partial<Table>>): Promise<Response> 
  deleteEntities<Table = EntityTable, Response = any>(options: MariaRepositoryUpdateOptions<Partial<Table>>): Promise<Response> 
  truncateEntities(table: string): Promise<any>

  parseEntityFilter(column: string, filter: any): string
}

export default class MariaRepository extends Repository implements IMariaRepository {

  async query(query: string, values?: any, options?: any) {
    const { connection } = options || {}

    const mariaDatabase = Container.get(MariaDatabaseToken)
    const mariaConnection = connection ?? mariaDatabase

    return mariaConnection.query(query, values)
  }

  async truncateEntities(table: string): Promise<any> {
    return this.query(`TRUNCATE TABLE ${table}`)
  }

  async getEntities<Entity, Filter>(options: MariaRepositorySelectOptions<Filter>): Promise<Entity[]> {
    let {
      connection,
      parser = (row: any) => new Entity(row),
    } = options || {}

    const { query, values } = this.getSelectQuery<Filter>(options)

    const rows = await this.query(query, values, { connection })
    return rows.map(parser)
  }

  async createEntities<Table = EntityTable, Response = any>(options: MariaRepositoryInsertOptions<Table>): Promise<Response> {
    let {
      connection,
    } = options || {}

    const query = this.getInsertQuery(options)
    return this.query(query, undefined, { connection })
  }

  async updateEntities<Table = EntityTable, Response = any>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response> {
    let {
      connection,
    } = options || {}

    const { query, values } = this.getUpdateQuery(options)
    return this.query(query, values, { connection })
  }

  async deleteEntities<Table = EntityTable, Response = any>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response> {
    let {
      connection,
    } = options || {}

    const { query, values } = this.getDeleteQuery(options)
    return this.query(query, values, { connection })
  }

  private getQueryFilter<T = {}>({ filter, where }: MariaRepositoryFilterOptions<T>): { filter: string, values: any[] } {
    let queryWheres: string[] = [`1 = 1`]
    let queryValues: any[] = []

    if (filter) {
      Object.entries(filter).map(([column, filter]: [string, any]) => {
        const filterWhere = this.parseEntityFilter(column, filter)
        // const [filterWhere, filterValues] = this.parseEntityFilter(column, filter as any)

        queryWheres.push(filterWhere)
        // queryValues.push(...filterValues)
      })
    }

    if (where && where.length) queryWheres = queryWheres.concat(where)

    return {
      filter: queryWheres.join(' AND '),
      values: queryValues
    }
  }

  private getSelectQuery<Columns>(options: MariaRepositorySelectOptions<Columns>): { values: any[], query: string } {
    let {
      columns,
      filter,
      joins,
      where,
      order,
      table,
      group,
      having,
      limit,
    } = options

    const {
      filter: queryFilter,
      values: queryValues
    } = this.getQueryFilter<Columns>({ filter, where })

    const query = ` SELECT ${columns?.length ? columns.join(',') : '*'}
                    FROM   ${table}
                           ${joins?.length ? joins.join(' ') : ''}
                    WHERE  ${queryFilter}
                    ${group?.length ? `GROUP BY ${group.join(',')}` : ''}
                    ${having?.length ? `HAVING ${having.join(',')}` : ''}
                    ORDER BY ${order ? order.join(',') : `1 asc`}
                    ${limit ? `LIMIT ${limit}` : ''}`

    return {
      values: queryValues,
      query
    }
  }

  private getInsertQuery<Table = EntityTable>(options: MariaRepositoryInsertOptions<Table>): string {
    const {
      table,
      ignore,
      returning,
      duplicate,
      entities = [],
    } = options

    if (!entities) throw new Error(`missing insert entities`)

    const columns = Object.keys(entities[0] || {})
    const rows = entities.map(entity => Object.values(entity || {}))

    const duplicationColumns = duplicate?.map((column: any) => `${column} = VALUES(${column})`)

    const query = `INSERT ${ignore ? 'IGNORE' : ''} INTO
                   ${table} (${columns.join(',')})
                   VALUES ${escape(rows)}
                   ${duplicate && duplicationColumns ? `ON DUPLICATE KEY UPDATE ` + duplicationColumns.join(',') : ''}
                   ${returning ? `RETURNING ` + returning.join(',') : ''}`

    return query
  }

  private getUpdateQuery<Table = EntityTable>(options: MariaRepositoryUpdateOptions<Table>): { values: any[], query: string } {
    const {
      table,
      entity = {},
      filter,
      where,
    } = options

    const {
      filter: queryFilter,
      values: queryValues
    } = this.getQueryFilter<Table>({ filter, where })

    const updateColumns: string[] = []
    const updateValues: any[] = []

    Object.entries(entity || {}).forEach(([column, value]) => {
      const [updateColumn, updateValue] = this.parseEntityFilter(column, value)

      updateColumns.push(updateColumn)
      updateValues.push(...updateValue)
    })
    
    const query = `UPDATE ${table} SET ${updateColumns.join(',')} WHERE ${queryFilter}`

    return {
      values: [...updateValues, ...queryValues],
      query: query
    }
  }

  private getDeleteQuery<Table = EntityTable>(options: MariaRepositoryUpdateOptions<Table>): { values: any[], query: string } {
    const {
      table,
      entity = {},
      filter,
      where,
    } = options

    const {
      filter: queryFilter,
      values: queryValues
    } = this.getQueryFilter<Table>({ filter, where })

    const query = `DELETE FROM ${table} WHERE ${queryFilter}`

    return {
      values: [...Object.values(entity || {}), ...queryValues],
      query: query
    }
  }

  // private parseEntityFilter(column: string, filter: any): [string, any] {
  parseEntityFilter(column: string, filter: any): string {
    const [action, value] = Array.isArray(filter) ? filter : [EntityFilterMethod.EQUAL, [filter]]

    column = escapeId(column)

    switch (action) {

      case EntityFilterMethod.RAW:
        return `${column} = ${value}`
        // return [`${column} = ${value}`, []]

      case EntityFilterMethod.EQUAL_NULL:
        return `${column} IS NULL`
        // return [`${column} IS NULL`, []]

      case EntityFilterMethod.NOT_EQUAL_NULL:
        return `${column} IS NOT NULL`
        // return [`${column} IS NOT NULL`, []]

      case EntityFilterMethod.EQUAL:
        return `${column} = ${escape(value)}`
        // return [`${column} = ?`, value]

      case EntityFilterMethod.NOT_EQUAL:
        return `${column} != ${escape(value)}`
        // return [`${column} != ?`, value]

      case EntityFilterMethod.GREATER:
        return `${column} > ${escape(value)}`
        // return [`${column} > ?`, value]

      case EntityFilterMethod.GREATER_EQUAL:
        return `${column} >= ${escape(value)}`
        // return [`${column} >= ?`, value]

      case EntityFilterMethod.LESS:
        return `${column} < ${escape(value)}`
        // return [`${column} < ?`, value]

      case EntityFilterMethod.LESS_EQUAL:
        return `${column} <= ${escape(value)}`
        // return [`${column} <= ?`, value]

      case EntityFilterMethod.IN:
        return `${column} IN (${escape(value)})`
        // return [`${column} IN (?)`, [value]]

      case EntityFilterMethod.LIKE:
        return `${column} LIKE ${escape(value)}`
        // return [`${column} LIKE ?`, value]

      case EntityFilterMethod.BETWEEN:
        return `${column} BETWEEN ${escape(value[0])} AND ${escape(value[1])}`
        // return [`${column} BETWEEN ? AND ?`, value]
    }

    throw new Error(`unknown filter action`)
  }

}