import { GraphQLList, GraphQLObjectType } from "graphql";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IItem } from "../entities/Item";

import { GraphQLMobRankItem } from "./MobRankItem";
import { GraphQLMobItem } from "./MobItem";


export const GraphQLItemSource: GraphQLObjectType = new GraphQLObjectType({
  name: 'ItemSource',
  fields: () => ({
    mobs: {
      type: new GraphQLList(GraphQLMobItem),
      resolve: (item: IItem, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobItemsByItemId(item.id)
    },
    mobRanks: {
      type: new GraphQLList(GraphQLMobRankItem),
      resolve: (item: IItem, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobRankItemsByItemId(item.id)
    }
  })
})