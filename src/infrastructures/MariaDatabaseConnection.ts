import { FieldInfo, PoolConnection, TypeCastNextFunction } from "mariadb";

import { Logger } from "./Logger";

const COLUMN_TYPE_BIT = 16

export type IMariaDatabaseConnection = {
  query(query: string, values?: any): Promise<any>
  release(): Promise<void>
}

export class MariaDatabaseConnection extends Logger implements IMariaDatabaseConnection {

  constructor(private connection: PoolConnection) {
    super(`MariaDatabaseConnection:${connection.threadId}`)
  }

  async query(query: string, values?: any): Promise<any> {
    let result = null

    try {

      const queryStart = Date.now()
      
      result = await this.connection.query({
        typeCast: this.queryTypeCaster.bind(this),
        sql: query
      }, values)

      this.log("query", { query: query.replace(/\s+/g, " ").trim(), values, duration: Date.now() - queryStart })

    } catch (e) {
      console.error(e, query, values)
      throw e
    }

    return result
  }

  release(): Promise<void> {
    this.log("release")
    return this.connection.release()
  }

  private queryTypeCaster(column: FieldInfo, next: TypeCastNextFunction) {
    if (column.columnType === COLUMN_TYPE_BIT && column.columnLength === 1) {
      const bytes = column.buffer()
      return bytes ? bytes[0] : 0
    }
    return next()
  }

}

