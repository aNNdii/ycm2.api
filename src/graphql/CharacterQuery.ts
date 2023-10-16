import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql"

import { Container } from "../infrastructures/Container"

import { getPaginationArguments } from "../helpers/GraphQL"

import { Authorization } from "../interfaces/Auth"

import { CharacterControllerToken } from "../controllers/CharacterController"

import { IGraphQLContext } from "../entities/GraphQLContext"

import { GraphQLEmpire } from "./Empire"
import { GraphQLCharacterJob } from "./CharacterJob"
import { GraphQLCharacter } from "./Character"


export const GraphQLCharacterQuery = {
  character: {
    type: GraphQLCharacter,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const { id: hashId } = args || {}

      const auth = context.getAuth()
      auth.verifyAuthorization(Authorization.CHARACTERS_READ)

      const characterController = Container.get(CharacterControllerToken)
      return characterController.getCharacterByHashId(hashId, context)
    }
  },
  characters: {
    type: new GraphQLList(GraphQLCharacter),
    args: {
      empire: { type: new GraphQLList(GraphQLEmpire) },
      job: { type: new GraphQLList(GraphQLCharacterJob) },
      ...getPaginationArguments()
    },
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const auth = context.getAuth()
      auth.verifyAuthorization(Authorization.CHARACTERS_READ)

      const characterController = Container.get(CharacterControllerToken)
      return characterController.getCharacters(args, context)
    }
  }
}