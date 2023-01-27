import { GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { CharacterControllerToken } from "../controllers/CharacterController";
import { GuildControllerToken } from "../controllers/GuildController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IGuildMessage } from "../entities/GuildMessage";

import GraphQLCharacter from "./Character";
import GraphQLGuild from "./Guild";


const GraphQLGuildMessage = new GraphQLObjectType({
  name: 'GuildMessage',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (message: IGuildMessage) => message.hashId
    },
    guild: {
      type: GraphQLGuild,
      resolve: (message: IGuildMessage, args: any, context: IGraphQLContext) => {
        const guildController = Container.get(GuildControllerToken)
        return guildController.getGuildById(message.guildId, context)
      }
    },
    character: {
      type: GraphQLCharacter,
      resolve: (message: IGuildMessage, args: any, context: IGraphQLContext) => {
        const characterController = Container.get(CharacterControllerToken)
        return message.characterId ? characterController.getCharacterById(message.characterId, context) : null
      }
    },
    content: {
      type: GraphQLString,
      resolve: (message: IGuildMessage) => message.content
    },
    createdDate: {
      type: GraphQLString,
      resolve: (message: IGuildMessage) => new Date(message.createdDate).toISOString()
    }
  })
})

export default GraphQLGuildMessage