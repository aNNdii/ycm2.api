import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { AccountControllerToken } from "../controllers/AccountController";

import { IAccountGroupAuthorization } from "../entities/AccountGroupAuthorization";
import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLAccountGroup from "./AccountGroup";
import { Authorization } from "../interfaces/Auth";


const GraphQLAccountGroupAuthorization = new GraphQLObjectType({
  name: 'AccountGroupAuthorization',
  fields: () => ({
    group: {
      type: GraphQLAccountGroup,
      resolve: (authorization: IAccountGroupAuthorization, args: any, context: IGraphQLContext) => {
        const accountController = Container.get(AccountControllerToken)
        return accountController.getAccountGroupById(authorization.accountGroupId, context)
      }
    },
    authorization: {
      type: GraphQLString,
      resolve: (authorization: IAccountGroupAuthorization) => Authorization[authorization.authorizationId]?.toLowerCase()
      // resolve: (authorization: IAccountGroupAuthorization) => authorization.authorizationId
    },
    createdDate: {
      type: GraphQLString,
      resolve: (authorization: IAccountGroupAuthorization) => new Date(authorization.createdDate).toISOString()
    }
  })
})

export default GraphQLAccountGroupAuthorization