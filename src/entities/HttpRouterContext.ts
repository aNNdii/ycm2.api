import { RouterContext as KoaRouterContext } from "koa-router"

import { Container } from "../infrastructures/Container"

import { AuthenticationTokenType } from "../interfaces/Auth"
import { ErrorMessage } from "../interfaces/ErrorMessage"
import { HttpStatusCode } from "../interfaces/HttpStatusCode"

import { DataLoaderService, IDataLoaderService } from "../services/DataLoaderService"
import { AuthServiceToken } from "../services/AuthService"

import { HttpRouterError }  from "./HttpRouterError"
import { IAuth } from "./Auth"

export enum AuthenticationScheme {
  BASIC = "basic",
  BEARER = "bearer"
}

export type HttpRouterContextResponse = {
  status?: HttpStatusCode
  error?: any
  data?: any
}

export type HttpRouterConstructor<T extends KoaRouterContext = KoaRouterContext> = {
  context: T
}

export type IHttpRouterContext = {
  dataLoaderService: IDataLoaderService

  method: string
  ip: string
  url: string
  headers: any
  parameters: any
  query: any
  body: any

  getHeader(key: string): string
  setHeader(key: string, value: string): void

  setResponse(response: HttpRouterContextResponse): void
  setStatus(status: HttpStatusCode | number): void
  setBody(body: any): void

  getAuth(): IAuth

  getAuthenticationScheme(): string

  getBasicAuthentication(): { username: string, password: string }
  getBearerAuthenticationToken(): string
  
}

export class HttpRouterContext<T extends KoaRouterContext = KoaRouterContext> implements IHttpRouterContext {

  private context: T

  public dataLoaderService: IDataLoaderService

  constructor(options: HttpRouterConstructor<T>) {
    const { context } = options

    this.context = context
    this.dataLoaderService = new DataLoaderService()
  }

  get url() {
    return this.context.url
  }

  get method() {
    return this.context.method
  }

  get body() {
    // @ts-ignore
    return this.context.request.body || {}
  }

  get parameters() {
    return this.context.params
  }

  get headers() {
    return this.context.headers
  }

  get query() {
    return this.context.query
  }

  get ip() {
    return (this.headers["X-Forwarded-For"] || this.context.ip)?.toString()
  }

  setResponse(response: HttpRouterContextResponse) {
    const { status = HttpStatusCode.OK, data, error } = response || {}

    this.setBody({ data, error })
    this.setStatus(status)
  }

  setStatus(status: HttpStatusCode | number) {
    this.context.status = status
  }

  setBody(body: any) {
    this.context.body = body
  }

  setHeader(key: string, value: string) {
    this.context.set(key, value)
  }

  getHeader(key: string): string {
    if (this.context.get) return this.context.get(key)

    return this.context.request.headers[key.toLowerCase()] as string
  }

  getAuth() {
    const token = this.getBearerAuthenticationToken()

    const authService = Container.get(AuthServiceToken)
    const auth = authService.getAuthByToken(token, { types: [AuthenticationTokenType.ACCESS] })

    return auth
  }

  getAuthenticationScheme() {
    const [scheme] = this.getHeader('Authorization')?.split(' ')
    return scheme?.toLowerCase()
  }

  getBasicAuthentication() {
    const authorization = this.getHeader('Authorization')
    if (!authorization) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.AUTH_NOT_FOUND)

    const [scheme, b64auth] = authorization.split(' ')
    const [username, password] = Buffer.from(b64auth || '', 'base64').toString().split(':')

    return { username, password }
  }

  getBearerAuthenticationToken() {
    const authorization = this.getHeader('Authorization')
    if (!authorization) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.AUTH_NOT_FOUND)

    const match = authorization.match(/^Bearer ([a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.?[a-zA-Z0-9\-_]*)$/)
    if (!match) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.AUTH_INVALID_TOKEN)

    return match[1]
  }

}