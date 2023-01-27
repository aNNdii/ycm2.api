import { GraphQLServerToken } from "../infrastructures/GraphQLServer";
import Container, { Token } from "../infrastructures/Container";

import { IHttpRouterContext } from "../entities/HttpRouterContext";

import Controller, { IController } from "./Controller";

export const GraphQLControllerToken = new Token<IGraphQLController>("GraphQLController")

export type IGraphQLController = IController & {}

export default class GraphQLController extends Controller implements IGraphQLController {

  init() {
    this.get('/graphql', this.handleGraphQLRequest.bind(this))
    this.post('/graphql', this.handleGraphQLRequest.bind(this))
  }

  async handleGraphQLRequest(context: IHttpRouterContext) {
    const graphQLServer = Container.get(GraphQLServerToken)

    const { body, headers, status } = await graphQLServer.handle(context)

    for (const [key, value] of headers) context.setHeader(key, value)

    context.setStatus(status)
    context.setBody(body)
  }

}