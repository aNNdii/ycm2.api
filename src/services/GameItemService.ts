import { writeToString } from "fast-csv";
import { createReadStream } from "fs";
import iconv from "iconv-lite";

import { Token } from "../infrastructures/Container";

import { DefaultEncoding, getFlagIdByFlags, getFlagsByFlagId, KoreanEncoding, parseProtoStream } from "../helpers/Game";
import { readStreamToBuffer } from "../helpers/Stream";

import { isNumber } from "../helpers/Number";
import { getEnumValues } from "../helpers/Enum";

import { GameItemProtoAntiFlag, GameItemProtoApplyType, GameItemProtoFlag, GameItemProtoFormat, GameItemProtoImmuneFlag, GameItemProtoLimitType, GameItemProtoMaskType, GameItemProtoMaskTypeCostume, GameItemProtoMaskTypeDragonStone, GameItemProtoMaskTypeEquipmentArmor, GameItemProtoMaskTypeEquipmentJewelry, GameItemProtoMaskTypeEquipmentWeapon, GameItemProtoMaskTypeEtc, GameItemProtoMaskTypeFishingPick, GameItemProtoMaskTypeMountPet, GameItemProtoMaskTypePotion, GameItemProtoMaskTypeSkill, GameItemProtoMaskTypeSubTypes, GameItemProtoMaskTypeTuning, GameItemProtoMaskTypeUnique, GameItemProtoType, GameItemProtoTypeArmor, GameItemProtoTypeCostume, GameItemProtoTypeDragonSoul, GameItemProtoTypeExtract, GameItemProtoTypeFish, GameItemProtoTypeGacha, GameItemProtoTypeGiftbox, GameItemProtoTypeLottery, GameItemProtoTypeMaterial, GameItemProtoTypeMedium, GameItemProtoTypeMercenary, GameItemProtoTypeMetin, GameItemProtoTypePassive, GameItemProtoTypePet, GameItemProtoTypeQuest, GameItemProtoTypeResource, GameItemProtoTypeSoul, GameItemProtoTypeSpecial, GameItemProtoTypeSubTypes, GameItemProtoTypeUnique, GameItemProtoTypeUse, GameItemProtoTypeWeapon, GameItemProtoWearFlag, GameItemSpecialActionType, GameItemSpecialType } from "../interfaces/GameItem";
import { ItemAttribute, ItemLimitType, ItemMaskType, ItemSpecialActionType, ItemSpecialType, ItemTable, ItemType } from "../interfaces/Item";

import { ILocaleItem } from "../entities/LocaleItem";
import { IItem } from "../entities/Item";

import Service, { IService } from "./Service";
import { IItemSpecialAction } from "../entities/ItemSpecialAction";
import { IItemCraftingItem } from "../entities/ItemCraftingItem";

export const GameItemServiceToken = new Token<IGameItemService>("GameItemService")

export type ItemProtoParseOptions = {
  format?: GameItemProtoFormat
}

export type ItemParseOptions<T> = {
  transform?: (row: any) => T | undefined
}

export type CSVWriteOptions = {
  transform: (row: any) => any
}

export type ItemDescriptionParseOptions<T> = ItemParseOptions<T>

export type IGameItemService = IService & {
  readItemNames<T = any>(path: string, options?: ItemParseOptions<T>): Promise<T[]>
  readItemDescriptions<T = any>(path: string, options?: ItemDescriptionParseOptions<T>): Promise<T[]>
  readItemList<T = any>(path: string, options?: ItemParseOptions<T>): Promise<T[]>
  readItemProto(path: string, options?: ItemProtoParseOptions): Promise<Partial<ItemTable>[]>
  readItemBlend(path: string): Promise<Partial<ItemTable>[]>
  readItemSpecialGroup(path: string): Promise<any>
  readItemCube(path: string): Promise<any>

  parseItemNames<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>): Promise<T[]>
  parseItemDescriptions<T = any>(stream: NodeJS.ReadableStream, options?: ItemDescriptionParseOptions<T>): Promise<T[]>
  parseItemList<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>): Promise<T[]>
  parseItemProto(stream: NodeJS.ReadableStream, options?: ItemProtoParseOptions): Promise<Partial<ItemTable>[]>
  parseItemBlend(stream: NodeJS.ReadableStream): Promise<Partial<ItemTable>[]>
  parseItemSpecialGroup(stream: NodeJS.ReadableStream): Promise<any>
  parseItemCube(stream: NodeJS.ReadableStream): Promise<any>

  createItemNames<T = any>(items: T[], options?: CSVWriteOptions): Promise<Buffer>
  createItemDescriptions(items: ILocaleItem[]): Promise<Buffer>
  createItemList(items: IItem[]): Promise<Buffer>
  createItemProto(items: IItem[]): Promise<Buffer>
  createItemBlend(items: IItem[]): Promise<Buffer>
  createItemCube(itemCraftingItems: IItemCraftingItem[]): Promise<Buffer>
  createItemSpecialGroup(actions: IItemSpecialAction[]): Promise<Buffer>
}

