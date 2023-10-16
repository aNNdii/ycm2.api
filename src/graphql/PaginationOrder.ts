import { GraphQLEnumType } from "graphql";

export const PaginationOrders = {
  'id_asc': { value: 'id_asc' },
  'id_desc': { value: 'id_desc' }
}

export const GraphQLPaginationOrder = new GraphQLEnumType({
  name: 'Order', 
  values: PaginationOrders
})
