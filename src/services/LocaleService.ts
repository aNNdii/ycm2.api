
import { Container, Token } from "../infrastructures/Container"

import { chunks } from "../helpers/Array"

import { ErrorMessage } from "../interfaces/ErrorMessage"
import { LocaleItemTable, LocaleMobTable } from "../interfaces/Locale"
import { EntityFilter } from "../interfaces/Entity"

import { LocaleRepositoryToken } from "../repositories/LocaleRepository"

import { ILocaleItem, LocaleItemProperties } from "../entities/LocaleItem"
import { ILocaleMob, LocaleMobProperties } from "../entities/LocaleMob"
import { ILocale, LocaleProperties } from "../entities/Locale"

import { EntityService, EntityOptions, IEntityService } from "./EntityService"
import { GameItemServiceToken } from "./GameItemService"
import { GameMobServiceToken } from "./GameMobService"
import { PaginationOptions } from "./PaginationService"

export const LocaleServiceToken = new Token<ILocaleService>("LocaleService")

export type LocaleImportOptions = {
  update?: boolean
}

export type LocaleOptions = PaginationOptions & {
  id?: EntityFilter<number>
  code?: EntityFilter<string>
}

export type LocaleItemOptions = PaginationOptions & {
  id?: EntityFilter<number>
  itemId?: EntityFilter<number>
  localeId?: EntityFilter<number>
}

export type LocaleMobOptions = PaginationOptions & {
  id?: EntityFilter<number>
  mobId?: EntityFilter<number>
  localeId?: EntityFilter<number>
}

export type LocaleServiceOptions = EntityOptions & {
  localeObfuscationSalt: string
  localeItemObfuscationSalt: string
  localeMobObfuscationSalt: string
}

export type ILocaleService = IEntityService & {
  obfuscateLocaleId(id: any): string
  deobfuscateLocaleId(value: string | string[]): number[]
  obfuscateLocaleItemId(id: any): string
  deobfuscateLocaleItemId(value: string | string[]): number[]
  obfuscateLocaleMobId(id: any): string
  deobfuscateLocaleMobId(value: string | string[]): number[]

  getLocalePaginationOptions(args: any): PaginationOptions
  getLocaleItemPaginationOptions(args: any): PaginationOptions
  getLocaleMobPaginationOptions(args: any): PaginationOptions

  getLocales(options?: LocaleOptions): Promise<ILocale[]>
  getLocaleItems(options?: LocaleItemOptions): Promise<ILocaleItem[]>
  getLocaleMobs(options?: LocaleMobOptions): Promise<ILocaleMob[]>

  importItemNames(localeId: number, path: string, options?: LocaleImportOptions): Promise<any>
  importItemDescriptions(localeId: number, path: string, options?: LocaleImportOptions): Promise<any>
  importMobNames(localeId: number, path: string, options?: LocaleImportOptions): Promise<any>
}

export class LocaleService extends EntityService<LocaleServiceOptions> implements ILocaleService {

  obfuscateLocaleId(id: any) {
    return this.obfuscateId(id, { salt: this.options.localeObfuscationSalt })
  }