export default class GameItemService extends Service<any> implements IGameItemService {

  async createItemNames<T = any>(items: T[], options?: CSVWriteOptions) {
    const { transform } = options || {}

    const content = await writeToString(items as any, {
      delimiter: '\t',
      headers: ['VNUM', 'LOCALE_NAME'],
      transform
      // transform: (item: ILocaleItem) => item.name ? [item.itemId, item.name] : undefined
    })

    return iconv.encode(content, DefaultEncoding)
  }

  async createItemDescriptions(items: ILocaleItem[]) {
    const content = await writeToString(items, {
      delimiter: '\t',
      transform: (item: ILocaleItem) => [item.itemId, item.name, item.description, item.category]
    })

    return iconv.encode(content, DefaultEncoding)
  }

  async createItemProto(items: IItem[]) {
    const content = await writeToString(items, {
      delimiter: '\t',
      escape: "",
      quote: "",
      headers: [
        'Vnum',
        'Name',
        'Type',
        'SubType',
        'Size',
        'AntiFlags',
        'Flags',
        'WearFlags',
        'ImmuneFlags',
        'ShopBuyPrice',
        'ShopSellPrice',
        // 'RefineElementApplyType',
        // 'RefineElementGrade',
        // 'RefineElementValue',
        // 'RefineElementBonus',
        'RefinedVnum',
        'RefineSet',
        // '67AttrMaterial',
        'AlterToMagicItemPercent',
        'LimitType0',
        'LimitValue0',
        'LimitType1',
        'LimitValue1',
        'ApplyType0',
        'ApplyValue0',
        'ApplyType1',
        'ApplyValue1',
        'ApplyType2',
        'ApplyValue2',
        // 'ApplyType3',
        // 'ApplyValue3',
        'Value0',
        'Value1',
        'Value2',
        'Value3',
        'Value4',
        'Value5',
        // 'Socket0',
        // 'Socket1',
        // 'Socket2',
        // 'Socket3',
        // 'Socket4',
        // 'Socket5',
        'Specular',
        'GainSocketPercent',
        // 'MaskedType',
        // 'MaskedSubType',
        'AddonType'
      ],
      transform: (row: any) => this.transformItemToItemProtoRow(row)
    })

    return iconv.encode(content, KoreanEncoding)
  }

  async createItemList(items: IItem[]) {
    const content = await writeToString(items, {
      delimiter: '\t',
      transform: (item: IItem) => item.icon ? [
        item.id,
        item.typeId === ItemType.WEAPON ? 'WEAPON' : item.typeId === ItemType.ARMOR || item.typeId === ItemType.COSTUME ? 'ARMOR' : 'ETC',
        item.icon,
        item.model,
        ''
      ] : undefined
    })

    return iconv.encode(content, DefaultEncoding)
  }

  async createItemBlend(items: IItem[]) {
    let content = ""

    items.map(item => {
      if (item.typeId !== ItemType.BLEND || !item.blendAttributeId) return

      content += `section\n`
      content += `\titem_vnum\t${item.id}\n`
      content += `\tapply_type\t${ItemAttribute[item.blendAttributeId]}\n`
      content += `\tapply_value\t${item.blendAttributeValue0}\t${item.blendAttributeValue1}\t${item.blendAttributeValue2}\t${item.blendAttributeValue3}\t${item.blendAttributeValue4}\n`
      content += `\tapply_duration\t${item.blendAttributeDuration0}\t${item.blendAttributeDuration1}\t${item.blendAttributeDuration2}\t${item.blendAttributeDuration3}\t${item.blendAttributeDuration4}\n`
      content += `end\n`

    })

    return iconv.encode(content, KoreanEncoding)
  }

