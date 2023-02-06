import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { GraphQLObjectType, GraphQLSchema } from "graphql"
import { ApolloServer } from '@apollo/server'
import { createPool } from "mariadb"
import { program } from "commander"
import * as dotenv from "dotenv"
import * as http from "http"
import debug from "debug"
import Ajv from "ajv"

import Koa from "koa"
import KoaCors from '@koa/cors'
import KoaRouter from "koa-router"
import KoaConvert from "koa-convert"
import KoaCompress from "koa-compress"
import KoaBetterBody from "koa-better-body"

import MariaDatabase, { MariaDatabaseToken } from "../src/infrastructures/MariaDatabase"
import GraphQLServer, { GraphQLServerToken } from '../src/infrastructures/GraphQLServer'
import HttpRouter, { HttpRouterToken } from '../src/infrastructures/HttpRouter'
import Container from "../src/infrastructures/Container"

import { AccountDatabaseToken, CmsDatabaseToken, CommonDatabaseToken, LogDatabaseToken, PlayerDatabaseToken } from "../src/repositories/GameRepository"
import CharacterRepository, { CharacterRepositoryToken } from "../src/repositories/CharacterRepository"
import AccountRepository, { AccountRepositoryToken } from "../src/repositories/AccountRepository"
import LocaleRepository, { LocaleRepositoryToken } from "../src/repositories/LocaleRepository"
import GuildRepository, { GuildRepositoryToken } from "../src/repositories/GuildRepository"
import ItemRepository, { ItemRepositoryToken } from "../src/repositories/ItemRepository"
import MobRepository, { MobRepositoryToken } from "../src/repositories/MobRepository"
import MapRepository, { MapRepositoryToken } from "../src/repositories/MapRepository"

import GameCharacterService, { GameCharacterServiceToken } from "../src/services/GameCharacterService"
import ObfuscationService, { ObfuscationServiceToken } from "../src/services/ObfuscationService"
import PaginationService, { PaginationServiceToken } from "../src/services/PaginationService"
import ValidatorService, { ValidatorServiceToken } from "../src/services/ValidatorService"
import GameGuildService, { GameGuildServiceToken } from "../src/services/GameGuildService"
import CharacterService, { CharacterServiceToken } from "../src/services/CharacterService"
import GameItemService, { GameItemServiceToken } from "../src/services/GameItemService"
import GameMobService, { GameMobServiceToken } from "../src/services/GameMobService"
import GameMapService, { GameMapServiceToken } from "../src/services/GameMapService"
import AccountService, { AccountServiceToken } from "../src/services/AccountService"
import CaptchaService, { CaptchaServiceToken } from "../src/services/CaptchaService"
import LocaleService, { LocaleServiceToken } from "../src/services/LocaleService"
import GuildService, { GuildServiceToken } from "../src/services/GuildService"
import GameService, { GameServiceToken } from "../src/services/GameService"
import ItemService, { ItemServiceToken } from "../src/services/ItemService"
import HashService, { HashServiceToken } from "../src/services/HashService"
import AuthService, { AuthServiceToken } from "../src/services/AuthService"
import MobService, { MobServiceToken } from "../src/services/MobService"
import MapService, { MapServiceToken } from "../src/services/MapService"

import CharacterController, { CharacterControllerToken } from "../src/controllers/CharacterController"
import GraphQLController, { GraphQLControllerToken } from '../src/controllers/GraphQLController'
import AccountController, { AccountControllerToken } from "../src/controllers/AccountController"
import LocaleController, { LocaleControllerToken } from "../src/controllers/LocaleController"
import GuildController, { GuildControllerToken } from "../src/controllers/GuildController"
import ItemController, { ItemControllerToken } from "../src/controllers/ItemController"
import AuthController, { AuthControllerToken } from "../src/controllers/AuthController"
import MobController, { MobControllerToken } from "../src/controllers/MobController"
import MapController, { MapControllerToken } from "../src/controllers/MapController"

import { IGraphQLContext } from "../src/entities/GraphQLContext"

import GraphQLAccountMutation from "../src/graphql/AccountMutation"
import GraphQLCaptchaMutation from "../src/graphql/CaptchaMutation"
import GraphQLAuthMutation from "../src/graphql/AuthMutation"

import GraphQLMobGroupGroupQuery from "../src/graphql/MobGroupGroupQuery"
import GraphQLAccountGroupQuery from "../src/graphql/AccountGroupQuery"
import GraphQLMobRankItemQuery from "../src/graphql/MobRankItemQuery"
import GraphQLCharacterQuery from "../src/graphql/CharacterQuery"
import GraphQLMobGroupQuery from "../src/graphql/MobGroupQuery"
import GraphQLMobItemQuery from "../src/graphql/MobItemQuery"
import GraphQLAccountQuery from "../src/graphql/AccountQuery"
import GraphQLLocaleQuery from "../src/graphql/LocaleQuery"
import GraphQLItemQuery from "../src/graphql/ItemQuery"
import GraphQLMapQuery from "../src/graphql/MapQuery"
import GraphQLMobQuery from "../src/graphql/MobQuery"

