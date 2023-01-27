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

export const MapControllerToken = new Token<IMapController>("MapController")

export type MapOptions = {
  id: number[]
}

export enum MapCreateAction { 
  IMPORT_MAP_INDEX,
  IMPORT_MAP_SETTINGS,
}

export type IMapController = IController & {
  getMaps(options: MapOptions, context: IHttpRouterContext): Promise<IMap[]>
  getMapById(id: number, context: IHttpRouterContext): Promise<IMap>
  getMapByHashId(hashId: string, context: IHttpRouterContext): Promise<IMap>
}

export default class MapController extends Controller implements IMapController {

  init() {
    this.post('/maps', this.handleMapsPostRequest.bind(this))
    this.post('/maps/:mapHashId', this.handleMapPostRequest.bind(this))
  }

  async handleMapsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    auth.verifyAuthorization(Authorization.MAPS, AuthorizationAction.WRITE)

    let { action } = context.body;

    [action] = getEnumValues(MapCreateAction, action)

    this.log("postMaps", { accountId: auth.accountId, action })

    switch (action) {

      case MapCreateAction.IMPORT_MAP_INDEX:
        await this.handleMapIndexImportRequest(context.body)
        break

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

    [action] = getEnumValues(MapCreateAction, action)

    this.log("postMap", { accountId: auth.accountId, mapHashId, action })

    const map = await this.getMapByHashId(mapHashId, context)

    switch (action) {
      case MapCreateAction.IMPORT_MAP_SETTINGS:
        await this.handleMapSettingsImportRequest(map, context.body)
        break;
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

}