import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMobGroup } from "../entities/MobGroup";

import GraphQLMobGroupGroupMobGroup from "./MobGroupGroupMobGroup";
import GraphQLMobGroupMob from "./MobGroupMob";

const GraphQLMobGroup: GraphQLObjectType = new GraphQLObjectType({
  name: 'MobGroup',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (group: IMobGroup) => group.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (group: IMobGroup) => group.name
    },
    groups: {
      type: new GraphQLList(GraphQLMobGroupGroupMobGroup),
      resolve: (group: IMobGroup, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobGroupGroupMobGroupsByMobGroupId(group.id)
    },
    mobs: {
      type: new GraphQLList(GraphQLMobGroupMob),
      resolve: (group: IMobGroup, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobGroupMobsByMobGroupId(group.id)
    },
    createdDate: {
      type: GraphQLString,
      resolve: (group: IMobGroup) => new Date(group.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (group: IMobGroup) => new Date(group.modifiedDate).toISOString()
    }
  })
})

export default GraphQLMobGroup