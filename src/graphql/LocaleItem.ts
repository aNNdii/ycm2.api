import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { ItemControllerToken } from "../controllers/ItemController";
import { LocaleControllerToken } from "../controllers/LocaleController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { ILocaleItem } from "../entities/LocaleItem";

import { GraphQLLocale } from "./Locale";
import { GraphQLItem } from "./Item";


export const GraphQLLocaleItem: GraphQLObjectType = new GraphQLObjectType({
  name: 'LocaleItem',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (item: ILocaleItem) => item.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (item: ILocaleItem) => item.name
    },
    description: {
      type: GraphQLString,
      resolve: (item: ILocaleItem) => item.description
    },
    category: {
      type: GraphQLString,
      resolve: (item: ILocaleItem) => item.category
    },
    locale: {
      type: GraphQLLocale,
      resolve: (item: ILocaleItem, args: any, context: IGraphQLContext) => {
        const localeController = Container.get(LocaleControllerToken)
        return localeController.getLocaleById(item.localeId, context)
      }
    },
    item: {
      type: GraphQLItem,
      resolve: (item: ILocaleItem, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return itemController.getItemById(item.itemId, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (item: ILocaleItem) => new Date(item.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (item: ILocaleItem) => new Date(item.modifiedDate).toISOString()
    }
  })
})