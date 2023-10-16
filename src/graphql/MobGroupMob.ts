import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMobGroupMob } from "../entities/MobGroupMob";

import { MobControllerToken } from "../controllers/MobController";

import { GraphQLMobGroup } from "./MobGroup";
import { GraphQLMob } from "./Mob";


export const GraphQLMobGroupMob: GraphQLObjectType = new GraphQLObjectType({
  name: 'MobGroupMob',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (mob: IMobGroupMob) => mob.hashId
    },
    leader: {
      type: GraphQLBoolean,
      resolve: (mob: IMobGroupMob) => mob.leader
    },
    mob: {
      type: GraphQLMob,
      resolve: (mob: IMobGroupMob, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobById(mob.mobId, context)
      }
    },
    group: {
      type: GraphQLMobGroup,
      resolve: (mob: IMobGroupMob, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobGroupById(mob.mobGroupId, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (mob: IMobGroupMob) => new Date(mob.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (mob: IMobGroupMob) => new Date(mob.modifiedDate).toISOString()
    }
  })
})
