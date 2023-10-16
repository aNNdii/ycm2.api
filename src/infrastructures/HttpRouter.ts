import { RateLimiterAbstract, RateLimiterRes } from "rate-limiter-flexible"
import KoaRouter, { RouterContext as KoaRouterContext } from "koa-router"
import { randomUUID } from "crypto"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"

import { HttpRouterContext, IHttpRouterContext } from "../entities/HttpRouterContext"
import { HttpRouterError } from "../entities/HttpRouterError"

import { Token } from "./Container"
import { Logger } from "./Logger"

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

export type HttpRouterOptions = {
  router: KoaRouter
  rateLimiter: RateLimiterAbstract
}

export type IHttpRouter = {
  get(path: string, handler: HttpRouterHandler): void
  post(path: string, handler: HttpRouterHandler): void
  patch(path: string, handler: HttpRouterHandler): void
  delete(path: string, handler: HttpRouterHandler): void
}

export class HttpRouter extends Logger implements IHttpRouter {

  private router: KoaRouter
  private rateLimiter: RateLimiterAbstract

  private requestCount = 0

  constructor(private options: HttpRouterOptions) {
    super()

    this.router = options.router
    this.rateLimiter = options.rateLimiter
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

        await this.rateLimiter.consume(context.ip)
        await handler(context)

      } catch (e: Error | HttpRouterError | any) {
        const isApiError = e instanceof HttpRouterError
        const isRateLimitError = e instanceof RateLimiterRes

        const status = isApiError ? e.code : isRateLimitError ? HttpStatusCode.TOO_MANY_REQUESTS : HttpStatusCode.INTERNAL_SERVER_ERROR
        const message = isApiError ? e.message : isRateLimitError ? HttpStatusCode[HttpStatusCode.TOO_MANY_REQUESTS].toLowerCase() : HttpStatusCode[HttpStatusCode.INTERNAL_SERVER_ERROR].toLowerCase()

        context.setResponse({ status, error: { status, message } })

        this.log("requestError", { status, message })
        if (!isApiError && !isRateLimitError) console.error(e)
      }

      this.requestCount--

      const responseTime = Date.now() - requestStart

      context.setHeader(`X-Request-Id`, requestId)
      context.setHeader(`X-Response-Time`, `${responseTime}ms`)

      this.log("requestEnd", { id: requestId, ip: context.ip, method: ctx.method, url: ctx.url, duration: responseTime, status: ctx.status, activeRequests: this.requestCount })

    })

  }

}
