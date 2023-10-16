import { GraphQLID, GraphQLList } from "graphql";

import { Container } from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { AccountControllerToken } from "../controllers/AccountController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { GraphQLAccountGroup } from "./AccountGroup";


export const GraphQLAccountGroupQuery = {
  accountGroup: {
    type: GraphQLAccountGroup,
    args: {
      id: { type: GraphQLID }
    },
    resolve: async (_: any, args: any, context: IGraphQLContext) => {
      const { id: hashId } = args || {}

      const accountController = Container.get(AccountControllerToken)
      return accountController.getAccountGroupByHashId(hashId, context)
    }
  },
  accountGroups: {
    type: new GraphQLList(GraphQLAccountGroup),
    args: {
      ...getPaginationArguments()
    },
    resolve: async (_: any, args: any, context: IGraphQLContext) => {
      const accountController = Container.get(AccountControllerToken)
      return accountController.getAccountGroups(args, context)
    }
  }
}