  deobfuscateLocaleId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.LOCALE_INVALID_ID,
      salt: this.options.localeObfuscationSalt,
    })
  }

  obfuscateLocaleItemId(id: any) {
    return this.obfuscateId(id, { salt: this.options.localeObfuscationSalt })
  }

  deobfuscateLocaleItemId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.LOCALE_ITEM_INVALID_ID,
      salt: this.options.localeObfuscationSalt,
    })
  }

  obfuscateLocaleMobId(id: any) {
    return this.obfuscateId(id, { salt: this.options.localeObfuscationSalt })
  }

  deobfuscateLocaleMobId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.LOCALE_MOB_INVALID_ID,
      salt: this.options.localeObfuscationSalt,
    })
  }

  getLocalePaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateLocaleId(offset) })
  }

  getLocaleItemPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateLocaleItemId(offset) })
  }

  getLocaleMobPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateLocaleMobId(offset) })
  }

  getLocales(options?: LocaleOptions) {
    const {
      id,
      code,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getLocales", options)

    const localeRepository = Container.get(LocaleRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'locale.locale_id' })

    const filter: LocaleProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["locale.locale_id"] = id
    if (code) filter["locale.locale_code"] = code

    return localeRepository.getLocales({ filter, where, order, limit })
  }

  getLocaleItems(options?: LocaleItemOptions) {
    const {
      id,
      itemId,
      localeId,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getLocaleItems", options)

    const localeRepository = Container.get(LocaleRepositoryToken)

    const orders = {
      ...this.getPaginationColumnOptions({ key: 'id', column: 'locale_item.locale_item_item_id' })
    }

    const filter: LocaleItemProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["locale_item.locale_item_id"] = id
    if (itemId) filter["locale_item.locale_item_item_id"] = itemId
    if (localeId) filter["locale_item.locale_item_locale_id"] = localeId

    return localeRepository.getLocaleItems({ filter, where, order, limit })
  }

  getLocaleMobs(options?: LocaleMobOptions) {
    const {
      id,
      mobId,
      localeId,
      orderId, 
      offset,
      limit
    } = options || {}

    this.log("getLocaleMobs", options)

    const localeRepository = Container.get(LocaleRepositoryToken)

    const orders = {
      ...this.getPaginationColumnOptions({ key: 'id', column: 'locale_mob.locale_mob_mob_id' })
    }

    const filter: LocaleMobProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["locale_mob.locale_mob_id"] = id
    if (mobId) filter["locale_mob.locale_mob_mob_id"] = mobId
    if (localeId) filter["locale_mob.locale_mob_locale_id"] = localeId

    return localeRepository.getLocaleMobs({ filter, where, order, limit })
  }

  async importItemNames(localeId: number, path: string, options?: LocaleImportOptions) {
    const { update } = options || {}

    this.log("importItemNames", { localeId, path, update })

    const gameItemService = Container.get(GameItemServiceToken)
    const localeItems = await gameItemService.readItemNames<Partial<LocaleItemTable>>(path, {
      transform: row => ({
        locale_item_locale_id: localeId,
        locale_item_item_id: row.id,
        locale_item_name: row.name
      })
    })

    const itemChunks = chunks(localeItems, 500)

    const localeRepository = Container.get(LocaleRepositoryToken)
    const localeItemPromises = itemChunks.map(entities => localeRepository.createLocaleItems({
      entities,
      duplicate: update ? ['locale_item_name'] : undefined
    }))

    return Promise.all(localeItemPromises)
  }

  async importItemDescriptions(localeId: number, path: string, options?: LocaleImportOptions) {
    const { update } = options || {}

    this.log("importItemDescriptions", { localeId, path, update })

    const gameItemService = Container.get(GameItemServiceToken)
    const localeItems = await gameItemService.readItemDescriptions<Partial<LocaleItemTable>>(path, {
      transform: row => ({
        locale_item_locale_id: localeId,
        locale_item_item_id: row.id,
        locale_item_name: row.name,
        locale_item_description: row.description,
        locale_item_category: row.category
      })
    })

    const itemChunks = chunks(localeItems, 500)

    const localeRepository = Container.get(LocaleRepositoryToken)
    const localeItemPromises = itemChunks.map(entities => localeRepository.createLocaleItems({
      entities,
      duplicate: update ? ['locale_item_name', 'locale_item_description', 'locale_item_category'] : undefined
    }))

    return Promise.all(localeItemPromises)

  }

  async importMobNames(localeId: number, path: string, options?: LocaleImportOptions) {
    const { update } = options || {}

    this.log("importMobNames", { localeId, path, update })

    const gameMobService = Container.get(GameMobServiceToken)
    const localeMobs = await gameMobService.readMobNames<Partial<LocaleMobTable>>(path, {
      transform: row => ({
        locale_mob_locale_id: localeId,
        locale_mob_mob_id: row.id,
        locale_mob_name: row.name
      })
    })

    const mobChunks = chunks(localeMobs, 500)

    const localeRepository = Container.get(LocaleRepositoryToken)
    const localeMobPromises = mobChunks.map(entities => localeRepository.createLocaleMobs({
      entities,
      duplicate: update ? ['locale_mob_name'] : undefined
    }))

    return Promise.all(localeMobPromises)
  }

}