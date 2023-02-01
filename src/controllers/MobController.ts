import JSZip from "jszip"

import Container, { Token } from "../infrastructures/Container"

import { getEnumValues } from "../helpers/Enum"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"
import { ErrorMessage } from "../interfaces/ErrorMessage"
import { Authorization } from "../interfaces/Auth"
import { GameMobProtoFormat } from "../interfaces/GameMob"

import { IHttpRouterContext } from "../entities/HttpRouterContext"
import HttpRouterError from "../entities/HttpRouterError"

import { MobRepositoryToken } from "../repositories/MobRepository"

import { GameMobServiceToken } from "../services/GameMobService"
import { MobServiceToken } from "../services/MobService"

import { IMobGroupGroupMobGroup } from "../entities/MobGroupGroupMobGroup"
import { IMobGroupGroup } from "../entities/MobGroupGroup"
import { IMobGroupMob } from "../entities/MobGroupMob"
import { IMobRankItem } from "../entities/MobRankItem"
import { IMobGroup } from "../entities/MobGroup"
import { IMobItem } from "../entities/MobItem"
import { IMob } from "../entities/Mob"

import Controller, { IController } from "./Controller"

export const MobControllerToken = new Token<IMobController>("MobController")

export enum MobRequestAction {
  IMPORT_MOB_NAMES,
  IMPORT_MOB_PROTO,
  IMPORT_DATABASE_MOB_PROTO,

  IMPORT_COMMON_DROP_ITEM,
  IMPORT_MOB_DROP_ITEM,

  IMPORT_MOB_GROUP,
  IMPORT_MOB_GROUP_GROUP,
}

export type IMobController = IController & {
  getMobs(options: any, context: IHttpRouterContext): Promise<IMob[]>
  getMobById(id: number, context: IHttpRouterContext): Promise<IMob>

  getMobItems(options: any, context: IHttpRouterContext): Promise<IMobItem[]>
  getMobItemById(id: number, context: IHttpRouterContext): Promise<IMobItem>
  getMobItemByHashId(hashId: string, context: IHttpRouterContext): Promise<IMobItem>

  getMobRankItems(options: any, context: IHttpRouterContext): Promise<IMobRankItem[]>
  getMobRankItemById(id: number, context: IHttpRouterContext): Promise<IMobRankItem>
  getMobRankItemByHashId(hashId: string, context: IHttpRouterContext): Promise<IMobRankItem>

  getMobGroups(options: any, context: IHttpRouterContext): Promise<IMobGroup[]>
  getMobGroupById(id: number, context: IHttpRouterContext): Promise<IMobGroup>
  getMobGroupByHashId(hashId: string, context: IHttpRouterContext): Promise<IMobGroup>

  getMobGroupMobs(options: any, context: IHttpRouterContext): Promise<IMobGroupMob[]>
  getMobGroupMobById(id: number, context: IHttpRouterContext): Promise<IMobGroupMob>
  getMobGroupMobByHashId(hashId: string, context: IHttpRouterContext): Promise<IMobGroupMob>

  getMobGroupGroups(options: any, context: IHttpRouterContext): Promise<IMobGroupGroup[]>
  getMobGroupGroupById(id: number, context: IHttpRouterContext): Promise<IMobGroupGroup>
  getMobGroupGroupByHashId(hashId: string, context: IHttpRouterContext): Promise<IMobGroupGroup>

  getMobGroupGroupMobGroups(options: any, context: IHttpRouterContext): Promise<IMobGroupGroupMobGroup[]>
  getMobGroupGroupMobGroupById(id: number, context: IHttpRouterContext): Promise<IMobGroupGroupMobGroup>
  getMobGroupGroupMobGroupByHashId(hashId: string, context: IHttpRouterContext): Promise<IMobGroupGroupMobGroup>
}

export default class MobController extends Controller implements IMobController {

  init() {
    this.get('/mobs', this.handleMobsGetRequest.bind(this))
    this.post('/mobs', this.handleMobsPostRequest.bind(this))

    this.get('/mobs/items', this.handleMobItemsGetRequest.bind(this))
    this.post('/mobs/items', this.handleMobItemsPostRequest.bind(this))

    this.get('/mobs/groups', this.handleMobGroupsGetRequest.bind(this))
    this.post('/mobs/groups', this.handleMobGroupsPostRequest.bind(this))
  }

