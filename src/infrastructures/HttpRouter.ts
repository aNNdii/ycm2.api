import KoaRouter, { RouterContext as KoaRouterContext } from "koa-router"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"

import HttpRouterContext, { IHttpRouterContext } from "../entities/HttpRouterContext"
import HttpRouterError from "../entities/HttpRouterError"

import { Token } from "./Container"
import Logger from "./Logger"
import { randomUUID } from "crypto"

export const HttpRouterToken = new Token<IHttpRouter>("HttpRouter")

export enum HttpRouterMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete",
}

export type HttpRouterResponse = {
  status?: HttpStatusCode
  data?: any
}

export type HttpRouterHandler = (context: IHttpRouterContext) => Promise<void>

export type HttpRouterOptions<T> = {
  router: T
  onError?: (error: Error) => void
}

export type IHttpRouter = {
  get(path: string, handler: HttpRouterHandler): void
  post(path: string, handler: HttpRouterHandler): void
  patch(path: string, handler: HttpRouterHandler): void
  delete(path: string, handler: HttpRouterHandler): void
}

export default class HttpRouter<T extends KoaRouter = KoaRouter> extends Logger implements IHttpRouter {

  private router: T
  private requestCount = 0

  constructor(private options: HttpRouterOptions<T>) {
    super()
    this.router = options.router
  }

  get(path: string, handler: HttpRouterHandler) {
    return this.handle(HttpRouterMethod.GET, path, handler)
  }

  post(path: string, handler: HttpRouterHandler) {
    return this.handle(HttpRouterMethod.POST, path, handler)
  }

  patch(path: string, handler: HttpRouterHandler) {
    return this.handle(HttpRouterMethod.PATCH, path, handler)
  }

  delete(path: string, handler: HttpRouterHandler) {
    return this.handle(HttpRouterMethod.DELETE, path, handler)
  }

  private handle(method: HttpRouterMethod, path: string, handler: HttpRouterHandler) {
    this.log("createRoute", { method, path })

    this.router[method](path, async (ctx: KoaRouterContext) => {
      const requestStart = Date.now()
      const requestId = randomUUID()

      const context = new HttpRouterContext({ context: ctx })

      this.requestCount++

      try {
        this.log("requestStart", { id: requestId, ip: context.ip, method: ctx.method, url: ctx.url, activeRequests: this.requestCount })
        await handler(context)

      } catch (e: Error | HttpRouterError | any) {
        const isApiError = e instanceof HttpRouterError

        const status = isApiError ? e.code : HttpStatusCode.INTERNAL_SERVER_ERROR
        const message = isApiError ? e.message : HttpStatusCode[HttpStatusCode.INTERNAL_SERVER_ERROR].toLowerCase()

        context.setResponse({ status, error: { status, message } })
        
        this.log("requestError", { status, message })
        if (!isApiError) console.error(e)
      }

      this.requestCount--

      const responseTime = Date.now() - requestStart

      context.setHeader(`X-Request-Id`, requestId)
      context.setHeader(`X-Response-Time`, `${responseTime}ms`)

      this.log("requestEnd", { id: requestId, ip: context.ip, method: ctx.method, url: ctx.url, duration: responseTime, status: ctx.status, activeRequests: this.requestCount })

    })

  }

}
