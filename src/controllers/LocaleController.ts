import JSZip from "jszip"

import Container, { Token } from "../infrastructures/Container"

import { getEnumValues } from "../helpers/Enum"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"
import { ErrorMessage } from "../interfaces/ErrorMessage"

import { EntityFilterMethod } from "../interfaces/Entity"
import { Authorization } from "../interfaces/Auth"

import { IHttpRouterContext } from "../entities/HttpRouterContext"
import HttpRouterError from "../entities/HttpRouterError"

import { LocaleRepositoryToken } from "../repositories/LocaleRepository"

import { GameItemServiceToken } from "../services/GameItemService"
import { PaginationOptions } from "../services/PaginationService"
import { GameMobServiceToken } from "../services/GameMobService"
import { LocaleServiceToken } from "../services/LocaleService"

import { ILocaleItem } from "../entities/LocaleItem"
import { ILocaleMob } from "../entities/LocaleMob"
import { ILocale } from "../entities/Locale"

import Controller, { IController } from "./Controller"

export const LocaleControllerToken = new Token<ILocaleController>("LocaleController")

export type LocaleOptions = PaginationOptions & {

}

export type LocaleItemOptions = PaginationOptions & {
  id: number[]
  localeId: number[]
  itemId: number[]
}

export type LocaleMobOptions = PaginationOptions & {
  id: number[]
  localeId: number[]
  mobId: number[]
}

export enum LocaleRequestAction {
  IMPORT_ITEM_DESCRIPTIONS,
  IMPORT_ITEM_NAMES,
  IMPORT_MOB_NAMES
}

export type ILocaleController = IController & {
  getLocales(options: LocaleOptions, context: IHttpRouterContext): Promise<ILocale[]>
  getLocaleById(id: number, context: IHttpRouterContext): Promise<ILocale>
  getLocaleByHashId(hashId: string, context: IHttpRouterContext): Promise<ILocale>

  getLocaleItems(options: LocaleItemOptions, context: IHttpRouterContext): Promise<ILocaleItem[]>
  getLocaleItemById(id: number, context: IHttpRouterContext): Promise<ILocaleItem>
  getLocaleItemByHashId(hashId: string, context: IHttpRouterContext): Promise<ILocaleItem>

  getLocaleMobs(options: LocaleMobOptions, content: IHttpRouterContext): Promise<ILocaleMob[]>
  getLocaleMobById(id: number, context: IHttpRouterContext): Promise<ILocaleMob>
  getLocaleMobByHashId(hashId: string, context: IHttpRouterContext): Promise<ILocaleMob>
}

export default class LocaleController extends Controller implements ILocaleController {

  init() {
    this.get('/locales/:localeId/items', this.handleLocaleItemsGetRequest.bind(this))
    this.post('/locales/:localeId/items', this.handleLocaleItemsPostRequest.bind(this))

    this.get('/locales/:localeId/mobs', this.handleLocaleMobsGetRequest.bind(this))
    this.post('/locales/:localeId/mobs', this.handleLocaleMobsPostRequest.bind(this))
  }

  async handleLocaleItemsGetRequest(context: IHttpRouterContext) {
    // const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.ITEMS, AuthorizationAction.EXPORT) 

    let { localeId } = context.parameters;

    // this.log("getLocaleItemsRequest", { accountId: auth.accountId, localeId })

    const locale = await this.getLocaleByHashId(localeId, context)

    const gameItemService = Container.get(GameItemServiceToken)
    const localeRepository = Container.get(LocaleRepositoryToken)

    const items = await localeRepository.getLocaleItems({
      filter: {
        "locale_item.locale_item_locale_id": locale.id
      }
    })

    const itemDescriptionsPromise = gameItemService.createItemDescriptions(items)
    const itemNamesPromise = gameItemService.createItemNames(items, {
      transform: (item: ILocaleItem) => item.name ? [item.itemId, item.name] : undefined
    })

    const itemNames = await itemNamesPromise
    const itemDescriptions = await itemDescriptionsPromise

    const zip = new JSZip()

    zip.file("item_names.txt", itemNames)
    zip.file("itemdesc.txt", itemDescriptions)

    const content = zip.generateNodeStream({ streamFiles: true })

    context.setHeader("Content-disposition", `attachment; filename=items_${locale.code}.zip`)
    context.setHeader("Content-type", "application/zip, application/octet-stream")

    context.setStatus(HttpStatusCode.OK)
    context.setBody(content)
  }

