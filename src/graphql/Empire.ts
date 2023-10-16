import { GraphQLEnumType } from "graphql";

import { Empire } from "../interfaces/Empire";


export const GraphQLEmpire = new GraphQLEnumType({
  name: 'Empire',
  values: {
    [Empire[Empire.RED].toLowerCase()]: { value: Empire.RED },
    [Empire[Empire.YELLOW].toLowerCase()]: { value: Empire.YELLOW },
    [Empire[Empire.BLUE].toLowerCase()]: { value: Empire.BLUE },
  }
})