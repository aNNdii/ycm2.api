import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { LocaleControllerToken } from "../controllers/LocaleController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { ILocale } from "../entities/Locale";

import { GraphQLLocaleItem } from "./LocaleItem";
import { GraphQLLocaleMob } from "./LocaleMob";


export const GraphQLLocale: GraphQLObjectType = new GraphQLObjectType({
  name: 'Locale',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (locale: ILocale) => locale.hashId
    },
    code: {
      type: GraphQLString,
      resolve: (locale: ILocale) => locale.code
    },
    name: {
      type: GraphQLString,
      resolve: (locale: ILocale) => locale.name
    },
    items: {
      type: new GraphQLList(GraphQLLocaleItem),
      args: {
        ...getPaginationArguments()
      },
      resolve: (locale: ILocale, args: any, context: IGraphQLContext) => {
        const localeController = Container.get(LocaleControllerToken)

        return localeController.getLocaleItems({
          ...args,
          localeId: locale.id,
        }, context)
      }
    },
    mobs: {
      type: new GraphQLList(GraphQLLocaleMob),
      args: {
        ...getPaginationArguments()
      },
      resolve: (locale: ILocale, args: any, context: IGraphQLContext) => {
        const localeController = Container.get(LocaleControllerToken)

        return localeController.getLocaleMobs({
          ...args,
          localeId: locale.id,
        }, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (locale: ILocale) => new Date(locale.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (locale: ILocale) => new Date(locale.modifiedDate).toISOString()
    }
  })
})