import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMobGroupGroup } from "../entities/MobGroupGroup";

import { GraphQLMobGroupGroupMobGroup } from "./MobGroupGroupMobGroup";


export const GraphQLMobGroupGroup: GraphQLObjectType = new GraphQLObjectType({
  name: 'MobGroupGroup',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (group: IMobGroupGroup) => group.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (group: IMobGroupGroup) => group.name
    },
    groups: {
      type: new GraphQLList(GraphQLMobGroupGroupMobGroup),
      resolve: (group: IMobGroupGroup, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobGroupGroupMobGroupsByMobGroupGroupId(group.id)
    },
    createdDate: {
      type: GraphQLString,
      resolve: (group: IMobGroupGroup) => new Date(group.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (group: IMobGroupGroup) => new Date(group.modifiedDate).toISOString()
    }
  })
})
