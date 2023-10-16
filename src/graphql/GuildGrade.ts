import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { GuildControllerToken } from "../controllers/GuildController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IGuildGrade } from "../entities/GuildGrade";

import { GraphQLGuild } from "./Guild";


export const GraphQLGuildGrade = new GraphQLObjectType({
  name: 'GuildGrade',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (grade: IGuildGrade) => grade.id
    },
    name: {
      type: GraphQLString,
      resolve: (grade: IGuildGrade) => grade.name
    },
    authorizations: {
      type: new GraphQLList(GraphQLString),
      resolve: (grade: IGuildGrade) => grade.authorizations.map((a: any) => a.toLowerCase())
    },
    guild: {
      type: GraphQLGuild,
      resolve: (grade: IGuildGrade, args: any, context: IGraphQLContext) => {
        const guildController = Container.get(GuildControllerToken)
        return guildController.getGuildById(grade.guildId, context)
      }
    }
  })
})
