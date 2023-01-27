import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { Authorization, AuthorizationAction } from "../interfaces/Auth";

import { IGraphQLContext } from "../entities/GraphQLContext";

import { IMap } from "../entities/Map";

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
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.width
      }
    },
    height: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.height
      }
    },
    baseX: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.baseX
      }
    },
    baseY: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.baseY
      }
    },
    viewRadius: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.viewRadius
      }
    },
    heightScale: {
      type: GraphQLFloat,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.heightScale
      }
    },
    cellScale: {
      type: GraphQLInt,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.cellScale
      }
    },
    texture: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.texture
      }
    },
    environment: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return map.environment
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return new Date(map.createdDate).toISOString()
      }
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (map: IMap, args: any, context: IGraphQLContext) => {
        const auth = context.getAuth()
        auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.READ)

        return new Date(map.modifiedDate).toISOString()
      }
    }
  })
})

export default GraphQLMap