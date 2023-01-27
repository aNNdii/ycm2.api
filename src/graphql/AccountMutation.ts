import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { Authorization, AuthorizationAction } from "../interfaces/Auth";

import { CaptchaServiceToken } from "../services/CaptchaService";
import { AccountServiceToken } from "../services/AccountService";

import { IGraphQLContext } from "../entities/GraphQLContext";

const GraphQLAccountMutation = {
  createAccount: {
    type: GraphQLID,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const auth = context.getAuth()
      auth.verifyAuthorization(Authorization.ACCOUNTS, AuthorizationAction.WRITE)

      return ""
    }
  },
  register: {
    type: GraphQLID,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      captchaToken: { type: new GraphQLNonNull(GraphQLString) },
      captcha: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_: any, args: any, context: IGraphQLContext) => {
      const { captchaToken, captcha, username, password } = args 

      const captchaService = Container.get(CaptchaServiceToken)
      captchaService.verifyCaptcha(captchaToken, captcha)

      const accountService = Container.get(AccountServiceToken)
      const accountId = await accountService.createAccount({ username, password })

      return accountService.obfuscateAccountId(accountId)
    }
  }
}

export default GraphQLAccountMutation