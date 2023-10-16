import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import { Container } from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { MobControllerToken } from "../controllers/MobController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { GraphQLMobGroupGroup } from "./MobGroupGroup";


export const GraphQLMobGroupGroupQuery = {
  mobGroupGroup: {
    type: GraphQLMobGroupGroup,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id } = args || {}

      const mobController = Container.get(MobControllerToken)
      return mobController.getMobGroupGroupByHashId(id, context)
    }
  },
  mobGroupGroups: {
    type: new GraphQLList(GraphQLMobGroupGroup),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const mobController = Container.get(MobControllerToken)
      return mobController.getMobGroupGroups(args, context)
    }
  }
}
