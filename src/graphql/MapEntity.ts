import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { MapEntityType } from "../interfaces/Map";

import { MobControllerToken } from "../controllers/MobController";
import { MapControllerToken } from "../controllers/MapController";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMapEntity } from "../entities/MapEntity";

import { GraphQLMap } from "./Map";
import { GraphQLMob } from "./Mob";


export const GraphQLMapEntity: GraphQLObjectType = new GraphQLObjectType({
  name: 'MapEntity',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (entity: IMapEntity) => entity.hashId
    },
    type: {
      type: GraphQLString,
      resolve: (entity: IMapEntity) => MapEntityType[entity.typeId]?.toLowerCase()
    },
    aggressive: {
      type: GraphQLBoolean,
      resolve: (entity: IMapEntity) => entity.aggressive
    },
    x: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.x
    },
    y: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.y
    },
    z: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.z
    },
    xOffset: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.xOffset
    },
    yOffset: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.yOffset
    },
    direction: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.direction
    },
    interval: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.interval
    },
    probability: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.probability
    },
    count: {
      type: GraphQLInt,
      resolve: (entity: IMapEntity) => entity.count
    },
    map: {
      type: GraphQLMap,
      resolve: (entity: IMapEntity, args: any, context: IGraphQLContext) => {
        const mapController = Container.get(MapControllerToken)
        return mapController.getMapById(entity.mapId, context)
      }
    },
    mob: {
      type: GraphQLMob,
      resolve: (entity: IMapEntity, args: any, context: IGraphQLContext) => {
        if (entity.typeId !== MapEntityType.MOB && entity.typeId !== MapEntityType.MOB_RANDOM_LOCATION) return

        const mobController = Container.get(MobControllerToken)
        return mobController.getMobById(entity.mobId, context)
      }
    },
    mobGroup: {
      type: GraphQLMob,
      resolve: (entity: IMapEntity, args: any, context: IGraphQLContext) => {
        if (entity.typeId !== MapEntityType.MOB_GROUP) return

        const mobController = Container.get(MobControllerToken)
        return mobController.getMobGroupById(entity.mobGroupId, context)
      }
    },
    mobGroupGroup: {
      type: GraphQLMob,
      resolve: (entity: IMapEntity, args: any, context: IGraphQLContext) => {
        if (entity.typeId !== MapEntityType.MOB_GROUP_GROUP) return

        const mobController = Container.get(MobControllerToken)
        return mobController.getMobGroupGroupById(entity.mobGroupGroupId, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (entity: IMapEntity, args: any, context: IGraphQLContext) => new Date(entity.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (entity: IMapEntity, args: any, context: IGraphQLContext) => new Date(entity.modifiedDate).toISOString()
    }

  })
})
