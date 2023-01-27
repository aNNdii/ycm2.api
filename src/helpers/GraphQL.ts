import { GraphQLEnumType, GraphQLInt, GraphQLString } from "graphql"

import GraphQLPaginationOrder from "../graphql/PaginationOrder"

export type PaginationArgumentOptions = {
  orders?: GraphQLEnumType
}

export const getPaginationArguments = (options?: PaginationArgumentOptions) => {
  const { orders } = options || {}

  return {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLString },
    order: { type: orders || GraphQLPaginationOrder }
  }
}

