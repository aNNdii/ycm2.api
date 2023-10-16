import JSZip from "jszip"

import { Container, Token } from "../infrastructures/Container";

import { getEnumValues } from "../helpers/Enum";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import { HttpRouterError } from "../entities/HttpRouterError";

import { Authorization } from "../interfaces/Auth";
import { GameItemProtoFormat } from "../interfaces/GameItem";

import { ItemRepositoryToken } from "../repositories/ItemRepository";

import { ItemServiceToken } from "../services/ItemService";
import { GameItemServiceToken } from "../services/GameItemService";

import { IItemSpecialAction } from "../entities/ItemSpecialAction";
import { IItemAttribute } from "../entities/ItemAttribute";
import { IItem } from "../entities/Item";

import { Controller, IController } from "./Controller";

export const ItemControllerToken = new Token<IItemController>("ItemController")

export enum ItemRequestAction {
  IMPORT_ITEM_PROTO,
  IMPORT_ITEM_NAMES,
  IMPORT_ITEM_LIST,
  IMPORT_ITEM_SPECIAL_GROUP,
  IMPORT_ITEM_BLEND,
  IMPORT_ITEM_CUBE
}

export type IItemController = IController & {
  getItems(options: any, context: IHttpRouterContext): Promise<IItem[]>
  getItemById(id: number, context: IHttpRouterContext): Promise<IItem>

  getItemAttributes(options: any, context: IHttpRouterContext): Promise<IItemAttribute[]>
  getItemAttributeById(id: number, context: IHttpRouterContext): Promise<IItemAttribute>

  getItemRareAttributes(options: any, context: IHttpRouterContext): Promise<IItemAttribute[]>
  getItemRareAttributeById(id: number, context: IHttpRouterContext): Promise<IItemAttribute>

  getItemSpecialActions(options: any, context: IHttpRouterContext): Promise<IItemSpecialAction[]>
  getItemSpecialActionById(id: number, context: IHttpRouterContext): Promise<IItemSpecialAction>
}

export class ItemController extends Controller implements IItemController {

  init() {
    this.get('/items', this.handleItemsGetRequest.bind(this))
    this.post('/items', this.handleItemsPostRequest.bind(this))
  }

