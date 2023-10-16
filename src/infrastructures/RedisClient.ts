import Redis from "ioredis"

import { Token } from "./Container"
import { Logger } from "./Logger"

export const RedisClientToken = new Token<IRedisClient>("RedisClient")

export type RedisSetOptions = {
  ttl?: number
}

export type RedisClientOptions = {
  client: Redis
}

export type IRedisClient = {
  get(key: string): Promise<string | null>
  set(key: string, value: string | Buffer, options?: RedisSetOptions): Promise<any>
}

export class RedisClient extends Logger implements IRedisClient {
  
  client: Redis

  constructor(private options: RedisClientOptions) {
    super()
    this.client = options.client
  }

  get(key: string) {
    return this.client.get(key)
  }

  set(key: string, value: string | Buffer, options?: RedisSetOptions) {
    const {
      ttl
    } = options || {}

    return ttl ? this.client.set(key, value, "EX", ttl) : this.client.set(key, value)
  }

}