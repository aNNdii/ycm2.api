import { ApolloServer } from "@apollo/server"
import { parse } from "url"

import { ErrorMessage } from "../interfaces/ErrorMessage"
import { HttpStatusCode } from "../interfaces/HttpStatusCode"

import { IHttpRouterContext } from "../entities/HttpRouterContext"
import { IGraphQLContext } from "../entities/GraphQLContext"
import HttpRouterError from "../entities/HttpRouterError"

import { Token } from "./Container"
import Logger from "./Logger"

export const GraphQLServerToken = new Token<IGraphQLServer>("GraphQLServer")

export type GraphQLServerOptions = {
  server: ApolloServer<IGraphQLContext>
}

export type IGraphQLServer = {
  handle(context: IHttpRouterContext): Promise<{ status: HttpStatusCode | number, headers: any, body: any }>
}

export default class GraphQLServer extends Logger implements IGraphQLServer {

  private server: ApolloServer<IGraphQLContext>

  constructor(private options: GraphQLServerOptions) {
    super()
    this.server = options.server
  }

  async handle(context: IHttpRouterContext) {

    const { query, variables = {} } = context.body

    this.log("request", { query: query?.replace(/\s+/g, " ").trim(), variables })

    const { body, headers, status = HttpStatusCode.OK } = await this.server.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: context.method,
        headers: this.getRequestHeaders(context) as any,
        search: parse(context.url).search ?? '',
        body: context.body
      },
      context: async () => context
    })

    if (body.kind !== 'complete') throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INTERNAL_GRAPHQL_ERROR)

    return { status, headers, body: body.string }
  }

  private getRequestHeaders(context: IHttpRouterContext) {
    const headers = new Map<string, string>()

    for (const [key, value] of Object.entries(context.headers)) {
      if (value === undefined) continue
      headers.set(key, Array.isArray(value) ? value.join(', ') : (value as string))
    }

    return headers
  }

}