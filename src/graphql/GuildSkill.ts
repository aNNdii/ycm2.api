import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

import { IGuildSkill } from "../services/GameGuildService";

import { GuildSkill } from "../interfaces/Guild";

const GraphQLGuildSkill = new GraphQLObjectType({
  name: 'GuildSkill',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (skill: IGuildSkill) => skill.id
    },
    name: {
      type: GraphQLString, 
      resolve: (skill: IGuildSkill) => GuildSkill[skill.id]?.toLowerCase()
    },
    level: {
      type: GraphQLInt,
      resolve: (skill: IGuildSkill) => skill.level
    }
  })
})

export default GraphQLGuildSkill