import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { MobControllerToken } from "../controllers/MobController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLMobGroup from "./MobGroup";


const GraphQLMobGroupQuery = {
  mobGroup: {
    type: GraphQLMobGroup,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id } = args || {}
      
      const mobController = Container.get(MobControllerToken)
      return mobController.getMobGroupByHashId(id, context)
    }
  },
  mobGroups: {
    type: new GraphQLList(GraphQLMobGroup),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const mobController = Container.get(MobControllerToken)
      return mobController.getMobGroups(args, context)
    }
  },
}

export default GraphQLMobGroupQuery