import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { ItemAttribute, ItemSpecialActionType } from "../interfaces/Item";

import { IItemSpecialAction } from "../entities/ItemSpecialAction";
import { IGraphQLContext } from "../entities/GraphQLContext";

import { ItemControllerToken } from "../controllers/ItemController";
import { MobControllerToken } from "../controllers/MobController";

import { GraphQLMobGroup } from "./MobGroup";
import { GraphQLItem } from "./Item";
import { GraphQLMob } from "./Mob";


export const GraphQLItemSpecialAction: GraphQLObjectType = new GraphQLObjectType({
  name: 'ItemSpecialAction',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (action: IItemSpecialAction) => action.hashId
    },
    type: {
      type: GraphQLString,
      resolve: (action: IItemSpecialAction) => ItemSpecialActionType[action.typeId]?.toLowerCase()
    },
    parentItem: {
      type: GraphQLItem,
      resolve: (action: IItemSpecialAction, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return itemController.getItemById(action.parentItemId, context)
      }
    },
    item: {
      type: GraphQLItem,
      resolve: (action: IItemSpecialAction, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return action.itemId ? itemController.getItemById(action.itemId, context) : null
      }
    },
    mob: {
      type: GraphQLMob,
      resolve: (action: IItemSpecialAction, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return action.mobId ? mobController.getMobById(action.mobId, context) : null
      }
    },
    mobGroup: {
      type: GraphQLMobGroup,
      resolve: (action: IItemSpecialAction, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return action.mobGroupId ? mobController.getMobGroupById(action.mobGroupId, context) : null
      }
    },
    attribute: {
      type: GraphQLString,
      resolve: (action: IItemSpecialAction) => ItemAttribute[action.attributeId]?.toLowerCase()
    },
    quantity: {
      type: GraphQLInt,
      resolve: (action: IItemSpecialAction) => action.quantity
    },
    probability: {
      type: GraphQLInt,
      resolve: (action: IItemSpecialAction) => action.probability
    },
    rareProbability: {
      type: GraphQLInt,
      resolve: (action: IItemSpecialAction) => action.rareProbability
    },
    createdDate: {
      type: GraphQLString,
      resolve: (action: IItemSpecialAction) => new Date(action.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (action: IItemSpecialAction) => new Date(action.modifiedDate).toISOString()
    }
  })
})