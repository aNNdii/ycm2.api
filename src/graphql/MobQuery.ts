import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { MobControllerToken } from "../controllers/MobController";

import GraphQLMob from "./Mob";


const GraphQLMobQuery = {
  mob: {
    type: GraphQLMob,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID)}
    }, 
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      let { id } = args || {}

      id = parseInt(id)

      const mobController = Container.get(MobControllerToken)
      return mobController.getMobById(id, context)
    }
  },
  mobs: {
    type: new GraphQLList(GraphQLMob),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const mobController = Container.get(MobControllerToken)
      return mobController.getMobs(args, context)
    }
  }
}

export default GraphQLMobQuery