import { Container, Token } from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { CharacterItemWindow } from "../interfaces/CharacterItem";
import { EntityFilterMethod } from "../interfaces/Entity";
import { CharacterJob } from "../interfaces/Character";
import { Empire } from "../interfaces/Empire";

import { CharacterServiceToken } from "../services/CharacterService";
import { PaginationOptions } from "../services/PaginationService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import { HttpRouterError } from "../entities/HttpRouterError";
import { ICharacterItem } from "../entities/CharacterItem";
import { ICharacter } from "../entities/Character";

import { Controller, IController } from "./Controller";

export const CharacterControllerToken = new Token<ICharacterController>("CharacterController")

export type CharacterOptions = PaginationOptions & {
  accountId?: number[]
  empireId?: Empire[]
  jobId?: CharacterJob[]
}

export type CharacterItemOptions = PaginationOptions & {
  characterId?: number[]
  itemId?: number[]
  window?: CharacterItemWindow[]
}

export type ICharacterController = IController & {
  getCharacters(options: CharacterOptions, context: IHttpRouterContext): Promise<ICharacter[]>
  getCharacterById(id: number, context: IHttpRouterContext): Promise<ICharacter>
  getCharacterByHashId(hashId: string, context: IHttpRouterContext): Promise<ICharacter>

  getCharacterItems(options: CharacterItemOptions, context: IHttpRouterContext): Promise<ICharacterItem[]>
}

export class CharacterController extends Controller implements ICharacterController {

  async getCharacters(options: CharacterOptions, context: IHttpRouterContext) {
    this.log("getCharacters", options)

    const { accountId, empireId, jobId } = options

    const characterService = Container.get(CharacterServiceToken)
    const paginationOptions = characterService.getCharacterPaginationOptions(options)

    return context.dataLoaderService.getCharacters({
      ...paginationOptions,
      accountId: accountId ? [EntityFilterMethod.IN, accountId] : undefined,
      empireId: empireId ? [EntityFilterMethod.IN, empireId] : undefined,
      jobId: jobId ? [EntityFilterMethod.IN, jobId] : undefined
    })
  }

  async getCharacterById(id: number, context: IHttpRouterContext) {
    this.log("getCharacterById", { id })

    const [character] = await context.dataLoaderService.getCharactersById(id)
    if (!character) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ACCOUNT_NOT_FOUND)

    return character
  }

  getCharacterByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getCharacterByHashId", { hashId })

    const characterService = Container.get(CharacterServiceToken)
    const [id] = characterService.deobfuscateCharacterId(hashId)

    return this.getCharacterById(id, context)
  }

  async getCharacterItems(options: CharacterItemOptions, context: IHttpRouterContext) {
    this.log("getCharacterItems", options)

    const { characterId, itemId, window } = options

    const characterService = Container.get(CharacterServiceToken)
    const paginationOptions = characterService.getCharacterItemPaginationOptions(options)

    return context.dataLoaderService.getCharacterItems({
      ...paginationOptions,
      characterId: characterId ? [EntityFilterMethod.IN, characterId] : undefined,
      itemId: itemId ? [EntityFilterMethod.IN, itemId] : undefined,
      window: window ? [EntityFilterMethod.IN, window] : undefined
    })
  }

}