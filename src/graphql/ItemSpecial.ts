import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { ItemSpecialType } from "../interfaces/Item";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IItem } from "../entities/Item";

import { GraphQLItemSpecialAction } from "./ItemSpecialAction";


export const GraphQLItemSpecial: GraphQLObjectType = new GraphQLObjectType({
  name: 'ItemSpecial',
  fields: () => ({
    type: {
      type: GraphQLString,
      resolve: (item: IItem) => ItemSpecialType[item.specialTypeId]?.toLowerCase()
    },
    effect: {
      type: GraphQLString,
      resolve: (item: IItem) => item.specialEffect
    },
    actions: {
      type: new GraphQLList(GraphQLItemSpecialAction),
      resolve: (item: IItem, args: any, context: IGraphQLContext) => context.dataLoaderService.getItemSpecialActionsByParentItemId(item.id)
    }
  })
})