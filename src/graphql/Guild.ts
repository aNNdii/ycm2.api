import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { GameGuildServiceToken } from "../services/GameGuildService";

import { CharacterControllerToken } from "../controllers/CharacterController";
import { GuildControllerToken } from "../controllers/GuildController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IGuild } from "../entities/Guild";

import GraphQLGuildMessage from "./GuildMessage";
import GraphQLGuildSkill from "./GuildSkill";
import GraphQLGuildGrade from "./GuildGrade";
import GraphQLCharacter from "./Character";

const GraphQLGuild: GraphQLObjectType = new GraphQLObjectType({
  name: 'Guild',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (guild: IGuild) => guild.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (guild: IGuild) => guild.name
    },
    master: {
      type: GraphQLCharacter,
      resolve: (guild: IGuild, args: any, context: IGraphQLContext) => {
        const characterController = Container.get(CharacterControllerToken)
        return characterController.getCharacterById(guild.masterId, context)
      }
    },
    grades: {
      type: new GraphQLList(GraphQLGuildGrade),
      resolve: (guild: IGuild, args: any, context: IGraphQLContext) => context.dataLoaderService.getGuildGradesByGuildId(guild.id)
    },
    members: {
      type: new GraphQLList(GraphQLCharacter),
      resolve: (guild: IGuild, args: any, context: IGraphQLContext) => context.dataLoaderService.getCharactersByGuildId(guild.id)
    },
    messages: {
      type: new GraphQLList(GraphQLGuildMessage),
      args: {
        ...getPaginationArguments()
      },
      resolve: (guild: IGuild, args: any, context: IGraphQLContext) => {
        const guildController = Container.get(GuildControllerToken)
        return guildController.getGuildMessages({
          ...args,
          guildId: guild.id
        }, context)
      }
    },
    level: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.level
    },
    sp: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.sp
    },
    experience: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.experience
    },
    skills: {
      type: new GraphQLList(GraphQLGuildSkill),
      resolve: (guild: IGuild) => {
        const gameGuildService = Container.get(GameGuildServiceToken)
        return gameGuildService.parseGuildSkills(guild.skills)
      }
    },
    skillPointCount: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.skillPointCount
    },
    winCount: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.winCount
    },
    drawCount: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.drawCount
    },
    lossCount: {
      type: GraphQLInt, 
      resolve: (guild: IGuild) => guild.lossCount
    },
    pointCount: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.pointCount
    },
    money: {
      type: GraphQLInt,
      resolve: (guild: IGuild) => guild.money
    }
  })
})

export default GraphQLGuild