import Container, { Token } from "../infrastructures/Container";

import { getEnumValues } from "../helpers/Enum";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { Authorization, AuthorizationAction } from "../interfaces/Auth";

import { MapServiceToken } from "../services/MapService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import HttpRouterError from "../entities/HttpRouterError";
import { IMap } from "../entities/Map";

import Controller, { IController } from "./Controller";
import { PaginationOptions } from "../services/PaginationService";
import { EntityFilterMethod } from "../interfaces/Entity";
import { IMapEntity } from "../entities/MapEntity";

export const MapControllerToken = new Token<IMapController>("MapController")

export type MapOptions = PaginationOptions & {
  id: number[]
}

export type MapEntityOptions = PaginationOptions & {
  id: number[]
  mapId: number[]
  mobId: number[]
  mobGroupId: number[]
  mobGroupGroupId: number[]
}

export enum MapRequestAction { 
  IMPORT_MAP_INDEX,
  IMPORT_MAP_SETTINGS,
  IMPORT_MAP_REGEN
}

export type IMapController = IController & {
  getMaps(options: MapOptions, context: IHttpRouterContext): Promise<IMap[]>
  getMapById(id: number, context: IHttpRouterContext): Promise<IMap>
  getMapByHashId(hashId: string, context: IHttpRouterContext): Promise<IMap>

  getMapEntities(options: MapEntityOptions, context: IHttpRouterContext): Promise<IMapEntity[]>
  getMapEntityById(id: number, context: IHttpRouterContext): Promise<IMapEntity>
  getMapEntityByHashId(hashId: string, context: IHttpRouterContext): Promise<IMapEntity>
}

export default class MapController extends Controller implements IMapController {

  init() {
    this.post('/maps', this.handleMapsPostRequest.bind(this))
    this.post('/maps/:mapHashId', this.handleMapPostRequest.bind(this))
    this.post('/maps/:mapHashId/entities', this.handleMapEntitiesPostRequest.bind(this))
  }

  async handleMapsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.WRITE)

    let { action } = context.body;

    [action] = getEnumValues(MapRequestAction, action)

    this.log("postMaps", { accountId: auth.accountId, action })

    switch (action) {

      case MapRequestAction.IMPORT_MAP_INDEX:
        await this.handleMapIndexImportRequest(context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })
  }

  async handleMapPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.WRITE)

    let { mapHashId } = context.parameters;
    let { action } = context.body;

    [action] = getEnumValues(MapRequestAction, action)

    this.log("postMap", { accountId: auth.accountId, mapHashId, action })

    const map = await this.getMapByHashId(mapHashId, context)

    switch (action) {

      case MapRequestAction.IMPORT_MAP_SETTINGS:
        await this.handleMapSettingsImportRequest(map, context.body)
        break
    
      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)
    
    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })
  }

  async handleMapEntitiesPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.WRITE)

    let { mapHashId } = context.parameters;
    let { action } = context.body;

    [action] = getEnumValues(MapRequestAction, action)

    this.log("postMapRegen", { accountId: auth.accountId, mapHashId, action })

    const map = await this.getMapByHashId(mapHashId, context)

    switch (action) {

      case MapRequestAction.IMPORT_MAP_REGEN:
        await this.handleMapRegenImportRequest(map, context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)
    
    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })

  }

  async handleMapIndexImportRequest(options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    this.log("importMapIndex", { path: file.path, update })

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    const mapService = Container.get(MapServiceToken)
    await mapService.importMapIndex(file.path, { update })
  }

  async handleMapSettingsImportRequest(map: IMap, options: any) {
    let { file } = options;

    [file] = file || [];

    this.log("importMapSettings", { mapId: map.id, path: file.path })

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    const mapService = Container.get(MapServiceToken)
    await mapService.importMapSettings(map.id, file.path)
  }

  async handleMapRegenImportRequest(map: IMap, options: any) {
    let { file } = options;

    [file] = file || [];

    this.log("importMapRegen", { mapId: map.id, path: file.path })

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    const mapService = Container.get(MapServiceToken)
    await mapService.importMapRegen(map.id, file.path)
  }

  getMaps(options: MapOptions, context: IHttpRouterContext) {
    this.log("getMaps", options)

    const mapService = Container.get(MapServiceToken)
    const paginationOptions = mapService.getMapPaginationOptions(options)

    return context.dataLoaderService.getMaps({
      ...paginationOptions
    })
  }

  async getMapById(id: number, context: IHttpRouterContext) {
    this.log("getMapById", { id })

    const [map] = await context.dataLoaderService.getMapsById(id)
    if (!map) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.MAP_NOT_FOUND)

    return map
  }

  async getMapByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMapByHashId", { hashId })

    const mapService = Container.get(MapServiceToken)
    const [id] = mapService.deobfuscateMapId(hashId)

    return this.getMapById(id, context)
  }

  async getMapEntities(options: MapEntityOptions, context: IHttpRouterContext) {
    this.log("getMapEntities", options)

    const { id, mapId, mobId, mobGroupId, mobGroupGroupId } = options 

    const mapService = Container.get(MapServiceToken)
    const paginationOptions = mapService.getMapEntityPaginationOptions(options)

    return context.dataLoaderService.getMapEntities({
      ...paginationOptions,
      id: id ? [EntityFilterMethod.IN, id] : undefined,
      mapId: id ? [EntityFilterMethod.IN, mapId] : undefined,
      mobId: id ? [EntityFilterMethod.IN, mobId] : undefined,
      mobGroupId: id ? [EntityFilterMethod.IN, mobGroupId] : undefined,
      mobGroupGroupId: id ? [EntityFilterMethod.IN, mobGroupGroupId] : undefined,
    })
  }

  async getMapEntityById(id: number, context: IHttpRouterContext) {
    this.log("getMapEntityById", { id })

    const [entity] = await context.dataLoaderService.getMapEntitiesById(id)
    if (!entity) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.MAP_ENTITY_NOT_FOUND)

    return entity
  }

  async getMapEntityByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getMapEntityByHashId", { hashId })

    const mapService = Container.get(MapServiceToken)
    const [id] = mapService.deobfuscateMapEntityId(hashId)

    return this.getMapEntityById(id, context)
  }

}