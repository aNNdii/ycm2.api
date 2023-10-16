import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from "graphql";

import { ItemAttribute } from "../interfaces/Item";

import { IItemAttribute } from "../entities/ItemAttribute";


export const GraphQLItemAttribute: GraphQLObjectType = new GraphQLObjectType({
  name: 'ItemAttribute',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (attribute: IItemAttribute) => ItemAttribute[attribute.id]?.toLowerCase()
    },
    probability: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.probability
    },
    values: {
      type: new GraphQLList(GraphQLInt),
      resolve: (attribute: IItemAttribute) => ([
        attribute.level1,
        attribute.level2,
        attribute.level3,
        attribute.level4,
        attribute.level5,
      ])
    },
    maxLevelWeapon: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelWeapon
    },
    maxLevelBody: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelBody
    },
    maxLevelWrist: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelWrist
    },
    maxLevelFoot: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelFoot
    },
    maxLevelNeck: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelNeck
    },
    maxLevelHead: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelHead
    },
    maxLevelShield: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelShield
    },
    maxLevelEar: {
      type: GraphQLInt,
      resolve: (attribute: IItemAttribute) => attribute.maxLevelEar
    },
  })
})
