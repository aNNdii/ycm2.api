import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { MapControllerToken } from "../controllers/MapController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { GraphQLMap } from "./Map";


export const GraphQLMapQuery = {
  map: {
    type: GraphQLMap,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id: hashId } = args || {}

      const mapController = Container.get(MapControllerToken)
      return mapController.getMapByHashId(hashId, context)
    }
  },
  maps: {
    type: new GraphQLList(GraphQLMap),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const mapController = Container.get(MapControllerToken)
      return mapController.getMaps(args, context)
    }
  }
}
