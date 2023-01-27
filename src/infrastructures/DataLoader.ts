import ExpiryMap from "expiry-map"
import CoreDataLoader from "dataloader"
import nodeObjectHash from "node-object-hash"

const nodeObjectHasher = nodeObjectHash({ sort: true, coerce: true });

const getDataLoaderCacheKey = (key: any) => {
  if (key && typeof key === 'object') return nodeObjectHasher.hash(key)
  return key
}

export type DataLoaderOptions = {
  batch?: boolean
  ttl?: number
}

export type IDataLoader<Key = any, Value = any> = {
  load(key: Key): Promise<Value>
}

export default class DataLoader<Key = any, Value = any> implements IDataLoader<Key, Value> {

  private readonly loader: CoreDataLoader<any, any>;

  constructor(func: (k: Key) => Promise<Value>, options?: DataLoaderOptions) {
    this.loader = new CoreDataLoader(
      (options?.batch ? async (options: any) => func(options) as Promise<any> : async ([options]: any) => [func(options)]),
      {
        batch: options?.batch || false,
        cacheKeyFn: getDataLoaderCacheKey,
        cacheMap: options?.ttl ? new ExpiryMap(options.ttl * 1000) : new Map()
      }
    )
  }

  load(key: Key): Promise<Value> {
    return this.loader.load(key)
  }

}

