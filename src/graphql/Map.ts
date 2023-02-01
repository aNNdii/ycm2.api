import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { Authorization } from "../interfaces/Auth";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMap } from "../entities/Map";

import { MapControllerToken } from "../controllers/MapController";

import GraphQLMapEntity from "./MapEntity";

const GraphQLMap: GraphQLObjectType = new GraphQLObjectType({
  name: 'Map',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (map: IMap) => map.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (map: IMap) => map.name
    },
    width: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.width
      }
    },
    height: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.height
      }
    },
    baseX: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.baseX
      }
    },
    baseY: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.baseY
      }
    },
    viewRadius: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.viewRadius
      }
    },
    heightScale: {
      type: GraphQLFloat,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.heightScale
      }
    },
    cellScale: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.cellScale
      }
    },
    texture: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.texture
      }
    },
    environment: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return map.environment
      }
    },
    entities: {
      type: new GraphQLList(GraphQLMapEntity),
      args: {
        ...getPaginationArguments()
      },
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const mapController = Container.get(MapControllerToken)
        return mapController.getMapEntities({
          ...args,
          mapId: [map.id]
        }, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return new Date(map.createdDate).toISOString()
      }
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS_READ)

        return new Date(map.modifiedDate).toISOString()
      }
    }
  })
})

export default GraphQLMap