import { HttpRouterHandler, HttpRouterToken } from "../infrastructures/HttpRouter"
import { Container } from "../infrastructures/Container"
import { Logger } from "../infrastructures/Logger"

export type IController = {
  init(): void
}

export class Controller extends Logger implements IController {

  init() { }

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
    return router.patch(path, handler)
  }

  protected delete(path: string, handler: HttpRouterHandler) {
    const router = Container.get(HttpRouterToken)
    return router.delete(path, handler)
  }

}