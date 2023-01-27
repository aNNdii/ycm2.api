import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { MobRank } from "../interfaces/Mob";

import { ItemControllerToken } from "../controllers/ItemController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMobRankItem } from "../entities/MobRankItem";

import GraphQLItem from "./Item";
import GraphQLMob from "./Mob";
import { MobControllerToken } from "../controllers/MobController";
import { getPaginationArguments } from "../helpers/GraphQL";

const GraphQLMobRankItem: GraphQLObjectType = new GraphQLObjectType({
  name: 'MobRankItem',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (mobRankItem: IMobRankItem) => mobRankItem.hashId
    },
    item: {
      type: GraphQLItem,
      resolve: (mobRankItem: IMobRankItem, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return itemController.getItemById(mobRankItem.itemId, context)
      }
    },
    mobs: {
      type: new GraphQLList(GraphQLMob),
      args: {
        ...getPaginationArguments()
      },
      resolve: (mobRankItem: IMobRankItem, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobs({
          ...args,
          rankId: mobRankItem.mobRankId
        }, context)
      }
    },
    mobRank: {
      type: GraphQLString,
      resolve: (mobRankItem: IMobRankItem) => MobRank[mobRankItem.mobRankId]?.toLowerCase()
    },
    minLevel: {
      type: GraphQLInt,
      resolve: (mobRankItem: IMobRankItem) => mobRankItem.minLevel
    },
    maxLevel: {
      type: GraphQLInt,
      resolve: (mobRankItem: IMobRankItem) => mobRankItem.maxLevel
    },
    probability: {
      type: GraphQLFloat,
      resolve: (mobRankItem: IMobRankItem) => mobRankItem.probability
    },
    createdDate: {
      type: GraphQLString,
      resolve: (mobRankItem: IMobRankItem) => new Date(mobRankItem.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (mobRankItem: IMobRankItem) => new Date(mobRankItem.modifiedDate).toISOString()
    }
  })  
})

export default GraphQLMobRankItem