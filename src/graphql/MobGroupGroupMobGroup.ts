import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { IMobGroupGroupMobGroup } from "../entities/MobGroupGroupMobGroup";
import { IGraphQLContext } from "../entities/GraphQLContext";

import { MobControllerToken } from "../controllers/MobController";

import GraphQLMobGroupGroup from "./MobGroupGroup";
import GraphQLMobGroup from "./MobGroup";

const GraphQLMobGroupGroupMobGroup: GraphQLObjectType = new GraphQLObjectType({
  name: 'MobGroupGroupMobGroup',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (group: IMobGroupGroupMobGroup) => group.id
    },
    group: {
      type: GraphQLMobGroup,
      resolve: (group: IMobGroupGroupMobGroup, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobGroupById(group.mobGroupId, context)
      }
    },
    groupGroup: {
      type: GraphQLMobGroupGroup,
      resolve: (group: IMobGroupGroupMobGroup, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobGroupGroupById(group.mobGroupGroupId, context)
      }
    },
    probability: {
      type: GraphQLInt,
      resolve: (group: IMobGroupGroupMobGroup) => group.probability
    },
    createdDate: {
      type: GraphQLString,
      resolve: (group: IMobGroupGroupMobGroup) => new Date(group.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (group: IMobGroupGroupMobGroup) => new Date(group.modifiedDate).toISOString()
    }

  })
})

export default GraphQLMobGroupGroupMobGroup