  async handleItemsGetRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.ITEMS, AuthorizationAction.EXPORT)

    this.log("getItemsRequest", { accountId: auth.accountId })

    const gameItemService = Container.get(GameItemServiceToken)
    const itemRepository = Container.get(ItemRepositoryToken)

    const itemPromise = itemRepository.getItems()
    const itemActionPromise = itemRepository.getItemSpecialActions()
    const itemCraftingItemPromise = itemRepository.getItemCraftingItems()

    const items = await itemPromise
    const itemActions = await itemActionPromise
    const itemCraftingItems = await itemCraftingItemPromise

    const itemListPromise = gameItemService.createItemList(items)
    const itemProtoPromise = gameItemService.createItemProto(items)
    const itemBlendPromise = gameItemService.createItemBlend(items)
    const itemSpecialGroupPromise = gameItemService.createItemSpecialGroup(itemActions)
    const itemCubePromise = gameItemService.createItemCube(itemCraftingItems)
    const itemNamePromise = gameItemService.createItemNames<IItem>(items, {
      transform: (item: IItem) => item.localeName ? [item.id, item.localeName] : undefined 
    })

    const itemList = await itemListPromise
    const itemProto = await itemProtoPromise
    const itemNames = await itemNamePromise
    const itemBlend = await itemBlendPromise
    const itemCube = await itemCubePromise
    const itemSpecialAction = await itemSpecialGroupPromise

    const zip = new JSZip();

    zip.file("item_proto.txt", itemProto)
    zip.file("item_names.txt", itemNames)
    zip.file("item_list.txt", itemList)
    zip.file("blend.txt", itemBlend)
    zip.file("cube.txt", itemCube)
    zip.file("special_item_group.txt", itemSpecialAction)

    const content = zip.generateNodeStream({ streamFiles: true })

    context.setHeader("Content-disposition", "attachment; filename=items.zip")
    context.setHeader("Content-type", "application/zip, application/octet-stream")

    context.setStatus(HttpStatusCode.OK)
    context.setBody(content)
  }

  async handleItemsPostRequest(context: IHttpRouterContext) {
    const auth = context.getAuth()
    // auth.verifyAuthorization(Authorization.ITEMS_IMPORT)

    let { action } = context.body;
    [action] = getEnumValues(ItemRequestAction, action)

    this.log("postItemsRequest", { accountId: auth.accountId, action })

    switch (action) {

      case ItemRequestAction.IMPORT_ITEM_PROTO:
        await this.handleItemProtoImportRequest(context.body)
        break

      case ItemRequestAction.IMPORT_ITEM_NAMES:
        await this.handleItemNamesImportRequest(context.body)
        break

      case ItemRequestAction.IMPORT_ITEM_LIST:
        await this.handleItemListImportRequest(context.body)
        break

      case ItemRequestAction.IMPORT_ITEM_BLEND:
        await this.handleItemBlendImportRequest(context.body)
        break

      case ItemRequestAction.IMPORT_ITEM_SPECIAL_GROUP:
        await this.handleItemSpecialGroupImportRequest(context.body)
        break

      case ItemRequestAction.IMPORT_ITEM_CUBE:
        await this.handleItemCubeImportRequest(context.body)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    }

    context.setResponse({
      status: HttpStatusCode.OK,
      data: {}
    })
  }

  async handleItemProtoImportRequest(options: any) {
    let { format, file, update } = options;

    [file] = file || [];
    [format] = getEnumValues(GameItemProtoFormat, format);
    update = ~~(update)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    this.log("importItemProto", { file: file.path, format, update })

    const itemService = Container.get(ItemServiceToken)
    await itemService.importItemProto(file.path, { format, update })
  }

  async handleItemNamesImportRequest(options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    this.log("importItemNames", { file: file.path, update })

    const itemService = Container.get(ItemServiceToken)
    await itemService.importItemNames(file.path, { update })
  }

  async handleItemListImportRequest(options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    this.log("importItemList", { file: file.path, update })

    const itemService = Container.get(ItemServiceToken)
    await itemService.importItemList(file.path, { update })
  }

  async handleItemBlendImportRequest(options: any) {
    let { file, update } = options;

    [file] = file || [];
    update = ~~(update)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    this.log("importItemBlend", { file: file.path, update })

    const itemService = Container.get(ItemServiceToken)
    await itemService.importItemBlend(file.path, { update })
  }

  async handleItemSpecialGroupImportRequest(options: any) {
    let { file, override } = options;

    [file] = file || [];
    override = ~~(override)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    this.log("importItemSpecialGroup", { file: file.path, override })

    const itemService = Container.get(ItemServiceToken)
    await itemService.importItemSpecialGroup(file.path, { override })
  }

  async handleItemCubeImportRequest(options: any) {
    let { file, override } = options;

    [file] = file || [];
    override = ~~(override)

    if (!file) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    this.log("importItemCube", { file: file.path, override })

    const itemService = Container.get(ItemServiceToken)
    await itemService.importItemCube(file.path, { override })
  }


  getItems(options: any, context: IHttpRouterContext) {
    this.log("getItems", options)

    const itemService = Container.get(ItemServiceToken)
    const paginationOptions = itemService.getItemPaginationOptions(options)

    return context.dataLoaderService.getItems({
      ...paginationOptions,
    })
  }

  async getItemById(id: number, context: IHttpRouterContext) {
    this.log("getItemById", { id })

    const [item] = await context.dataLoaderService.getItemsById(id)
    if (!item) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ITEM_NOT_FOUND)

    return item
  }


   getItemAttributes(options: any, context: IHttpRouterContext) {
    this.log("getItemAttributes", options)

    const itemService = Container.get(ItemServiceToken)
    const paginationOptions = itemService.getItemPaginationOptions(options)

    return context.dataLoaderService.getItemAttributes({
      ...paginationOptions,
    })
  }

  async getItemAttributeById(id: number, context: IHttpRouterContext) {
    this.log("getItemAttributeById", { id })

    const [attribute] = await context.dataLoaderService.getItemAttributesById(id)
    if (!attribute) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ITEM_ATTRIBUTE_NOT_FOUND)

    return attribute
  }

  
  getItemRareAttributes(options: any, context: IHttpRouterContext) {
    this.log("getItemRareAttributes", options)

    return this.getItemAttributes({
      ...options,
      rare: true
    }, context)
  }

  async getItemRareAttributeById(id: number, context: IHttpRouterContext) {
    this.log("getItemRareAttributeById", { id })

    const [attribute] = await context.dataLoaderService.getItemRareAttributesById(id)
    if (!attribute) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ITEM_ATTRIBUTE_NOT_FOUND)

    return attribute
  }

  
  getItemSpecialActions(options: any, context: IHttpRouterContext) {
    this.log("getItemSpecialActions", options)

    const itemService = Container.get(ItemServiceToken)
    const paginationOptions = itemService.getItemSpecialActionPaginationOptions(options)

    return context.dataLoaderService.getItemSpecialActions({
      ...paginationOptions,
    })
  }

  async getItemSpecialActionById(id: number, context: IHttpRouterContext) {
    this.log("getItemSpecialActionById", { id })

    const [action] = await context.dataLoaderService.getItemSpecialActionsById(id)
    if (!action) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ITEM_SPECIAL_ACTION_NOT_FOUND)

    return action
  }



}