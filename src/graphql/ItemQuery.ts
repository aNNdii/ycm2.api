import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";

import { ItemControllerToken } from "../controllers/ItemController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLItem from "./Item";


const GraphQLItemQuery = {
  item: {
    type: GraphQLItem,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      let { id } = args || {}

      id = parseInt(id)

      const itemController = Container.get(ItemControllerToken)
      return itemController.getItemById(id, context)
    }
  },
  items: {
    type: new GraphQLList(GraphQLItem),
    args: {
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const itemController = Container.get(ItemControllerToken)
      return itemController.getItems(args, context)
    }
  }
}

export default GraphQLItemQuery