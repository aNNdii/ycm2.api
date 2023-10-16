import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { Container } from "../infrastructures/Container";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { ILocaleMob } from "../entities/LocaleMob";

import { LocaleControllerToken } from "../controllers/LocaleController";
import { MobControllerToken } from "../controllers/MobController";

import { GraphQLLocale } from "./Locale";
import { GraphQLMob } from "./Mob";


export const GraphQLLocaleMob: GraphQLObjectType = new GraphQLObjectType({
  name: 'LocaleMob',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (mob: ILocaleMob) => mob.hashId
    },
    name: {
      type: GraphQLString,
      resolve: (mob: ILocaleMob) => mob.name
    },
    locale: {
      type: GraphQLLocale,
      resolve: (mob: ILocaleMob, args: any, context: IGraphQLContext) => {
        const localeController = Container.get(LocaleControllerToken)
        return localeController.getLocaleById(mob.localeId, context)
      }
    },
    mob: {
      type: GraphQLMob,
      resolve: (mob: ILocaleMob, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mobController.getMobById(mob.mobId, context)
      }
    },
    createdDate: {
      type: GraphQLString,
      resolve: (mob: ILocaleMob) => new Date(mob.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (mob: ILocaleMob) => new Date(mob.modifiedDate).toISOString()
    }
  })
})