  async createItemSpecialGroup(actions: IItemSpecialAction[]) {
    let content = ""

    const itemSpecials: any[] = []

    actions.map(action => {
      itemSpecials[action.parentItemId] = itemSpecials[action.parentItemId] || { itemId: action.parentItemId, typeId: action.parentItemSpecialTypeId, effect: action.parentItemSpecialEffect, actions: [] }
      itemSpecials[action.parentItemId]['actions'].push(action)
    })

    itemSpecials?.map(itemSpecial => {
      const { itemId, typeId, effect, actions } = itemSpecial

      content += `Group\t${itemId}\n`
      content += `{\n`

      content += `\tVnum\t${itemId}\n`
      if (typeId) content += `\tType\t${GameItemSpecialType[typeId]?.toLowerCase()}\n`

      actions?.map((action: any, index: number) => {
        let entities: any[] = []

        switch (action.typeId) {

          case ItemSpecialActionType.ITEM:
            entities = [action.itemId, action.quantity, action.probability, action.rareProbability]
            break 

          case ItemSpecialActionType.EXP:
            entities = ["exp", action.quantity, action.probability]
            break

          case ItemSpecialActionType.MOB:
            entities = ["mob", action.mobId, action.probability]
            break

          case ItemSpecialActionType.MOB_GROUP:
            entities = ["group", action.mobGroupId, action.probability]
            break

          case ItemSpecialActionType.DRAIN_HP:
            entities = ["drain_hp", action.quantity, action.probability]
            break

          case ItemSpecialActionType.POISON:
            entities = ["poison", action.quantity, action.probability]
            break

          case ItemSpecialActionType.SLOW:
            entities = ["slow", action.quantity, action.probability]
            break

          case ItemSpecialActionType.ATTRIBUTE:
            entities = [action.attributeId, action.quantity]
            break

        }

        content += `\t${index+1}\t${entities.join(`\t`)}\n`
      })

      if (typeId === ItemSpecialType.ATTRIBUTE && effect) content += `\teffect\t${effect}\n`
      content += `}\n`
    })

    return iconv.encode(content, KoreanEncoding)
  }

  async createItemCube(itemCraftingItems: IItemCraftingItem[]) {
    let content = ""

    const itemCubes: any = {}

    itemCraftingItems.map(itemCraftingItem => {
      itemCubes[itemCraftingItem.itemCraftingId] = itemCubes[itemCraftingItem.itemCraftingId] || { itemId: itemCraftingItem.itemCraftingItemId, itemQuantity: itemCraftingItem.itemCraftingItemQuantity, mobId: itemCraftingItem.itemCraftingMobId, price: itemCraftingItem.itemCraftingPrice, probability: itemCraftingItem.itemCraftingProbability, items: [] }
      itemCubes[itemCraftingItem.itemCraftingId]['items'].push(itemCraftingItem)
    })

    Object.values(itemCubes).map((itemCube: any) => {
      const { itemId, itemQuantity, mobId, price, probability, items } = itemCube 
      
      content += `section\n`
      content += `npc\t${mobId}\n`

      items?.map((itemCraftingItem: IItemCraftingItem) => {
        content += `item\t${itemCraftingItem.itemId}\t${itemCraftingItem.itemQuantity}\n`
      })

      content += `reward\t${itemId}\t${itemQuantity}\n`

      if (price) content += `gold\t${price}\n`
      
      content += `percent\t${probability}\n`
      content += `end\n\n`
    })

    return iconv.encode(content, KoreanEncoding)
  }

  async readItemNames<T = any>(path: string, options?: ItemParseOptions<T>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseItemNames(stream, options)
  }

  async readItemDescriptions(path: string, options?: ItemDescriptionParseOptions<any>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseItemDescriptions(stream, options)
  }

