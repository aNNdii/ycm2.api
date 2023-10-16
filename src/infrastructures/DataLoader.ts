import ExpiryMap from "expiry-map"
import CoreDataLoader from "dataloader"

import { isObject } from "../helpers/Object"

import { Logger } from "./Logger"

const getDataLoaderCacheKey = (key: any) => isObject(key) ? JSON.stringify(key) : key

export type DataLoaderOptions = {
  batch?: boolean
  ttl?: number
}

export type IDataLoader<Key = any, Value = any> = {
  load(key: Key): Promise<Value>
}

export class DataLoader<Key = any, Value = any> extends Logger implements IDataLoader<Key, Value> {

  private readonly loader: CoreDataLoader<any, any>;

  constructor(func: (k: Key) => Promise<Value>, options?: DataLoaderOptions) {
    super()
    
    this.loader = new CoreDataLoader(
      (options?.batch ? async (options: any) => func(options) as Promise<any> : async ([options]: any) => [func(options)]),
      {
        batch: options?.batch || false,
        cacheKeyFn: getDataLoaderCacheKey,
        cacheMap: options?.ttl ? new ExpiryMap(options.ttl * 1000) : null
      }
    )
  }

  load(key: Key): Promise<Value> {
    return this.loader.load(key)
  }

}

