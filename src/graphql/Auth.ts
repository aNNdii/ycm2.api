import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { IAuth } from "../entities/Auth";

const GraphQLAuth = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    accountId: {
      type: GraphQLID,
      resolve: (auth: IAuth) => auth.accountHashId
    },
    accessToken: {
      type: GraphQLString, 
      resolve: (auth: IAuth) => auth.accessToken
    },
    refreshToken: {
      type: GraphQLString,
      resolve: (auth: IAuth) => auth.refreshToken
    }
  })
})

export default GraphQLAuth