  async readItemProto(path: string, options?: ItemProtoParseOptions) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseItemProto(stream, options)
  }

  async readItemList<T = any>(path: string, options?: ItemParseOptions<T>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseItemList(stream, options)
  }

  async readItemBlend(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseItemBlend(stream)
  }

  async readItemSpecialGroup(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseItemSpecialGroup(stream)
  }

  async readItemCube(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseItemCube(stream)
  }

  async parseItemNames<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>) {
    return parseProtoStream<T>(stream, {
      headers: ['id', 'name'],
      skipRows: 1,
      ...options,
    })
  }

  async parseItemDescriptions<T = any>(stream: NodeJS.ReadableStream, options?: ItemDescriptionParseOptions<T>) {
    return parseProtoStream<T>(stream, {
      headers: ['id', 'name', 'description', 'category'],
      ...options
    })
  }

  async parseItemProto(stream: NodeJS.ReadableStream, options?: ItemProtoParseOptions) {
    const {
      format = GameItemProtoFormat.DEFAULT
    } = options || {}

    return parseProtoStream<Partial<ItemTable>>(stream, {
      headers: this.getItemProtoHeadersByFormat(format),
      skipRows: 1,
      transform: (row: any) => this.transformItemProtoRowToItem(format, row),
    })
  }

  async parseItemList<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>) {
    return parseProtoStream(stream, {
      headers: ['id', 'type', 'icon', 'model', '_'],
      ...options
    })
  }

  async parseItemBlend(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const items: Partial<ItemTable>[] = []

    const matches = content.match(/section(.*?)end/gis)
    matches?.map(match => {

      const [itemMatch] = [...match.matchAll(/\item_vnum\s+(\d+)/gmi)]
      const [typeMatch] = [...match.matchAll(/\apply_type\s+(\w+)/gmi)]
      const [valueMatches] = [...match.matchAll(/\apply_value\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/gmi)]
      const [durationMatches] = [...match.matchAll(/\apply_duration\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/gmi)]

      let [_1, itemId] = itemMatch || []
      let [_2, type] = typeMatch || []
      let [_3, value0, value1, value2, value3, value4] = valueMatches || []
      let [_4, duration0, duration1, duration2, duration3, duration4] = durationMatches || []

      const [typeId] = getEnumValues(ItemAttribute, type)
      if (!itemId || !typeId) return

      items.push({
        item_id: ~~(itemId),
        item_blend_attribute: typeId,
        item_blend_attribute_value0: ~~(value0),
        item_blend_attribute_value1: ~~(value1),
        item_blend_attribute_value2: ~~(value2),
        item_blend_attribute_value3: ~~(value3),
        item_blend_attribute_value4: ~~(value4),
        item_blend_attribute_duration0: ~~(duration0),
        item_blend_attribute_duration1: ~~(duration1),
        item_blend_attribute_duration2: ~~(duration2),
        item_blend_attribute_duration3: ~~(duration3),
        item_blend_attribute_duration4: ~~(duration4),
      })
    })

    return items
  }

  async parseItemSpecialGroup(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const items: any[] = []
    const actionsById: any[] = []
    const actionsByItemName: any[] = []

    const matches = content.match(/Group.*?{(.*?)}/gis)
    matches?.map(match => {

      const [itemMatch] = [...match.matchAll(/Vnum\s+(\d+)/gmi)]
      const [typeMatch] = [...match.matchAll(/Type\s+(pct|quest|special|attr)/gmi)]
      const [effectMatch] = [...match.matchAll(/effect\s+"(.*?)"/gmi)]

      let [_1, itemId] = itemMatch || []
      let [_2, type] = typeMatch || [null, GameItemSpecialType[GameItemSpecialType.NORMAL]]
      let [_3, effect] = effectMatch || []

      itemId = ~~(itemId) as any
      const [specialTypeId] = getEnumValues(GameItemSpecialType, type)

      if (!itemId || specialTypeId === undefined) return

      items.push({ itemId, specialTypeId, effect })

      const actions = [...match.matchAll(/^\s+\d+\s+(.+?)\s+(\d+)\s+((\d+)(\s+(\d+))?)?$$/gmi)]
      actions?.map(action => {
        const [_1, itemIdOrNameOrType, quantityOrEntityId, _2, probability, _3, rareProbability] = action

        let actionTypeId = undefined
        let actionAttributeId = undefined
        let actionItemId = undefined
        let actionItemName = undefined
        let actionMobId = undefined
        let actionMobGroupId = undefined
        let actionQuantity = undefined

        let actions = actionsById

        if (isNumber(itemIdOrNameOrType)) {
          actionTypeId = specialTypeId === GameItemSpecialType.ATTR ? ItemSpecialActionType.ATTRIBUTE : ItemSpecialActionType.ITEM
          actionItemId = specialTypeId === GameItemSpecialType.ATTR ? undefined : itemIdOrNameOrType
          actionAttributeId = specialTypeId === GameItemSpecialType.ATTR ? itemIdOrNameOrType : undefined
          actionQuantity = quantityOrEntityId

        } else {

          const [actionType] = getEnumValues(GameItemSpecialActionType, itemIdOrNameOrType) as any
          switch (actionType) {

            case ItemSpecialActionType.MOB:
              actionTypeId = ItemSpecialActionType.MOB
              actionMobId = quantityOrEntityId
              break

            case ItemSpecialActionType.MOB_GROUP:
              actionTypeId = ItemSpecialActionType.MOB_GROUP
              actionMobGroupId = quantityOrEntityId
              break

            case ItemSpecialActionType.EXP:
            case ItemSpecialActionType.SLOW:
            case ItemSpecialActionType.POISON:
            case ItemSpecialActionType.DRAIN_HP:
              actionTypeId = actionType
              actionQuantity = quantityOrEntityId
              break

            default:
              actions = actionsByItemName
              actionTypeId = ItemSpecialActionType.ITEM
              actionItemName = itemIdOrNameOrType
              actionQuantity = quantityOrEntityId

          }
        }

        actions.push({
          parentItemId: itemId,
          typeId: actionTypeId,
          itemId: actionItemId ? ~~(actionItemId) : undefined,
          itemName: actionItemName,
          mobId: actionMobId ? ~~(actionMobId) : undefined,
          mobGroupId: actionMobGroupId ? ~~(actionMobGroupId) : undefined,
          attributeId: actionAttributeId ? ~~(actionAttributeId) : undefined,
          quantity: actionQuantity ? ~~(actionQuantity) : undefined,
          probability: probability ? ~~(probability) : undefined,
          rareProbability: rareProbability ? ~~(rareProbability) : 0
        })
      })
    })

    return [items, actionsById, actionsByItemName]
  }

  async parseItemCube(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const cubes: any[] = []
    const cubeItems: any[] = []

    const matches = content.match(/section(.*?)end/gis)
    matches?.map(match => {

      const [mobMatch] = [...match.matchAll(/npc\s+(\d+)/gmi)]
      const [resultItemMatch] = [...match.matchAll(/reward\s+(\d+)\s+(\d+)/gmi)]
      const [priceMatch] = [...match.matchAll(/gold\s+(\d+)/gmi)]
      const [probabilityMatch] = [...match.matchAll(/percent\s+(\d+)/gmi)]

      const [_1, mobId] = mobMatch || []
      const [_2, resultItemId, resultItemQuantity] = resultItemMatch || []
      const [_3, price] = priceMatch || []
      const [_4, probability] = probabilityMatch || []

      const key = `${mobId}:${resultItemId}`

      cubes.push({
        mobId,
        itemId: resultItemId,
        itemQuantity: resultItemQuantity,
        price,
        probability
      })

      const items = [...match.matchAll(/item\s+(\d+)\s+(\d+)/gmi)]
      items?.map(item => {
        const [_5, itemId, itemQuantity] = item

        cubeItems.push({
          key,
          itemId,
          itemQuantity
        })
      })


    })

    return [cubes, cubeItems] as any
  }

  private getItemProtoHeadersByFormat(format: GameItemProtoFormat) {
    switch (format) {

      case GameItemProtoFormat.VERSION_2022:
        return [
          'id', 'name', 'type', 'subType', 'size', 'antiFlags', 'flags', 'wearFlags', 'immuneFlags',
          'shopBuyPrice', 'shopSellPrice', 'refineElementApplyType', 'refineElementGrade', 'refineElementValue', 'refineElementBonus',
          'refineItemId', 'refineId', '67AttributeMaterial', 'magicChancePercent',
          'limitType0', 'limitValue0', 'limitType1', 'limitValue1',
          'applyType0', 'applyValue0', 'applyType1', 'applyValue1', 'applyType2', 'applyValue2', 'applyType3', 'applyValue3',
          'value0', 'value1', 'value2', 'value3', 'value4', 'value5',
          'socket0', 'socket1', 'socket2', 'socket3', 'socket4', 'socket5',
          'specularPercent', 'socketCount', 'maskType', 'maskSubType', 'addonType'
        ]

      case GameItemProtoFormat.VERSION_2017:
        return [
          'id', 'name', 'type', 'subType', 'size', 'antiFlags', 'flags', 'wearFlags', 'immuneFlags',
          'shopBuyPrice', 'shopSellPrice', 'refineItemId', 'refineId', 'magicChancePercent',
          'limitType0', 'limitValue0', 'limitType1', 'limitValue1',
          'applyType0', 'applyValue0', 'applyType1', 'applyValue1', 'applyType2', 'applyValue2',
          'value0', 'value1', 'value2', 'value3', 'value4', 'value5',
          'specularPercent', 'socketCount', 'addonType', 'maskType', 'maskSubType',
        ]


      default:
        return [
          'id', 'name', 'type', 'subType', 'size', 'antiFlags', 'flags', 'wearFlags', 'immuneFlags',
          'shopBuyPrice', 'shopSellPrice', 'refineItemId', 'refineId', 'magicChancePercent',
          'limitType0', 'limitValue0', 'limitType1', 'limitValue1',
          'applyType0', 'applyValue0', 'applyType1', 'applyValue1', 'applyType2', 'applyValue2',
          'value0', 'value1', 'value2', 'value3', 'value4', 'value5',
          'specularPercent', 'socketCount', 'addonType'
        ]

    }
  }

  private transformItemProtoRowToItem(format: GameItemProtoFormat, row: any): Partial<ItemTable> {
    const [id, range] = row.id.split('~')

    const [type] = getEnumValues(GameItemProtoType, row.type)

    // @ts-ignore
    const [subType] = getEnumValues(GameItemProtoTypeSubTypes[type] || {}, row.subType)

    const flagId = getFlagIdByFlags(GameItemProtoFlag, row.flags)
    const antiFlagId = getFlagIdByFlags(GameItemProtoAntiFlag, row.antiFlags)
    const wearFlagId = getFlagIdByFlags(GameItemProtoWearFlag, row.wearFlags)
    const immuneFlagId = getFlagIdByFlags(GameItemProtoImmuneFlag, row.immuneFlags)

    const [limitType0] = getEnumValues(GameItemProtoLimitType, row.limitType0)
    const [limitType1] = getEnumValues(GameItemProtoLimitType, row.limitType1)

    const [applyType0] = getEnumValues(GameItemProtoApplyType, row.applyType0)
    const [applyType1] = getEnumValues(GameItemProtoApplyType, row.applyType1)
    const [applyType2] = getEnumValues(GameItemProtoApplyType, row.applyType2)
    const [applyType3] = getEnumValues(GameItemProtoApplyType, row.applyType3)

    const [maskType] = getEnumValues(GameItemProtoMaskType, row.maskType)

    // @ts-ignore
    const [maskSubType] = getEnumValues(GameItemProtoMaskTypeSubTypes[maskType], row.maskSubType)

    const item: Partial<ItemTable> = {
      item_id: ~~(id),
      item_end_id: range ? ~~(range) : 0,
      item_name: row.name,
      item_type: type || ItemType.NONE as any,
      item_subtype: subType || 0,
      item_size: ~~(row.size),
      item_flag_id: flagId,
      item_anti_flag_id: antiFlagId,
      item_wear_flag_id: wearFlagId,
      item_immune_flag_id: immuneFlagId,
      item_shop_buy_price: ~~(row.shopBuyPrice),
      item_shop_sell_price: ~~(row.shopSellPrice),
      item_refine_item_id: ~~(row.refineItemId),
      item_refine_id: ~~(row.refineId),
      item_attribute_probability: ~~(row.magicChancePercent),
      item_limit_type0: limitType0 || ItemLimitType.NONE as any,
      item_limit_value0: ~~(row.limitValue0),
      item_limit_type1: limitType1 || ItemLimitType.NONE as any,
      item_limit_value1: ~~(row.limitValue1),
      item_attribute0: applyType0 || ItemAttribute.NONE as any,
      item_attribute_value0: ~~(row.applyValue0),
      item_attribute1: applyType1 || ItemAttribute.NONE as any,
      item_attribute_value1: ~~(row.applyValue1),
      item_attribute2: applyType2 || ItemAttribute.NONE as any,
      item_attribute_value2: ~~(row.applyValue2),
      item_value0: ~~(row.value0),
      item_value1: ~~(row.value1),
      item_value2: ~~(row.value2),
      item_value3: ~~(row.value3),
      item_value4: ~~(row.value4),
      item_value5: ~~(row.value5),
      item_specular_percent: ~~(row.specularPercent),
      item_socket_count: ~~(row.socketCount),
      item_attribute_type: ~~(row.addonType)
    }

    if (format === GameItemProtoFormat.VERSION_2022) {
      item.item_attribute3 = applyType3 || ItemAttribute.NONE as any
      item.item_attribute_value3 = ~~(row.applyValue3)

      item.item_socket0 = ~~(row.socket0)
      item.item_socket1 = ~~(row.socket1)
      item.item_socket2 = ~~(row.socket2)
      item.item_socket3 = ~~(row.socket3)
      item.item_socket4 = ~~(row.socket4)
      item.item_socket5 = ~~(row.socket5)

      item.item_refine_element_apply_type = ~~(row.refineElementApplyType)
      item.item_refine_element_grade = ~~(row.refineElementGrade)
      item.item_refine_element_value = ~~(row.refineElementValue)
      item.item_refine_element_bonus = ~~(row.refineElementBonus)

      item.item_rare_attribute_item_id = ~~(row["67AttributeMaterial"])
    }

    if (format === GameItemProtoFormat.VERSION_2017 || format === GameItemProtoFormat.VERSION_2022) {
      item.item_mask_type = maskType
      item.item_mask_subtype = maskSubType
    }

    return item
  }

  private transformItemToItemProtoRow(item: IItem): any[] | undefined {
    if (!item.name) return undefined

    const itemId = item.id
    const itemEndId = item.endId

    const typeId = GameItemProtoType[item.typeId]

    // @ts-ignore
    const subTypes = GameItemProtoTypeSubTypes[item.typeId] || {} as any
    const subTypeId = subTypes[item.subTypeId]

    // const typeId = subTypeId ? GameItemProtoType[item.typeId] : undefined

    const maskSubTypes = GameItemProtoMaskTypeSubTypes[item.maskTypeId] || {} as any

    const flags = getFlagsByFlagId(GameItemProtoFlag, item.flagId)
    const antiFlags = getFlagsByFlagId(GameItemProtoAntiFlag, item.antiFlagId)
    const wearFlags = getFlagsByFlagId(GameItemProtoWearFlag, item.wearFlagId)
    const immuneFlags = getFlagsByFlagId(GameItemProtoImmuneFlag, item.immuneFlagId)

    return [
      `${itemId}${itemEndId ? '~' + itemEndId : ''}`,
      item.name,
      typeId || "ITEM_NONE",
      subTypeId || 0,
      item.size,
      antiFlags.length ? antiFlags.join('|') : "NONE",
      flags.length ? flags.join('|') : "NONE",
      wearFlags.length ? wearFlags.join('|') : "NONE",
      immuneFlags.length ? immuneFlags.join('|') : "NONE",
      item.buyPrice,
      item.sellPrice,
      // item.refineElementApplyType,
      // item.refineElementGrade,
      // item.refineElementValue,
      // item.refineElementBonus,
      item.refineItemId,
      item.refineId,
      // item.rareAttributeItemId,
      item.attributeProbability,
      GameItemProtoLimitType[item.limitType0] || "LIMIT_NONE",
      item.limitValue0,
      GameItemProtoLimitType[item.limitType1] || "LIMIT_NONE",
      item.limitValue1,
      GameItemProtoApplyType[item.attributeId0] || "APPLY_NONE",
      item.attributeValue0,
      GameItemProtoApplyType[item.attributeId1] || "APPLY_NONE",
      item.attributeValue1,
      GameItemProtoApplyType[item.attributeId2] || "APPLY_NONE",
      item.attributeValue2,
      // GameItemProtoApplyType[item.attributeId3],
      // item.attributeValue3,
      item.value0,
      item.value1,
      item.value2,
      item.value3,
      item.value4,
      item.value5,
      // item.socket0,
      // item.socket1,
      // item.socket2,
      // item.socket3,
      // item.socket4,
      // item.socket5,
      item.specularPercent,
      item.socketCount,
      // GameItemProtoMaskType[item.maskTypeId],
      // maskSubTypes[item.maskSubTypeId] || 0,
      item.attributeType
    ]
  }

}