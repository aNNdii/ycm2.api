import { Container } from "typedi"

export type IContainer = {
  set<T>(token: any, value: any): void
  get<T>(token: any, value: any): T
}

export { Token } from "typedi"
export default Container
