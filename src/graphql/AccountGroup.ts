import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { IAccountGroup } from "../entities/AccountGroup";
import { IGraphQLContext } from "../entities/GraphQLContext";

import { GraphQLAccountGroupAuthorization } from "./AccountGroupAuthorization";
import { GraphQLAccountGroupAccount } from "./AccountGroupAccount";


export const GraphQLAccountGroup: GraphQLObjectType = new GraphQLObjectType({
  name: 'AccountGroup',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (group: IAccountGroup) => group.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (group: IAccountGroup) => group.name
    },
    accounts: {
      type: new GraphQLList(GraphQLAccountGroupAccount),
      resolve: (group: IAccountGroup, args: any, context: IGraphQLContext) => context.dataLoaderService.getAccountGroupAccountsByAccountGroupId(group.id)
    },
    authorizations: {
      type: new GraphQLList(GraphQLAccountGroupAuthorization),
      resolve: (group: IAccountGroup, args: any, context: IGraphQLContext) => context.dataLoaderService.getAccountGroupAuthorizationsByAccountGroupId(group.id)
    },
    createdDate: {
      type: GraphQLString,
      resolve: (group: IAccountGroup) => new Date(group.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (group: IAccountGroup) => new Date(group.modifiedDate).toISOString()
    }
  })
})