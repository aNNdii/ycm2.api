import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql"

import Container from "../infrastructures/Container"

import { getPaginationArguments } from "../helpers/GraphQL"

import { AccountControllerToken } from "../controllers/AccountController"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"
import { ErrorMessage } from "../interfaces/ErrorMessage"

import { Authorization } from "../interfaces/Auth"
import { AccountStatus } from "../interfaces/Account"

import { IGraphQLContext } from "../entities/GraphQLContext"
import HttpRouterError from "../entities/HttpRouterError"

import GraphQLAccountStatus from "./AccountStatus"
import GraphQLAccount from "./Account"

const GraphQLAccountQuery = {
  me: {
    type: GraphQLAccount,
    resolve: async (_: any, __: any, context: IGraphQLContext) => {
      const auth = context.getAuth()

      const accountController = Container.get(AccountControllerToken)
      const account = await accountController.getAccountById(auth.accountId, context)

      if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

      return account
    }
  },
  account: {
    type: GraphQLAccount,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id: hashId } = args || {}

      const auth = context.getAuth()
      auth.verifyAuthorization(Authorization.ACCOUNTS_READ)

      const accountController = Container.get(AccountControllerToken)
      return accountController.getAccountByHashId(hashId, context)
    }
  },
  accounts: {
    type: new GraphQLList(GraphQLAccount),
    args: {
      status: { type: GraphQLAccountStatus },
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const auth = context.getAuth()
      auth.verifyAuthorization(Authorization.ACCOUNTS_READ)

      const accountController = Container.get(AccountControllerToken)
      return accountController.getAccounts(args, context)
    }
  }
}

export default GraphQLAccountQuery