import { parseStream, writeToString } from "fast-csv";
import { createReadStream } from "fs";
import iconv from "iconv-lite";

import { Token } from "../infrastructures/Container";

import { DefaultEncoding, getFlagIdByFlags, getFlagsByFlagId, KoreanEncoding, parseProtoStream } from "../helpers/Game";

import { getEnumValues } from "../helpers/Enum";

import { GameItemProtoAntiFlag, GameItemProtoApplyType, GameItemProtoFlag, GameItemProtoFormat, GameItemProtoImmuneFlag, GameItemProtoLimitType, GameItemProtoMaskType, GameItemProtoMaskTypeCostume, GameItemProtoMaskTypeDragonStone, GameItemProtoMaskTypeEquipmentArmor, GameItemProtoMaskTypeEquipmentJewelry, GameItemProtoMaskTypeEquipmentWeapon, GameItemProtoMaskTypeEtc, GameItemProtoMaskTypeFishingPick, GameItemProtoMaskTypeMountPet, GameItemProtoMaskTypePotion, GameItemProtoMaskTypeSkill, GameItemProtoMaskTypeSubTypes, GameItemProtoMaskTypeTuning, GameItemProtoMaskTypeUnique, GameItemProtoType, GameItemProtoTypeArmor, GameItemProtoTypeCostume, GameItemProtoTypeDragonSoul, GameItemProtoTypeExtract, GameItemProtoTypeFish, GameItemProtoTypeGacha, GameItemProtoTypeGiftbox, GameItemProtoTypeLottery, GameItemProtoTypeMaterial, GameItemProtoTypeMedium, GameItemProtoTypeMercenary, GameItemProtoTypeMetin, GameItemProtoTypePassive, GameItemProtoTypePet, GameItemProtoTypeQuest, GameItemProtoTypeResource, GameItemProtoTypeSoul, GameItemProtoTypeSpecial, GameItemProtoTypeSubTypes, GameItemProtoTypeUnique, GameItemProtoTypeUse, GameItemProtoTypeWeapon, GameItemProtoWearFlag } from "../interfaces/GameItem";
import { ItemAttribute, ItemLimitType, ItemMaskType, ItemTable, ItemType } from "../interfaces/Item";

import { ILocaleItem } from "../entities/LocaleItem";
import { IItem } from "../entities/Item";

import Service, { IService } from "./Service";

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

  parseItemNames<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>): Promise<T[]>
  parseItemDescriptions<T = any>(stream: NodeJS.ReadableStream, options?: ItemDescriptionParseOptions<T>): Promise<T[]>
  parseItemList<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>): Promise<T[]>
  parseItemProto(stream: NodeJS.ReadableStream, options?: ItemProtoParseOptions): Promise<Partial<ItemTable>[]>

  createItemNames<T = any>(items: T[], options?: CSVWriteOptions): Promise<Buffer>
  createItemDescriptions(items: ILocaleItem[]): Promise<Buffer>
  createItemList(items: IItem[]): Promise<Buffer>
  createItemProto(items: IItem[]): Promise<Buffer>
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

  async readItemNames<T = any>(path: string, options?: ItemParseOptions<T>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseItemNames(stream, options)
  }

  async parseItemNames<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>) {
    return parseProtoStream<T>(stream, {
      headers: ['id', 'name'],
      skipRows: 1,
      ...options,
    })
  }

  async createItemDescriptions(items: ILocaleItem[]) {
    const content = await writeToString(items, {
      delimiter: '\t',
      transform: (item: ILocaleItem) => [item.itemId, item.name, item.description, item.category]
    })

    return iconv.encode(content, DefaultEncoding)
  }

  async readItemDescriptions(path: string, options?: ItemDescriptionParseOptions<any>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseItemDescriptions(stream, options)
  }

  async parseItemDescriptions<T = any>(stream: NodeJS.ReadableStream, options?: ItemDescriptionParseOptions<T>) {
    return parseProtoStream<T>(stream, {
      headers: ['id', 'name', 'description', 'category'],
      ...options
    })
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

  async readItemProto(path: string, options?: ItemProtoParseOptions) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseItemProto(stream, options)
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

  async readItemList<T = any>(path: string, options?: ItemParseOptions<T>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseItemList(stream, options)
  }

  async parseItemList<T = any>(stream: NodeJS.ReadableStream, options?: ItemParseOptions<T>) {
    return parseProtoStream(stream, {
      headers: ['id', 'type', 'icon', 'model', '_'],
      ...options
    })
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
      item_attribute_chance_percent: ~~(row.magicChancePercent),
      item_limit_type0: limitType0 || ItemLimitType.NONE as any,
      item_limit_value0: ~~(row.limitValue0),
      item_limit_type1: limitType1 || ItemLimitType.NONE as any,
      item_limit_value1: ~~(row.limitValue1),
      item_apply_type0: applyType0 || ItemAttribute.NONE as any,
      item_apply_value0: ~~(row.applyValue0),
      item_apply_type1: applyType1 || ItemAttribute.NONE as any,
      item_apply_value1: ~~(row.applyValue1),
      item_apply_type2: applyType2 || ItemAttribute.NONE as any,
      item_apply_value2: ~~(row.applyValue2),
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
      item.item_apply_type3 = applyType3 || ItemAttribute.NONE as any
      item.item_apply_value3 = ~~(row.applyValue3)

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

    const subTypes = GameItemProtoTypeSubTypes[item.typeId] || {} as any
    const subTypeId = subTypes[item.subTypeId]
    
    const typeId = subTypeId ? GameItemProtoType[item.typeId] : undefined

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
      item.attributeChance,
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