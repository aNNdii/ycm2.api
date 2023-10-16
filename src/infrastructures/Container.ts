export type IContainer = {
  set<T>(token: any, value: any): void
  get<T>(token: any, value: any): T
}

export { Container } from "typedi" 
export { Token } from "typedi"
