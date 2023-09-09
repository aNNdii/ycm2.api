import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { Authorization } from "../interfaces/Auth";
import { CharacterJob, CharacterRace, CharacterSex } from "../interfaces/Character";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { Empire } from "../interfaces/Empire";

import { GameCharacterServiceToken } from "../services/GameCharacterService";

import { CharacterControllerToken } from "../controllers/CharacterController";
import { AccountControllerToken } from "../controllers/AccountController";
import { MapControllerToken } from "../controllers/MapController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import HttpRouterError from "../entities/HttpRouterError";
import Character, { ICharacter } from "../entities/Character";

import GraphQLCharacterItemWindow from "./CharacterItemWindow";
import GraphQLCharacterQuickSlot from "./CharacterQuickSlot";
import GraphQLCharacterSkill from "./CharacterSkill";
import GraphQLCharacterHorse from "./CharacterHorse";
import GraphQLGuildCharacter from "./GuildCharacter";
import GraphQLCharacterItem from "./CharacterItem";
import GraphQLAccount from "./Account";
import GraphQLMap from "./Map";

const GraphQLCharacter: GraphQLObjectType = new GraphQLObjectType({
  name: 'Character',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (character: ICharacter) => character.hashId
    },
    account: {
      type: GraphQLAccount,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.ACCOUNTS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)
      
        const accountController = Container.get(AccountControllerToken)
        return accountController.getAccountById(character.accountId, context)
      }
    },
    items: {
      type: new GraphQLList(GraphQLCharacterItem),
      args: {
        itemId: { type: new GraphQLList(GraphQLID) },
        window: { type: new GraphQLList(GraphQLCharacterItemWindow) },
        ...getPaginationArguments()
      },
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.ACCOUNTS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)
      
        const characterController = Container.get(CharacterControllerToken)
        return characterController.getCharacterItems({
          ...args,
          characterId: [character.id]
        }, context)
      }
    },
    name: {
      type: GraphQLString,
      resolve: (character: ICharacter) => character.name
    },
    empire: {
      type: GraphQLString, 
      resolve: (character: ICharacter) => Empire[character.empireId]?.toLowerCase()
    },
    race: {
      type: GraphQLString,
      resolve: (character: ICharacter) => {
        let characterRaceId = CharacterRace.WARRIOR

        switch (character.jobId) {

          case CharacterJob.WARRIOR_MALE:
          case CharacterJob.WARRIOR_FEMALE:
            characterRaceId = CharacterRace.WARRIOR
            break

          case CharacterJob.ASSASSIN_MALE:
          case CharacterJob.ASSASSIN_FEMALE:
            characterRaceId = CharacterRace.ASSASSIN
            break

          case CharacterJob.SURA_MALE:
          case CharacterJob.SURA_FEMALE:
            characterRaceId = CharacterRace.SURA
            break
            
          case CharacterJob.SHAMAN_MALE:
          case CharacterJob.SHAMAN_FEMALE:
            characterRaceId = CharacterRace.SHAMAN
            break

        }

        return CharacterRace[characterRaceId]?.toLowerCase()
      }
    },
    sex: {
      type: GraphQLString,
      resolve: (character: ICharacter) => {
        let characterSexId = CharacterSex.MALE

        switch (character.jobId) {

          case CharacterJob.WARRIOR_MALE:
          case CharacterJob.ASSASSIN_MALE:
          case CharacterJob.SURA_MALE:
          case CharacterJob.SHAMAN_MALE:
            characterSexId = CharacterSex.MALE
            break  
          
          case CharacterJob.WARRIOR_FEMALE:
          case CharacterJob.ASSASSIN_FEMALE:
          case CharacterJob.SURA_FEMALE:
          case CharacterJob.SHAMAN_FEMALE:
            characterSexId = CharacterSex.FEMALE
            break

        }

        return CharacterSex[characterSexId]?.toLowerCase()
      }
    },
    level: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.level
    },
    health: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.hp
    },
    mana: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.mp
    },
    stamina: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.stamina
    },
    healthPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.health
    },
    strengthPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.strength
    },
    dexterityPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.dexterity
    },
    intelligentPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.intelligent
    },
    experience: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.experience
    },
    money: {
      type: GraphQLInt,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)
      
        return character.money
      }
    },
    x: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.x
    },
    y: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.y
    },
    skillGroup: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.skillGroup,
    },
    skillPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)
      
        return character.skillPointCount
      }
    },
    statPointCount: {
      type: GraphQLInt,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        return character.statPointCount
      }
    },
    alignment: {
      type: GraphQLInt,
      resolve: (character: ICharacter) => character.alignment
    },
    guild: {
      type: GraphQLGuildCharacter,
      resolve: (character: ICharacter) => character.guildId ? character : null
    },
    map: {
      type: GraphQLMap,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const mapController = Container.get(MapControllerToken)
        return mapController.getMapById(character.mapId, context)
      }
    },
    quickSlots: {
      type: new GraphQLList(GraphQLCharacterQuickSlot),
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        const gameCharacterService = Container.get(GameCharacterServiceToken)
        return gameCharacterService.parseCharacterQuickSlot(character.quickSlots)
      }
    },
    skills: {
      type: new GraphQLList(GraphQLCharacterSkill),
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        const gameCharacterService = Container.get(GameCharacterServiceToken)
        return gameCharacterService.parseCharacterSkills(character.skills)
      }
    },
    horse: {
      type: GraphQLCharacterHorse,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        return character
      }
    },
    playTime: {
      type: GraphQLInt,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        return character.playTime
      }
    },
    lastPlayDate: {
      type: GraphQLString,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        return character.lastPlayDate
      }
    },
    ip: {
      type: GraphQLString,
      resolve: (character: ICharacter, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
  
        const hasPermissions = auth.hasAuthorization(Authorization.CHARACTERS_READ) || auth.accountId === character.accountId
        if (!hasPermissions) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.AUTH_INSUFFICIENT_PERMISSION)

        return character.ip
      }
    }
  })
})

export default GraphQLCharacter