  async handleLocaleItemsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.LOCALES_ITEMS_IMPORT)

    let { localeId } = context.parameters;
    let { action } = context.body;

    [action] = getEnumValues(LocaleRequestAction, action)

    this.log("postLocaleItems", { accountId: auth.accountId, localeId, action })

    const locale = await this.getLocaleByHashId(localeId, context)

    switch (action) {

      case LocaleRequestAction.IMPORT_ITEM_NAMES:
        await this.handleItemNamesImportRequest(locale, context.body)
        break

      case LocaleRequestAction.IMPORT_ITEM_DESCRIPTIONS:
        await this.handleItemDescriptionsImportRequest(locale, context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })

  }

  async handleLocaleMobsGetRequest(context: IHttpRouterContext) {
    // const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.MOBS, AuthorizationAction.EXPORT) 

    let { localeId } = context.parameters;

    // this.log("getLocaleItemsRequest", { accountId: auth.accountId, localeId })

    const locale = await this.getLocaleByHashId(localeId, context)

    const gameMobService = Container.get(GameMobServiceToken)
    const localeRepository = Container.get(LocaleRepositoryToken)

    const mobs = await localeRepository.getLocaleMobs({
      filter: {
        "locale_mob.locale_mob_locale_id": locale.id
      }
    })

    const mobNamesPromise = gameMobService.createMobNames(mobs, {
      transform: (mob: ILocaleMob) => mob.name ? [mob.mobId, mob.name] : undefined
    })

    const mobNames = await mobNamesPromise

    const zip = new JSZip()

    zip.file("mob_names.txt", mobNames)

    const content = zip.generateNodeStream({ streamFiles: true })

    context.setHeader("Content-disposition", `attachment; filename=items_${locale.code}.zip`)
    context.setHeader("Content-type", "application/zip, application/octet-stream")

    context.setStatus(HttpStatusCode.OK)
    context.setBody(content)
  }

  async handleLocaleMobsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.LOCALES_MOBS_IMPORT)

    let { localeId } = context.parameters;
    let { action } = context.body;

    [action] = getEnumValues(LocaleRequestAction, action)

    this.log("postLocaleMobs", { accountId: auth.accountId, localeId, action })

    const locale = await this.getLocaleByHashId(localeId, context)

    switch (action) {

      case LocaleRequestAction.IMPORT_MOB_NAMES:
        await this.handleMobNamesImportRequest(locale, context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })
  }

  async handleItemNamesImportRequest(locale: ILocale, options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    this.log("importItemNames", { localeId: locale.id, localeCode: locale.code })

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    const localeService = Container.get(LocaleServiceToken)
    await localeService.importItemNames(locale.id, file.path, { update })
  }

  async handleItemDescriptionsImportRequest(locale: ILocale, options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    this.log("importItemDescriptions", { localeId: locale.id, localeCode: locale.code })

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    const localeService = Container.get(LocaleServiceToken)
    await localeService.importItemDescriptions(locale.id, file.path, { update })
  }

  async handleMobNamesImportRequest(locale: ILocale, options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    this.log("importMobNames", { localeId: locale.id, localeCode: locale.code })

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    const localeService = Container.get(LocaleServiceToken)
    await localeService.importMobNames(locale.id, file.path, { update })
  }


  async getLocales(options: LocaleOptions, context: IHttpRouterContext) {
    this.log("getLocales", options)

    const localeService = Container.get(LocaleServiceToken)
    const paginationOptions = localeService.getLocalePaginationOptions(options)

    return context.dataLoaderService.getLocales({
      ...paginationOptions
    })
  }

  async getLocaleById(id: number, context: IHttpRouterContext) {
    this.log("getLocaleById", { id })

    const [locale] = await context.dataLoaderService.getLocalesById(id)
    if (!locale) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.LOCALE_NOT_FOUND)

    return locale
  }

  async getLocaleByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getLocaleByHashId", { hashId })

    const localeService = Container.get(LocaleServiceToken)
    const [id] = localeService.deobfuscateLocaleId(hashId)

    return this.getLocaleById(id, context)
  }


  async getLocaleItems(options: LocaleItemOptions, context: IHttpRouterContext) {
    this.log("getLocaleItems", options)

    const { id, itemId, localeId } = options

    const localeService = Container.get(LocaleServiceToken)
    const paginationOptions = localeService.getLocaleItemPaginationOptions(options)

    return context.dataLoaderService.getLocaleItems({
      ...paginationOptions,
      id: id ? [EntityFilterMethod.IN, id] : undefined,
      localeId: localeId ? [EntityFilterMethod.IN, localeId] : undefined,
      itemId: itemId ? [EntityFilterMethod.IN, itemId] : undefined,
    })
  }

  async getLocaleItemById(id: number, context: IHttpRouterContext) {
    this.log("getLocaleItemById", { id })

    const [item] = await context.dataLoaderService.getLocaleItemsById(id)
    if (!item) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.LOCALE_ITEM_NOT_FOUND)

    return item
  }

  async getLocaleItemByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getLocaleItemByHashId", { hashId })

    const localeService = Container.get(LocaleServiceToken)
    const [id] = localeService.deobfuscateLocaleItemId(hashId)

    return this.getLocaleItemById(id, context)
  }


  async getLocaleMobs(options: LocaleMobOptions, context: IHttpRouterContext) {
    this.log("getLocaleMobs", options)

    const { id, mobId, localeId } = options

    const localeService = Container.get(LocaleServiceToken)
    const paginationOptions = localeService.getLocaleMobPaginationOptions(options)

    return context.dataLoaderService.getLocaleMobs({
      ...paginationOptions,
      id: id ? [EntityFilterMethod.IN, id] : undefined,
      localeId: localeId ? [EntityFilterMethod.IN, localeId] : undefined,
      mobId: mobId ? [EntityFilterMethod.IN, mobId] : undefined,
    })
  }

  async getLocaleMobById(id: number, context: IHttpRouterContext) {
    this.log("getLocaleMobById", { id })

    const [mob] = await context.dataLoaderService.getLocaleMobsById(id)
    if (!mob) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.LOCALE_MOB_NOT_FOUND)

    return mob
  }

  async getLocaleMobByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getLocaleMobByHashId", { hashId })

    const localeService = Container.get(LocaleServiceToken)
    const [id] = localeService.deobfuscateLocaleMobId(hashId)

    return this.getLocaleMobById(id, context)
  }

}