(async () => {

  /*****************************************************************************
   * Load execution parameter
   *****************************************************************************/
  program.option('-c, --config <string>', 'Path to config file')
  program.option('-d, --debug', 'Enable debug mode', false)
  program.parse()

  const argv = program.opts()
  argv.config && dotenv.config({ path: argv.config })

  /*****************************************************************************
   * Constants
   *****************************************************************************/
  const LOG_FILTER = process.env.LOG_FILTER || ''

  const HTTP_PORT = ~~(process.env.HTTP_PORT || 4000)
  const HTTP_CORS_MAX_AGE = ~~(process.env.HTTP_CORS_MAX_AGE || 24 * 60 * 60)

  const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost'
  const DATABASE_PORT = ~~(process.env.DATABASE_PORT || 3306)
  const DATABASE_USER = process.env.DATABASE_USER || ''
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || ''
  const DATABASE_CONNECTION_LIMIT = ~~(process.env.DATABASE_CONNECTION_LIMIT || 100)

  const DATABASE_ACCOUNT = process.env.DATABASE_ACCOUNT || 'account'
  const DATABASE_PLAYER = process.env.DATABASE_PLAYER || 'player'
  const DATABASE_COMMON = process.env.DATABASE_COMMON || 'common'
  const DATABASE_LOG = process.env.DATABASE_LOG || 'log'
  const DATABASE_CMS = process.env.DATABASE_CMS || 'ycm2'

  const OBFUSCATION = Boolean(~~(process.env.OBFUSCATION || 1))
  const OBFUSCATION_SALT = process.env.OBFUSCATION_SALT || ''
  const OBFUSCATION_ALPHABET = process.env.OBFUSCATION_ALPHABET
  const OBFUSCATION_MIN_LENGTH = ~~(process.env.OBFUSCATION_MIN_LENGTH || 0)

  const PAGINATION_LIMIT_DEFAULT = ~~(process.env.PAGINATION_LIMIT_DEFAULT || 10)
  const PAGINATION_LIMIT_MAX = ~~(process.env.PAGINATION_LIMIT_MAX || 50)
  const PAGINATION_LIMIT_MIN = ~~(process.env.PAGINATION_LIMIT_MIN || 1)

  const AUTH_JWT_ALGORITHM = process.env.AUTH_JWT_ALGORITHM || 'HS512'
  const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || ''
  const AUTH_JWT_TTL = ~~(process.env.AUTH_JWT_TTL || 3600)

  const CAPTCHA_TOKEN_SECRET = process.env.CAPTCHA_TOKEN_SECRET || ""
  const CAPTCHA_TOKEN_MIN_LENGTH = ~~(process.env.CAPTCHA_TOKEN_MIN_LENGTH || 32)
  const CAPTCHA_TOKEN_TTL = ~~(process.env.CAPTCHA_TOKEN_TTL || 60)
  const CAPTCHA_IMAGE_COLORS = ~~(process.env.CAPTCHA_IMAGE_COLORS || 1)
  const CAPTCHA_IMAGE_NOISES = ~~(process.env.CAPTCHA_IMAGE_NOISES || 3)
  const CAPTCHA_LENGTH = ~~(process.env.CAPTCHA_LENGTH || 6)

  const ACCOUNT_OBFUSCATION_SALT = process.env.ACCOUNT_OBFUSCATION_SALT || OBFUSCATION_SALT
  const ACCOUNT_GROUP_OBFUSCATION_SALT = process.env.ACCOUNT_GROUP_OBFUSCATION_SALT || OBFUSCATION_SALT
  const CHARACTER_OBFUSCATION_SALT = process.env.CHARACTER_OBFUSCATION_SALT || OBFUSCATION_SALT
  const CHARACTER_ITEM_OBFUSCATION_SALT = process.env.CHARACTER_ITEM_OBFUSCATION_SALT || OBFUSCATION_SALT
  const LOCALE_OBFUSCATION_SALT = process.env.LOCALE_OBFUSCATION_SALT || OBFUSCATION_SALT
  const LOCALE_ITEM_OBFUSCATION_SALT = process.env.LOCALE_ITEM_OBFUSCATION_SALT || OBFUSCATION_SALT
  const LOCALE_MOB_OBFUSCATION_SALT = process.env.LOCALE_MOB_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MAP_OBFUSCATION_SALT = process.env.MAP_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MAP_ENTITY_OBFUSCATION_SALT = process.env.MAP_ENTITY_OBFUSCATION_SALT || OBFUSCATION_SALT
  const GUILD_OBFUSCATION_SALT = process.env.GUILD_OBFUSCATION_SALT || OBFUSCATION_SALT
  const GUILD_MESSAGE_OBFUSCATION_SALT = process.env.GUILD_MESSAGE_OBFUSCATION_SALT || OBFUSCATION_SALT
  const ITEM_SPECIAL_ACTION_OBFUSCATION_SALT = process.env.ITEM_SPECIAL_ACTION_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MOB_ITEM_OBFUSCATION_SALT = process.env.MOB_ITEM_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MOB_RANK_ITEM_OBFUSCATION_SALT = process.env.MOB_RANK_ITEM_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MOB_GROUP_OBFUSCATION_SALT = process.env.MOB_GROUP_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MOB_GROUP_MOB_OBFUSCATION_SALT = process.env.MOB_GROUP_MOB_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MOB_GROUP_GROUP_OBFUSCATION_SALT = process.env.MOB_GROUP_GROUP_OBFUSCATION_SALT || OBFUSCATION_SALT
  const MOB_GROUP_GROUP_MOB_GROUP_OBFUSCATION_SALT = process.env.MOB_GROUP_GROUP_MOB_GROUP_OBFUSCATION_SALT || OBFUSCATION_SALT

  /*****************************************************************************
   * Third parties
   *****************************************************************************/
  const ajv = new Ajv()

  const koa = new Koa()

  const koaRouter = new KoaRouter()

  const httpServer = http.createServer(koa.callback())

  const mariaDatabasePool = createPool({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    connectionLimit: DATABASE_CONNECTION_LIMIT,
    // timezone: "auto",
    checkDuplicate: false,
    insertIdAsNumber: true,
    decimalAsNumber: true,
    bigIntAsNumber: true,
    nestTables: '.'
  })

  const queries = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...GraphQLAccountQuery,
      ...GraphQLAccountGroupQuery,
      ...GraphQLCharacterQuery,
      ...GraphQLItemQuery,
      ...GraphQLMobQuery,
      ...GraphQLMobGroupQuery,
      ...GraphQLMobGroupGroupQuery,
      ...GraphQLMobItemQuery,
      ...GraphQLMobRankItemQuery,
      ...GraphQLMapQuery,
      ...GraphQLLocaleQuery,
    })
  })

  const mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...GraphQLAuthMutation,
      ...GraphQLCaptchaMutation,
      ...GraphQLAccountMutation,
      // ...GraphQLItemMutations,
    })
  })

  const apolloServer = new ApolloServer<IGraphQLContext>({
    nodeEnv: argv.debug ? '' : 'production',
    introspection: argv.debug,
    schema: new GraphQLSchema({
      query: queries,
      mutation: mutations
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
  })


  /*****************************************************************************
   * Infrastructures
   *****************************************************************************/
  Container.set(HttpRouterToken, new HttpRouter({
    router: koaRouter
  }))

  Container.set(GraphQLServerToken, new GraphQLServer({
    server: apolloServer
  }))

  Container.set(MariaDatabaseToken, new MariaDatabase({
    pool: mariaDatabasePool
  }))


  /*****************************************************************************
   * Repositories
   *****************************************************************************/
  Container.set(CharacterRepositoryToken, new CharacterRepository())
  Container.set(AccountRepositoryToken, new AccountRepository())
  Container.set(LocaleRepositoryToken, new LocaleRepository())
  Container.set(GuildRepositoryToken, new GuildRepository())
  Container.set(ItemRepositoryToken, new ItemRepository())
  Container.set(MobRepositoryToken, new MobRepository())
  Container.set(MapRepositoryToken, new MapRepository())


  /*****************************************************************************
   * Services
   *****************************************************************************/
  Container.set(HashServiceToken, new HashService({}))

  Container.set(ValidatorServiceToken, new ValidatorService({
    ajv: ajv
  }))

  Container.set(PaginationServiceToken, new PaginationService({
    limitDefault: PAGINATION_LIMIT_DEFAULT,
    limitMax: PAGINATION_LIMIT_MAX,
    limitMin: PAGINATION_LIMIT_MIN
  }))

  Container.set(ObfuscationServiceToken, new ObfuscationService({
    obfuscation: OBFUSCATION,
    salt: OBFUSCATION_SALT,
    alphabet: OBFUSCATION_ALPHABET,
    minLength: OBFUSCATION_MIN_LENGTH
  }))

  Container.set(AuthServiceToken, new AuthService({
    jwtAlgorithm: AUTH_JWT_ALGORITHM,
    jwtSecret: AUTH_JWT_SECRET,
    jwtTtl: AUTH_JWT_TTL
  }))

  Container.set(LocaleServiceToken, new LocaleService({
    localeObfuscationSalt: LOCALE_OBFUSCATION_SALT,
    localeItemObfuscationSalt: LOCALE_ITEM_OBFUSCATION_SALT,
    localeMobObfuscationSalt: LOCALE_MOB_OBFUSCATION_SALT,
  }))

  Container.set(AccountServiceToken, new AccountService({
    accountObfuscationSalt: ACCOUNT_OBFUSCATION_SALT,
    accountGroupObfuscationSalt: ACCOUNT_GROUP_OBFUSCATION_SALT
  }))

  Container.set(CharacterServiceToken, new CharacterService({
    characterObfuscationSalt: CHARACTER_OBFUSCATION_SALT,
    characterItemObfuscationSalt: CHARACTER_ITEM_OBFUSCATION_SALT
  }))

  Container.set(MapServiceToken, new MapService({
    mapObfuscationSalt: MAP_OBFUSCATION_SALT,
    mapEntityObfuscationSalt: MAP_ENTITY_OBFUSCATION_SALT
  }))

  Container.set(GuildServiceToken, new GuildService({
    guildObfuscationSalt: GUILD_OBFUSCATION_SALT,
    guildMessageObfuscationSalt: GUILD_MESSAGE_OBFUSCATION_SALT
  }))

  Container.set(ItemServiceToken, new ItemService({
    itemSpecialActionObfuscationSalt: ITEM_SPECIAL_ACTION_OBFUSCATION_SALT
  }))

  Container.set(MobServiceToken, new MobService({
    mobItemObfuscationSalt: MOB_ITEM_OBFUSCATION_SALT,
    mobRankItemObfuscationSalt: MOB_RANK_ITEM_OBFUSCATION_SALT,
    mobGroupObfuscationSalt: MOB_GROUP_OBFUSCATION_SALT,
    mobGroupMobObfuscationSalt: MOB_GROUP_MOB_OBFUSCATION_SALT,
    mobGroupGroupObfuscationSalt: MOB_GROUP_GROUP_OBFUSCATION_SALT,
    mobGroupGroupMobGroupObfuscationSalt: MOB_GROUP_GROUP_MOB_GROUP_OBFUSCATION_SALT
  }))

  Container.set(GameServiceToken, new GameService({}))
  Container.set(GameCharacterServiceToken, new GameCharacterService({}))
  Container.set(GameGuildServiceToken, new GameGuildService({}))
  Container.set(GameItemServiceToken, new GameItemService({}))
  Container.set(GameMobServiceToken, new GameMobService({}))
  Container.set(GameMapServiceToken, new GameMapService({}))

  Container.set(CaptchaServiceToken, new CaptchaService({
    tokenSecret: CAPTCHA_TOKEN_SECRET,
    tokenTtl: CAPTCHA_TOKEN_TTL,
    tokenMinLength: CAPTCHA_TOKEN_MIN_LENGTH,
    imageColors: CAPTCHA_IMAGE_COLORS,
    imageNoises: CAPTCHA_IMAGE_NOISES,
    length: CAPTCHA_LENGTH,
  }))

  /*****************************************************************************
   * Controllers
   *****************************************************************************/
  Container.set(GraphQLControllerToken, new GraphQLController())
  Container.set(AuthControllerToken, new AuthController())

  Container.set(CharacterControllerToken, new CharacterController())
  Container.set(AccountControllerToken, new AccountController())
  Container.set(LocaleControllerToken, new LocaleController())
  Container.set(GuildControllerToken, new GuildController())
  Container.set(ItemControllerToken, new ItemController())
  Container.set(MobControllerToken, new MobController())
  Container.set(MapControllerToken, new MapController())


  /*****************************************************************************
   * Execution
   *****************************************************************************/

  debug.enable(LOG_FILTER)

  Container.set(AccountDatabaseToken, DATABASE_ACCOUNT)
  Container.set(PlayerDatabaseToken, DATABASE_PLAYER)
  Container.set(CommonDatabaseToken, DATABASE_COMMON)
  Container.set(LogDatabaseToken, DATABASE_LOG)
  Container.set(CmsDatabaseToken, DATABASE_CMS)

  Container.get(GraphQLControllerToken).init()

  Container.get(LocaleControllerToken).init()
  Container.get(ItemControllerToken).init()
  Container.get(MobControllerToken).init()
  Container.get(MapControllerToken).init()

  koa
    .use(KoaCompress())
    .use(KoaCors({ maxAge: HTTP_CORS_MAX_AGE }))
    .use(KoaConvert(KoaBetterBody({
      fields: 'body',
      strict: false
    })))
    .use(koaRouter.routes())

  await apolloServer.start()
  httpServer.listen(HTTP_PORT)

  // process.send ? process.send('ready') : null
  console.log(`🚀 Server started on port ${HTTP_PORT}.`)

  process.on('exit', async () => {
    console.log(`Received exit signal. Closing open connections...`)

    await mariaDatabasePool.end()
  })

})()
