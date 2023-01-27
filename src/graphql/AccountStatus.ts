import { GraphQLEnumType } from "graphql";

import { AccountStatus } from "../interfaces/Account";

const GraphQLAccountStatus = new GraphQLEnumType({
  name: 'AccountStatus',
  values: {
    [AccountStatus.OK.toLowerCase()]: { value: AccountStatus.OK },
    [AccountStatus.BLOCK.toLowerCase()]: { value: AccountStatus.BLOCK }
  }
})

export default GraphQLAccountStatus