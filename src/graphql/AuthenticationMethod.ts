import { GraphQLEnumType } from "graphql";

import { AuthenticationMethod } from "../interfaces/Auth";

const GraphQLAuthenticationMethod = new GraphQLEnumType({
  name: 'AuthenticationMethod',
  values: {
    [AuthenticationMethod[AuthenticationMethod.PASSWORD].toLowerCase()]: { value: AuthenticationMethod.PASSWORD },
    [AuthenticationMethod[AuthenticationMethod.REFRESH_TOKEN].toLowerCase()]: { value: AuthenticationMethod.REFRESH_TOKEN }
  }
})

export default GraphQLAuthenticationMethod