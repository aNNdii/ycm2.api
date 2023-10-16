import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { MobItemType } from "../interfaces/Mob";

import { ItemControllerToken } from "../controllers/ItemController";
import { MobControllerToken } from "../controllers/MobController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMobItem } from "../entities/MobItem";

import { GraphQLItem } from "./Item";
import { GraphQLMob } from "./Mob";


export const GraphQLMobItem: GraphQLObjectType = new GraphQLObjectType({
  name: 'MobItem',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (mobItem: IMobItem) => mobItem.hashId
    },
    type: {
      type: GraphQLString,
      resolve: (mobItem: IMobItem) => MobItemType[mobItem.typeId]?.toLowerCase()
    },
    mob: {
      type: GraphQLMob,
      resolve: (mobItem: IMobItem, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobById(mobItem.mobId, context)
      }
    },
    item: {
      type: GraphQLItem,
      resolve: (mobItem: IMobItem, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return itemController.getItemById(mobItem.itemId, context)
      }
    },
    quantity: {
      type: GraphQLInt,
      resolve: (mobItem: IMobItem) => mobItem.quantity
    },
    probability: {
      type: GraphQLFloat,
      resolve: (mobItem: IMobItem) => mobItem.probability
    },
    rareProbability: {
      type: GraphQLInt,
      resolve: (mobItem: IMobItem) => mobItem.rareProbability
    },
    createdDate: {
      type: GraphQLString,
      resolve: (mobItem: IMobItem) => new Date(mobItem.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (mobItem: IMobItem) => new Date(mobItem.modifiedDate).toISOString()
    }
  })
})
