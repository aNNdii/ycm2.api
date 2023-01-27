import { GraphQLInt, GraphQLObjectType } from "graphql";

import Container from "../infrastructures/Container";

import { ItemControllerToken } from "../controllers/ItemController";

import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLItemAttribute from "./ItemAttribute";


const GraphQLCharacterItemAttribute: GraphQLObjectType = new GraphQLObjectType({
  name: 'CharacterItemAttribute',
  fields: () => ({
    attribute: {
      type: GraphQLItemAttribute,
      resolve: async (itemAttribute: any, args: any, context: IGraphQLContext) => {
        if (!itemAttribute.attributeId) return null

        let attribute = null

        try {
          const itemController = Container.get(ItemControllerToken)
          attribute = await (itemAttribute.rare ? itemController.getItemRareAttributeById(itemAttribute.attributeId, context) : itemController.getItemAttributeById(itemAttribute.attributeId, context))
        } catch {
          attribute = { id: itemAttribute.attributeId }
        }

        return attribute
      }
    },
    value: {
      type: GraphQLInt,
      resolve: (itemAttribute: any) => itemAttribute.value
    }
  })
})

export default GraphQLCharacterItemAttribute