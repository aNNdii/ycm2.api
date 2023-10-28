import { Container, Token } from "../infrastructures/Container";

import { CharacterJob } from "../interfaces/Character";
import { CharacterItemWindow } from "../interfaces/CharacterItem";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { EntityFilter } from "../interfaces/Entity";
import { Empire } from "../interfaces/Empire";

import { CharacterRepositoryToken } from "../repositories/CharacterRepository";

import { CharacterItemProperties, ICharacterItem } from "../entities/CharacterItem";
import { ICharacter, CharacterProperties } from "../entities/Character";

import { EntityService, EntityServiceOptions, IEntityService } from "./EntityService";
import { PaginationOptions } from "./PaginationService";

export const CharacterServiceToken = new Token<ICharacterService>("CharacterService")

export type CharacterOptions = PaginationOptions & {
  id?: EntityFilter<number>
  guildId?: EntityFilter<number>
  accountId?: EntityFilter<number>
  empireId?: EntityFilter<Empire>
  jobId?: EntityFilter<CharacterJob>
}

export type CharacterItemOptions = PaginationOptions & {
  itemId?: EntityFilter<number>
  characterId?: EntityFilter<number>
  window?: EntityFilter<CharacterItemWindow>
}

export type CharacterServiceOptions = EntityServiceOptions & {
  characterObfuscationSalt: string
  characterItemObfuscationSalt: string
}

export type ICharacterService = IEntityService & {
  obfuscateCharacterId(id: any): string
  deobfuscateCharacterId(value: string | string[]): number[]
  obfuscateCharacterItemId(id: any): string
  deobfuscateCharacterItemId(value: string | string[]): number[]

  getCharacterPaginationOptions(args: any): PaginationOptions
  getCharacterItemPaginationOptions(args: any): PaginationOptions

  getCharacters(options?: CharacterOptions): Promise<ICharacter[]>
  getCharacterItems(options?: CharacterItemOptions): Promise<ICharacterItem[]>
}

export class CharacterService extends EntityService<CharacterServiceOptions> implements ICharacterService {

  obfuscateCharacterId(id: any) {
    return this.obfuscateId(id, { salt: this.options.characterObfuscationSalt })
  }

  deobfuscateCharacterId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.CHARACTER_ID_INVALID,
      salt: this.options.characterObfuscationSalt,
    })
  }

  obfuscateCharacterItemId(id: any) {
    return this.obfuscateId(id, { salt: this.options.characterItemObfuscationSalt })
  }

  deobfuscateCharacterItemId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.CHARACTER_ITEM_ID_INVALID,
      salt: this.options.characterItemObfuscationSalt,
    })
  }

  getCharacterPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateCharacterId(offset) })
  }

  getCharacterItemPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateCharacterItemId(offset) })
  }

  async getCharacters(options?: CharacterOptions) {
    const {
      id,
      accountId,
      empireId,
      jobId,
      orderId,
      limit,
      offset
    } = options || {}

    this.log("getCharacters", options)

    const characterRepository = Container.get(CharacterRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'player.id' })

    const filter: CharacterProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["player.id"] = id
    if (accountId) filter["player.account_id"] = accountId
    if (empireId) filter["player_index.empire"] = empireId
    if (jobId) filter["player.job"] = jobId

    return characterRepository.getCharacters({ filter, where, order, limit })
  }

  async getCharacterItems(options?: CharacterItemOptions) {
    const {
      itemId,
      characterId,
      window,
      orderId,
      limit,
      offset
    } = options || {}

    this.log("getCharacterItems", options)

    const characterRepository = Container.get(CharacterRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'item.id' })

    const filter: CharacterItemProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (itemId) filter["item.vnum"] = itemId
    if (characterId) filter["item.owner_id"] = characterId
    if (window) filter["item.window"] = window

    return characterRepository.getCharacterItems({ filter, where, order, limit })
  }

}