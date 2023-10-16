import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { CharacterSkill, CharacterSkillMastery } from "../interfaces/Character";

import { ICharacterSkill } from "../services/GameCharacterService";


export const GraphQLCharacterSkill = new GraphQLObjectType({
  name: 'CharacterSkill',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (skill: ICharacterSkill) => skill.id
    },
    name: {
      type: GraphQLString,
      resolve: (skill: ICharacterSkill) => CharacterSkill[skill.id]?.toLowerCase()
    },
    type: {
      type: GraphQLString,
      resolve: (skill: ICharacterSkill) => CharacterSkillMastery[skill.mastery]?.toLowerCase()
    },
    level: {
      type: GraphQLInt,
      resolve: (skill: ICharacterSkill) => skill.level
    },
    nextReadDate: {
      type: GraphQLString,
      resolve: (skill: ICharacterSkill) => skill.nextReadTime ? new Date(skill.nextReadTime * 1000).toISOString() : null
    }
  })
})
