import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import Container from "../infrastructures/Container";

import { MobControllerToken } from "../controllers/MobController";
import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLMobRankItem from "./MobRankItem";
import { getPaginationArguments } from "../helpers/GraphQL";


const GraphQLMobRankItemQuery = {
  mobRankItem: {
    type: GraphQLMobRankItem,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id: hashId } = args || {}

      const mobController = Container.get(MobControllerToken)
      return mobController.getMobRankItemByHashId(hashId, context)
    }
  },
  mobRankItems: {
    type: new GraphQLList(GraphQLMobRankItem),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const mobController = Container.get(MobControllerToken)
      return mobController.getMobRankItems(args, context)
    }
  }
}

export default GraphQLMobRankItemQuery