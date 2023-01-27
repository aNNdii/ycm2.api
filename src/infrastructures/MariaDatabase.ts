import { Pool } from "mariadb"

import MariaDatabaseConnection, { IMariaDatabaseConnection } from "./MariaDatabaseConnection"
import { Token } from "./Container"
import Logger from "./Logger"

export const MariaDatabaseToken = new Token<IMariaDatabase>("MariaDatabase")

export type IMariaDatabase = {
  query(query: string, values?: any, options?: any): Promise<any>
  getConnection(): Promise<IMariaDatabaseConnection>
}

export type MariaDatabaseOptions = {
  pool: Pool
}

export default class MariaDatabase extends Logger implements IMariaDatabase {

  private pool: Pool

  constructor(options: MariaDatabaseOptions) {
    super()

    const { pool } = options
    this.pool = pool
  }

  async query(query: string, values?: any, options?: any): Promise<any> {
    let connection = null
    let result = null

    try {

      connection = options?.connection || await this.getConnection()
      result = await connection.query(query, values)

    } catch (e) {
      throw e
    } finally {
      options?.connection ? null : connection?.release()
    }

    return result
  }

  async getConnection(): Promise<IMariaDatabaseConnection> {
    const connection = await this.pool.getConnection()

    this.log("getConnection", {
      activeConnections: this.pool.activeConnections(),
      idleConnections: this.pool.idleConnections(),
      totalConnections: this.pool.totalConnections(),
    })

    return new MariaDatabaseConnection(connection)
  }

}