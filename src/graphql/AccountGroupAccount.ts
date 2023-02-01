import { GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { AccountControllerToken } from "../controllers/AccountController";

import { IAccountGroupAccount } from "../entities/AccountGroupAccount";
import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLAccountGroup from "./AccountGroup";
import GraphQLAccount from "./Account";

const GraphQLAccountGroupAccount = new GraphQLObjectType({
  name: 'AccountGroupAccount',
  fields: () => ({
    account: {
      type: GraphQLAccount,
      resolve: (account: IAccountGroupAccount, args: any, context: IGraphQLContext) => {
        const accountController = Container.get(AccountControllerToken)
        return accountController.getAccountById(account.accountId, context)
      }
    },
    group: {
      type: GraphQLAccountGroup,
      resolve: (account: IAccountGroupAccount, args: any, context: IGraphQLContext) => {
        const accountController = Container.get(AccountControllerToken)
        return accountController.getAccountGroupById(account.accountGroupId, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (account: IAccountGroupAccount) => new Date(account.createdDate).toISOString()
    }
  })
})

export default GraphQLAccountGroupAccount