  async handleMobsGetRequest(context: IHttpRouterContext) {
    // const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.MOBS, AuthorizationAction.EXPORT)

    // this.log("getMobsRequest", { accountId: auth.accountId })

    const gameMobService = Container.get(GameMobServiceToken)
    const mobRepository = Container.get(MobRepositoryToken)

    const mobs = await mobRepository.getMobs()

    const mobProtoPromise = gameMobService.createMobProto(mobs)
    const mobNamePromise = gameMobService.createMobNames(mobs, {
      transform: (mob: IMob) => mob.localeName ? [mob.id, mob.localeName] : undefined
    })

    const mobProto = await mobProtoPromise
    const mobNames = await mobNamePromise

    const zip = new JSZip();

    zip.file("mob_proto.txt", mobProto)
    zip.file("mob_names.txt", mobNames)

    const content = zip.generateNodeStream({ streamFiles: true })

    context.setHeader("Content-disposition", "attachment; filename=mobs.zip")
    context.setHeader("Content-type", "application/zip, application/octet-stream")

    context.setStatus(HttpStatusCode.OK)
    context.setBody(content)
  }

  async handleMobItemsGetRequest(context: IHttpRouterContext) {
    // const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.MOBS, AuthorizationAction.EXPORT)

    // this.log("getMobItemsRequest", { accountId: auth.accountId })

    const gameMobService = Container.get(GameMobServiceToken)
    const mobRepository = Container.get(MobRepositoryToken)

    const mobRankItemPromise = mobRepository.getMobRankItems()
    const mobItemPromise = mobRepository.getMobItems()

    const mobRankItems = await mobRankItemPromise
    const mobItems = await mobItemPromise

    const commonDropItemPromise = gameMobService.createCommonDropItem(mobRankItems)
    const mobDropItemPromise = gameMobService.createMobDropItem(mobItems)

    const commonDropItem = await commonDropItemPromise
    const mobDropItem = await mobDropItemPromise

    const zip = new JSZip();

    zip.file("etc_drop_item.txt", "") 
    zip.file("drop_item_group.txt", "")

    zip.file("common_drop_item.txt", commonDropItem)
    zip.file("mob_drop_item.txt", mobDropItem)

    const content = zip.generateNodeStream({ streamFiles: true })

    context.setHeader("Content-disposition", "attachment; filename=mob_items.zip")
    context.setHeader("Content-type", "application/zip, application/octet-stream")

    context.setStatus(HttpStatusCode.OK)
    context.setBody(content)
  }

  async handleMobGroupsGetRequest(context: IHttpRouterContext) {
    // const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.MOBS, AuthorizationAction.EXPORT)

    // this.log("getMobGroupsRequest", { accountId: auth.accountId })

    const gameMobService = Container.get(GameMobServiceToken)
    const mobRepository = Container.get(MobRepositoryToken)

    const mobGroupGroupMobGroupPromise = mobRepository.getMobGroupGroupMobGroups()
    const mobGroupMobPromise = mobRepository.getMobGroupMobs()

    const mobGroupGroupMobGroups = await mobGroupGroupMobGroupPromise
    const mobGroupMobs = await mobGroupMobPromise

    const mobGroupGroupPromise = gameMobService.createMobGroupGroup(mobGroupGroupMobGroups)
    const mobGroupPromise = gameMobService.createMobGroup(mobGroupMobs)

    const mobGroupGroup = await mobGroupGroupPromise
    const mobGroup = await mobGroupPromise

    const zip = new JSZip();

    zip.file("group_group.txt", mobGroupGroup)
    zip.file("group.txt", mobGroup)

    const content = zip.generateNodeStream({ streamFiles: true })

    context.setHeader("Content-disposition", "attachment; filename=mob_groups.zip")
    context.setHeader("Content-type", "application/zip, application/octet-stream")

    context.setStatus(HttpStatusCode.OK)
    context.setBody(content)

  }

