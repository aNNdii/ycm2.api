import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { CharacterQuickSlotType } from "../interfaces/Character";

import { ICharacterQuickSlot } from "../services/GameCharacterService";


export const GraphQLCharacterQuickSlot = new GraphQLObjectType({
  name: 'CharacterQuickSlot',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (quickSlot: ICharacterQuickSlot) => quickSlot.id
    },
    type: {
      type: GraphQLString,
      resolve: (quickSlot: ICharacterQuickSlot) => CharacterQuickSlotType[quickSlot.type]?.toLowerCase()
    },
    value: {
      type: GraphQLInt,
      resolve: (quickSlot: ICharacterQuickSlot) => quickSlot.value
    }
  })
})