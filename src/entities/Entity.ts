
export type IEntity = {
  getCustomProperty(key: any): any
}

export default class Entity<T> implements IEntity {

  constructor(protected properties: T) {}

  getProperty<K extends keyof T>(key: K): any {
    return this.properties[key]
  }

  getCustomProperty(key: any): any {
    // @ts-ignore
    return this.properties[key]
  }

}