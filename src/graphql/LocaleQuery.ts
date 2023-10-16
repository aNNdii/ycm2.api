import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import { Container } from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { LocaleControllerToken } from "../controllers/LocaleController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { GraphQLLocale } from "./Locale";


export const GraphQLLocaleQuery = {
  locale: {
    type: GraphQLLocale,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id } = args || {}

      const localeController = Container.get(LocaleControllerToken)
      return localeController.getLocaleByHashId(id, context)
    }
  },
  locales: {
    type: new GraphQLList(GraphQLLocale),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const localeController = Container.get(LocaleControllerToken)
      return localeController.getLocales(args, context)
    }
  }
}
