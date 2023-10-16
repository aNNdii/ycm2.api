import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { Authorization } from "../interfaces/Auth";
import { CharacterItemWindow } from "../interfaces/CharacterItem";

import { CharacterControllerToken } from "../controllers/CharacterController";
import { ItemControllerToken } from "../controllers/ItemController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { ICharacterItem } from "../entities/CharacterItem";

import { GraphQLCharacterItemAttribute } from "./CharacterItemAttribute";
import { GraphQLCharacter } from "./Character";
import { GraphQLItem } from "./Item";


export const GraphQLCharacterItem: GraphQLObjectType = new GraphQLObjectType({
  name: 'CharacterItem',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (item: ICharacterItem) => item.hashId
    },
    character: {
      type: GraphQLCharacter,
      resolve: (item: ICharacterItem, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.CHARACTERS_READ)

        const characterController = Container.get(CharacterControllerToken)
        return characterController.getCharacterById(item.characterId, context)
      }
    },
    item: {
      type: GraphQLItem,
      resolve: (item: ICharacterItem, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return itemController.getItemById(item.itemId, context)
      }
    },
    count: {
      type: GraphQLInt,
      resolve: (item: ICharacterItem) => item.count
    },
    window: {
      type: GraphQLString,
      resolve: (item: ICharacterItem) => CharacterItemWindow[item.window]?.toLowerCase()
    },
    position: {
      type: GraphQLInt,
      resolve: (item: ICharacterItem) => item.position
    },
    sockets: {
      type: new GraphQLList(GraphQLString),
      resolve: (item: ICharacterItem, args: any, context: IGraphQLContext) => {
        return [
          item.socket0,
          item.socket1,
          item.socket2,
          item.socket3,
          item.socket4,
          item.socket5,
        ]
      }
    },
    attributes: {
      type: new GraphQLList(GraphQLCharacterItemAttribute),
      resolve: (item: ICharacterItem, args: any, context: IGraphQLContext) => {
        return [
          { attributeId: item.attributeId0, value: item.attributeValue0 },
          { attributeId: item.attributeId1, value: item.attributeValue1 },
          { attributeId: item.attributeId2, value: item.attributeValue2 },
          { attributeId: item.attributeId3, value: item.attributeValue3 },
          { attributeId: item.attributeId4, value: item.attributeValue4 },
          { attributeId: item.attributeId5, value: item.attributeValue5, rare: true },
          { attributeId: item.attributeId6, value: item.attributeValue6, rare: true },
        ]
      }
    }
  })
})
