import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { getFlagsByFlagId } from "../helpers/Game";

import { ItemAntiFlag, ItemFlag, ItemImmuneFlag, ItemLimitType, ItemMaskType, ItemMaskTypeSubTypes, ItemType, ItemTypeSubTypes, ItemWearFlag } from "../interfaces/Item";
import { Authorization } from "../interfaces/Auth";

import { ItemControllerToken } from "../controllers/ItemController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IItem } from "../entities/Item";

import GraphQLCharacterItemAttribute from "./CharacterItemAttribute";
import GraphQLLocaleItem from "./LocaleItem";
import GraphQLItemSource from "./ItemSource";

const GraphQLItem: GraphQLObjectType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (item: IItem) => item.id
    },
    name: {
      type: GraphQLString,
      args: {
        locale: { type: GraphQLBoolean }
      },
      resolve: (item: IItem, args: any) => {
        const { locale } = args || {}
        return locale ? item.localeName : item.name
      }
    },
    type: {
      type: GraphQLString,
      resolve: (item: IItem) => ItemType[item.typeId]?.toLowerCase()
    },
    subType: {
      type: GraphQLString,
      resolve: (item: IItem) => {
        const typeSubTypes = ItemTypeSubTypes[item.typeId] || {} as any
        return typeSubTypes[item.subTypeId]?.toLowerCase()
      }
    },
    locales: {
      type: new GraphQLList(GraphQLLocaleItem),
      resolve: (item: IItem, args: any, context: IGraphQLContext) => {
        return context.dataLoaderService.getLocaleItemsByItemId(item.id)
      }
    },
    size: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.size
    },
    flags: {
      type: new GraphQLList(GraphQLString),
      resolve: (item: IItem) => getFlagsByFlagId(ItemFlag, item.flagId).map(f => f.toLowerCase())
    },
    antiFlags: {
      type: new GraphQLList(GraphQLString),
      resolve: (item: IItem) => getFlagsByFlagId(ItemAntiFlag, item.antiFlagId).map(f => f.toLowerCase())
    },
    wearFlags: {
      type: new GraphQLList(GraphQLString),
      resolve: (item: IItem) => getFlagsByFlagId(ItemWearFlag, item.wearFlagId).map(f => f.toLowerCase())
    },
    immuneFlags: {
      type: new GraphQLList(GraphQLString),
      resolve: (item: IItem) => getFlagsByFlagId(ItemImmuneFlag, item.immuneFlagId).map(f => f.toLowerCase())
    },
    buyPrice: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.buyPrice
    },
    sellPrice: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.sellPrice
    },
    refineId: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.refineId
    },
    refineItem: {
      type: GraphQLItem,
      resolve: (item: IItem, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return item.refineItemId ? itemController.getItemById(item.refineItemId, context) : null
      }
    },
    attributeChance: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.attributeChance
    },
    rareAttributeItem: {
      type: GraphQLItem,
      resolve: (item: IItem, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return item.rareAttributeItemId ? itemController.getItemById(item.rareAttributeItemId, context) : null
      }
    },
    limits: {
      type: new GraphQLList(GraphQLCharacterItemAttribute),
      resolve: (item: IItem) => ([
        { type: ItemLimitType[item.limitType0].toLowerCase(), value: item.limitValue0 },
        { type: ItemLimitType[item.limitType1].toLowerCase(), value: item.limitValue1 }
      ])
    },
    attributes: {
      type: new GraphQLList(GraphQLCharacterItemAttribute),
      resolve: (item: IItem) => ([
        { attributeId: item.attributeId0, value: item.attributeValue0 },
        { attributeId: item.attributeId1, value: item.attributeValue1 },
        { attributeId: item.attributeId2, value: item.attributeValue2 },
        { attributeId: item.attributeId3, value: item.attributeValue3 },
      ])
    },
    values: {
      type: new GraphQLList(GraphQLInt),
      resolve: (item: IItem) => ([
        item.value0,
        item.value1,
        item.value2,
        item.value3,
        item.value4,
        item.value5,
      ])
    },
    sockets: {
      type: new GraphQLList(GraphQLInt),
      resolve: (item: IItem) => ([
        item.socket0,
        item.socket1,
        item.socket2,
        item.socket3,
        item.socket4,
        item.socket5,
      ])
    },
    specularPercent: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.specularPercent
    },
    socketCount: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.socketCount
    },
    attributeType: {
      type: GraphQLInt,
      resolve: (item: IItem) => item.attributeType
    },
    icon: {
      type: GraphQLString,
      resolve: (item: IItem, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.ITEMS_READ)

        return item.icon
      }
    },
    model: {
      type: GraphQLString,
      resolve: (item: IItem, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.ITEMS_READ)

        return item.model
      }
    },
    maskType: {
      type: GraphQLString,
      resolve: (item: IItem) => ItemMaskType[item.maskTypeId]?.toLowerCase()
    },
    maskSubType: {
      type: GraphQLString,
      resolve: (item: IItem) => {
        const maskTypeSubTypes = ItemMaskTypeSubTypes[item.maskTypeId] || {} as any
        return maskTypeSubTypes[item.maskSubTypeId]?.toLowerCase()
      }
    },
    source: {
      type: GraphQLItemSource,
      resolve: (item: IItem) => item
    },
    createdDate: {
      type: GraphQLString,
      resolve: (item: IItem) => item.createdDate
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (item: IItem) => item.modifiedDate
    }
  })
})

export default GraphQLItem