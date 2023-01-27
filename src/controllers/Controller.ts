import { HttpRouterHandler, HttpRouterToken } from "../infrastructures/HttpRouter"
import { IDataLoader } from "../infrastructures/DataLoader"
import Container from "../infrastructures/Container"
import Logger from "../infrastructures/Logger"
import DataLoader from "dataloader"

export type IController = {
  init(): void
}

export default class Controller extends Logger implements IController {

  private loaders: { [key: string]: IDataLoader } = {}

  init() {}

  protected get(path: string, handler: HttpRouterHandler) {
    const router = Container.get(HttpRouterToken)
    return router.get(path, handler)
  }

  protected post(path: string, handler: HttpRouterHandler) {
    const router = Container.get(HttpRouterToken)
    return router.post(path, handler)
  }

  protected patch(path: string, handler: HttpRouterHandler) {
    const router = Container.get(HttpRouterToken)
    return router.get(path, handler)
  }

  protected delete(path: string, handler: HttpRouterHandler) {
    const router = Container.get(HttpRouterToken)
    return router.get(path, handler)
  }

}