  async handleMobsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MOBS_IMPORT)

    let { action } = context.body;
    [action] = getEnumValues(MobRequestAction, action)

    this.log("postMobsRequest", { accountId: auth.accountId, action })

    switch (action) {

      case MobRequestAction.IMPORT_MOB_NAMES:
        await this.handleMobNamesImportRequest(context.body)
        break

      case MobRequestAction.IMPORT_MOB_PROTO:
        await this.handleMobProtoImportRequest(context.body)
        break

      case MobRequestAction.IMPORT_DATABASE_MOB_PROTO:
        await this.handleMobProtoDatabaseImportRequest(context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })
  }

  async handleMobItemsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MOBS_IMPORT)

    let { action } = context.body;
    [action] = getEnumValues(MobRequestAction, action)

    this.log("postMobItemsRequest", { accountId: auth.accountId, action })

    switch (action) {

      case MobRequestAction.IMPORT_MOB_DROP_ITEM:
        await this.handleMobDropItemImportRequest(context.body)
        break

      case MobRequestAction.IMPORT_COMMON_DROP_ITEM:
        await this.handleCommonDropItemRequest(context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })
  }

  async handleMobGroupsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MOBS_IMPORT)

    let { action } = context.body;
    [action] = getEnumValues(MobRequestAction, action)

    this.log("postMobGroupsRequest", { accountId: auth.accountId, action })

    switch (action) {

      case MobRequestAction.IMPORT_MOB_GROUP:
        await this.handleMobGroupImportRequest(context.body)
        break

      case MobRequestAction.IMPORT_MOB_GROUP_GROUP:
        await this.handleMobGroupGroupImportRequest(context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })

  }

  async handleMobNamesImportRequest(options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    this.log("importMobNames", { file: file.path, update })

    const mobService = Container.get(MobServiceToken)
    await mobService.importMobNames(file.path, { update })
  }

  async handleMobProtoImportRequest(options: any) {
    let { format, file, update } = options;

    [file] = file || [];
    [format] = getEnumValues(GameMobProtoFormat, format);
    update = ~~(update)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    this.log("importMobProto", { file: file.path, format, update })

    const mobService = Container.get(MobServiceToken)
    await mobService.importMobProto(file.path, { format, update })
  }

  async handleMobProtoDatabaseImportRequest(options: any) {
    let { update } = options;

    update = ~~(update)

    this.log("importDatabaseMobProto", { update })

    const mobService = Container.get(MobServiceToken)
    await mobService.importMobProtoFromDatabase({ update })
  }

  async handleMobDropItemImportRequest(options: any) {
    let { file, override } = options;

    [file] = file || [];
    override = ~~(override)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    this.log("importMobDropItem", { override })

    const mobService = Container.get(MobServiceToken)
    await mobService.importMobDropItem(file.path, { override })
  }

  async handleCommonDropItemRequest(options: any) {
    let { file, override } = options;

    [file] = file || [];
    override = ~~(override)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    this.log("importCommonDropItem", { override })

    const mobService = Container.get(MobServiceToken)
    await mobService.importCommonDropItem(file.path, { override })
  }

  async handleMobGroupImportRequest(options: any) {
    let { file, override } = options;

    [file] = file || [];
    override = ~~(override)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    this.log("importMobGroup", { override })

    const mobService = Container.get(MobServiceToken)
    await mobService.importMobGroup(file.path, { override })
  }

  async handleMobGroupGroupImportRequest(options: any) {
    let { file, override } = options;

    [file] = file || [];
    override = ~~(override)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    this.log("importMobGroupGroup", { override })

    const mobService = Container.get(MobServiceToken)
    await mobService.importMobGroupGroup(file.path, { override })
  }


  async getMobs(options: any, context: IHttpRouterContext) {
    const { rankId } = options || {}

    this.log("getMobs", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobPaginationOptions(options)

    return context.dataLoaderService.getMobs({
      ...paginationOptions,
      rankId
    })
  }

  async getMobById(id: number, context: IHttpRouterContext) {
    this.log("getMobById", { id })

    const [mob] = await context.dataLoaderService.getMobsById(id)
    if (!mob) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.MOB_NOT_FOUND)

    return mob
  }


  async getMobItems(options: any, context: IHttpRouterContext) {
    const { id, itemId, mobId } = options || {}
    
    this.log("getMobItems", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobItemPaginationOptions(options)

    return context.dataLoaderService.getMobItems({
      ...paginationOptions,
      id,
      itemId,
      mobId,
    })
  }

  async getMobItemById(id: number, context: IHttpRouterContext) {
    this.log("getMobItemById", { id })

    const [mob] = await context.dataLoaderService.getMobItemsById(id)
    if (!mob) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.MOB_ITEM_NOT_FOUND)

    return mob
  }

  async getMobItemByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMobItemByHashId", { hashId })

    const mobService = Container.get(MobServiceToken)
    const [id] = mobService.deobfuscateMobItemId(hashId)

    return this.getMobItemById(id, context)
  }


  async getMobRankItems(options: any, context: IHttpRouterContext) {
    const { id, itemId, mobRankId } = options || {}

    this.log("getMobRankItems", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobRankItemPaginationOptions(options)

    return context.dataLoaderService.getMobRankItems({
      ...paginationOptions,
      id,
      itemId,
      mobRankId
    })
  }

  async getMobRankItemById(id: number, context: IHttpRouterContext) {
    this.log("getMobRankItemById", { id })

    const [item] = await context.dataLoaderService.getMobRankItemsById(id)
    if (!item) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.MOB_GROUP_NOT_FOUND)

    return item
  }

  async getMobRankItemByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMobRankItemByHashId", { hashId })

    const mobService = Container.get(MobServiceToken)
    const [id] = mobService.deobfuscateMobRankItemId(hashId)

    return this.getMobRankItemById(id, context)
  }


  async getMobGroups(options: any, context: IHttpRouterContext) {
    const { id } = options || {}

    this.log("getMobGroups", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobGroupPaginationOptions(options)

    return context.dataLoaderService.getMobGroups({
      ...paginationOptions,
      id,
    })
  }

  async getMobGroupById(id: number, context: IHttpRouterContext) {
    this.log("getMobGroupById", { id })

    const [group] = await context.dataLoaderService.getMobGroupsById(id)
    if (!group) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.MOB_GROUP_NOT_FOUND)

    return group
  }

  async getMobGroupByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMobGroupByHashId", { hashId })

    const mobService = Container.get(MobServiceToken)
    const [id] = mobService.deobfuscateMobGroupId(hashId)

    return this.getMobGroupById(id, context)
  }

  
  async getMobGroupMobs(options: any, context: IHttpRouterContext) {
    const { id, mobGroupId, mobId } = options || {}

    this.log("getMobGroupMobs", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobGroupMobPaginationOptions(options)

    return context.dataLoaderService.getMobGroupMobs({
      ...paginationOptions,
      id,
      mobId,
      mobGroupId
    })
  }

  async getMobGroupMobById(id: number, context: IHttpRouterContext) {
    this.log("getMobGroupMobById", { id })

    const [mob] = await context.dataLoaderService.getMobGroupMobsById(id)
    if (!mob) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.MOB_GROUP_MOB_NOT_FOUND)

    return mob
  }

  async getMobGroupMobByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMobGroupMobByHashId", { hashId })

    const mobService = Container.get(MobServiceToken)
    const [id] = mobService.deobfuscateMobGroupMobId(hashId)

    return this.getMobGroupMobById(id, context)
  }

  
  async getMobGroupGroups(options: any, context: IHttpRouterContext) {
    const { id } = options || {}

    this.log("getMobGroupGroups", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobGroupGroupPaginationOptions(options)

    return context.dataLoaderService.getMobGroupGroups({
      ...paginationOptions,
      id,
    })
  }

  async getMobGroupGroupById(id: number, context: IHttpRouterContext) {
    this.log("getMobGroupGroupById", { id })

    const [group] = await context.dataLoaderService.getMobGroupGroupsById(id)
    if (!group) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.MOB_GROUP_GROUP_NOT_FOUND)

    return group
  }
  
  async getMobGroupGroupByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMobGroupGroupByHashId", { hashId })

    const mobService = Container.get(MobServiceToken)
    const [id] = mobService.deobfuscateMobGroupGroupId(hashId)

    return this.getMobGroupGroupById(id, context)
  }


  async getMobGroupGroupMobGroups(options: any, context: IHttpRouterContext) {
    const { id, mobGroupId, mobGroupGroupId } = options || {}

    this.log("getMobGroupGroupMobGroups", options)

    const mobService = Container.get(MobServiceToken)
    const paginationOptions = mobService.getMobGroupGroupMobGroupPaginationOptions(options)

    return context.dataLoaderService.getMobGroupGroupMobGroups({
      ...paginationOptions,
      id,
      mobGroupId,
      mobGroupGroupId,
    })
  }

  async getMobGroupGroupMobGroupById(id: number, context: IHttpRouterContext) {
    this.log("getMobGroupGroupMobGroupById", { id })

    const [group] = await context.dataLoaderService.getMobGroupGroupMobGroupsById(id)
    if (!group) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.MOB_GROUP_GROUP_MOB_GROUP_NOT_FOUND)

    return group
  }

  async getMobGroupGroupMobGroupByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMobGroupGroupMobGroupByHashId", { hashId })

    const mobService = Container.get(MobServiceToken)
    const [id] = mobService.deobfuscateMobGroupGroupMobGroupId(hashId)

    return this.getMobGroupGroupMobGroupById(id, context)
  }

}