import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import { Container } from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { MobControllerToken } from "../controllers/MobController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { GraphQLMobItem } from "./MobItem";


export const GraphQLMobItemQuery = {
  mobItem: {
    type: GraphQLMobItem,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id: hashId } = args || {}

      const mobController = Container.get(MobControllerToken)
      return mobController.getMobItemByHashId(hashId, context)
    }
  },
  mobItems: {
    type: new GraphQLList(GraphQLMobItem),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const mobController = Container.get(MobControllerToken)
      return mobController.getMobItems(args, context)
    }
  },
}
