import { GraphQLNonNull, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { AuthControllerToken } from "../controllers/AuthController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLAuthenticationMethod from "./AuthenticationMethod";
import GraphQLAuth from "./Auth";

const GraphQLAuthMutation = {
  authenticate: {
    type: GraphQLAuth,
    args: {
      method: { type: new GraphQLNonNull(GraphQLAuthenticationMethod) },
      
      username: { type: GraphQLString },
      password: { type: GraphQLString },

      accessToken: { type: GraphQLString },
      refreshToken: { type: GraphQLString }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const authController = Container.get(AuthControllerToken)
      return authController.authenticate(args, context)
    }
  }
}

export default GraphQLAuthMutation