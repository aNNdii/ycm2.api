import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { Authorization, AuthorizationAction } from "../interfaces/Auth";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IAccount } from "../entities/Account";

import GraphQLCharacter from "./Character";

const GraphQLAccount = new GraphQLObjectType({
  name: 'Account',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (account: IAccount) => account.hashId
    },
    username: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.username
    },
    status: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.status
    },
    deleteCode: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.ACCOUNTS, AuthorizationAction.READ)

        return account.deleteCode
      }
    },
    safeBoxCode: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.ACCOUNTS, AuthorizationAction.READ)

        return account.safeBoxCode
      }
    },
    moneyBonusExpirationDate: {
      type: GraphQLString, 
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.moneyBonusExpirationDate
    },
    itemBonusExpirationDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.itemBonusExpirationDate
    },
    experienceBonusExpirationDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.experienceBonusExpirationDate
    },
    safeBoxExtensionExpirationDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.safeBoxExtensionExpirationDate
    },
    autoLootExpirationDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.autoLootExpirationDate
    },
    fishingExpirationDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.fishingBonusExpirationDate
    },
    marriageBonusExpirationDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.marriageBonusExpirationDate
    },
    characters: {
      type: new GraphQLList(GraphQLCharacter),
      resolve: (account: IAccount, args: any, context: IGraphQLContext) => context.dataLoaderService.getCharactersByAccountId(account.id)
    },
    createDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.createDate
    },
    lastPlayDate: {
      type: GraphQLString,
      resolve: (account: IAccount, _: any, context: IGraphQLContext) => account.lastPlayDate
    }
  })
})

export default GraphQLAccount