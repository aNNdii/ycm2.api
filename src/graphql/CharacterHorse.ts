import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { Character, ICharacter } from "../entities/Character";

export const GraphQLCharacterHorse = new GraphQLObjectType({
  name: 'CharacterHorse',
  fields: () => ({
    health: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.horseHealth
    },
    stamina: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.horseStamina
    },
    level: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.horseLevel
    },
    riding: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.horseRiding,
    },
    deathDate: {
      type: GraphQLString,
      resolve: (character: ICharacter) => {
        return character.horseDeathDate ? new Date(character.horseDeathDate * 1000).toISOString() : null
      }
    },
    skillPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.skillPointCount 
    }
  })
})