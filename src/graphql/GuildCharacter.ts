import { GraphQLInt, GraphQLObjectType } from "graphql";

import Container from "../infrastructures/Container";

import { GuildControllerToken } from "../controllers/GuildController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { ICharacter } from "../entities/Character";

import GraphQLGuildGrade from "./GuildGrade";
import GraphQLCharacter from "./Character";
import GraphQLGuild from "./Guild";

const GraphQLGuildCharacter: GraphQLObjectType = new GraphQLObjectType({
  name: 'GuildCharacter',
  fields: () => ({
    character: {
      type: GraphQLCharacter,
      resolve: (character: ICharacter) => character
    },
    guild: {
      type: GraphQLGuild,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const guildController = Container.get(GuildControllerToken)
        return guildController.getGuildById(character.guildId, context)
      }
    },
    grade: {
      type: GraphQLGuildGrade,
      resolve: async (character: ICharacter, args: any, context: IGraphQLContext) => {
        const [grade] = await context.dataLoaderService.getGuildGradesByIdAndGuildId(character.guildGradeId, character.guildId) 
        return grade
      }
    },
  })
})

export default GraphQLGuildCharacter