import { EntityTableFilter } from "../interfaces/Entity";
import { ItemMaskType, ItemTable, ItemType   } from "../interfaces/Item";

import Entity, { IEntity } from "./Entity";

export type ItemProperties = EntityTableFilter<"item", ItemTable>

export type IItem = IEntity & {
  id: number
  name: string
  localeName: string
  typeId: ItemType
  subTypeId: number
  endId: number
  size: number
  flagId: number
  antiFlagId: number
  wearFlagId: number
  immuneFlagId: number
  buyPrice: number
  sellPrice: number
  refineElementApplyType: number
  refineElementGrade: number
  refineElementValue: number
  refineElementBonus: number
  refineId: number
  refineItemId: number
  attributeProbability: number
  rareAttributeItemId: number
  limitType0: number
  limitValue0: number
  limitType1: number
  limitValue1: number
  attributeId0: number
  attributeValue0: number
  attributeId1: number
  attributeValue1: number
  attributeId2: number
  attributeValue2: number
  attributeId3: number
  attributeValue3: number
  value0: number
  value1: number
  value2: number
  value3: number
  value4: number
  value5: number
  socket0: number
  socket1: number
  socket2: number
  socket3: number
  socket4: number
  socket5: number
  specularPercent: number
  socketCount: number
  maskTypeId: ItemMaskType
  maskSubTypeId: number
  attributeType: number
  icon: string
  model: string
  blendAttributeId: number
  blendAttributeValue0: number
  blendAttributeValue1: number
  blendAttributeValue2: number
  blendAttributeValue3: number
  blendAttributeValue4: number
  blendAttributeDuration0: number
  blendAttributeDuration1: number
  blendAttributeDuration2: number
  blendAttributeDuration3: number
  blendAttributeDuration4: number
  createdDate: string
  modifiedDate: string
}

export default class Item extends Entity<ItemProperties> implements IItem {

  get id() {
    return this.getProperty("item.item_id")
  }

  get name() {
    return this.getProperty("item.item_name")
  }

  get localeName() {
    return this.getProperty("item.item_locale_name")
  }

  get typeId() {
    return this.getProperty("item.item_type")
  }

  get subTypeId() {
    return this.getProperty("item.item_subtype")
  }

  get endId() {
    return this.getProperty("item.item_end_id")
  }

  get size() {
    return this.getProperty("item.item_size")
  }

  get antiFlagId() {
    return this.getProperty("item.item_anti_flag_id")
  }

  get flagId() {
    return this.getProperty("item.item_flag_id")
  }

  get wearFlagId() {
    return this.getProperty("item.item_wear_flag_id")
  }

  get immuneFlagId() {
    return this.getProperty("item.item_immune_flag_id")
  }

  get buyPrice() {
    return this.getProperty("item.item_shop_buy_price")
  }
  
  get sellPrice() {
    return this.getProperty("item.item_shop_sell_price")
  }

  get refineElementApplyType() {
    return this.getProperty("item.item_refine_element_apply_type")
  }

  get refineElementGrade() {
    return this.getProperty("item.item_refine_element_grade")
  }

  get refineElementValue() {
    return this.getProperty("item.item_refine_element_value")
  }

  get refineElementBonus() {
    return this.getProperty("item.item_refine_element_bonus")
  }

  get refineId() {
    return this.getProperty("item.item_refine_id")
  }

  get refineItemId() {
    return this.getProperty("item.item_refine_item_id")
  }

  get rareAttributeItemId() {
    return this.getProperty("item.item_rare_attribute_item_id")
  }

  get attributeProbability() {
    return this.getProperty("item.item_attribute_probability")
  }

  get limitType0() {
    return this.getProperty("item.item_limit_type0")
  }

  get limitValue0() {
    return this.getProperty("item.item_limit_value0")
  }

  get limitType1() {
    return this.getProperty("item.item_limit_type1")
  }

  get limitValue1() {
    return this.getProperty("item.item_limit_value1")
  }

  get attributeId0() {
    return this.getProperty("item.item_apply_type0")
  }

  get attributeValue0() {
    return this.getProperty("item.item_apply_value0")
  }

  get attributeId1() {
    return this.getProperty("item.item_apply_type1")
  }

  get attributeValue1() {
    return this.getProperty("item.item_apply_value1")
  }

  get attributeId2() {
    return this.getProperty("item.item_apply_type2")
  }

  get attributeValue2() {
    return this.getProperty("item.item_apply_value2")
  }

  get attributeId3() {
    return this.getProperty("item.item_apply_type3")
  }

  get attributeValue3() {
    return this.getProperty("item.item_apply_value3")
  }

  get value0() {
    return this.getProperty("item.item_value0")
  }

  get value1() {
    return this.getProperty("item.item_value1")
  }

  get value2() {
    return this.getProperty("item.item_value2")
  }

  get value3() {
    return this.getProperty("item.item_value3")
  }

  get value4() {
    return this.getProperty("item.item_value4")
  }

  get value5() {
    return this.getProperty("item.item_value5")
  }

  get socket0() {
    return this.getProperty("item.item_socket0")
  }

  get socket1() {
    return this.getProperty("item.item_socket1")
  }

  get socket2() {
    return this.getProperty("item.item_socket2")
  }

  get socket3() {
    return this.getProperty("item.item_socket3")
  }

  get socket4() {
    return this.getProperty("item.item_socket4")
  }

  get socket5() {
    return this.getProperty("item.item_socket5")
  }

  get specularPercent() {
    return this.getProperty("item.item_specular_percent")
  }

  get socketCount() {
    return this.getProperty("item.item_socket_count")
  }

  get maskTypeId() {
    return this.getProperty("item.item_mask_type")
  }

  get maskSubTypeId() {
    return this.getProperty("item.item_mask_subtype")
  }

  get attributeType() {
    return this.getProperty("item.item_attribute_type")
  }

  get icon() {
    return this.getProperty("item.item_icon")
  }

  get model() {
    return this.getProperty("item.item_model")
  }

  get blendAttributeId() {
    return this.getProperty("item.item_blend_apply_type")
  }

  get blendAttributeValue0() {
    return this.getProperty("item.item_blend_apply_value0")
  }

  get blendAttributeDuration0 () {
    return this.getProperty("item.item_blend_apply_duration0")
  }

  get blendAttributeValue1() {
    return this.getProperty("item.item_blend_apply_value1")
  }

  get blendAttributeDuration1() {
    return this.getProperty("item.item_blend_apply_duration1")
  }

  get blendAttributeValue2() {
    return this.getProperty("item.item_blend_apply_value2")
  }

  get blendAttributeDuration2() {
    return this.getProperty("item.item_blend_apply_duration2")
  }

  get blendAttributeValue3() {
    return this.getProperty("item.item_blend_apply_value3")
  }

  get blendAttributeDuration3() {
    return this.getProperty("item.item_blend_apply_duration3")
  }

  get blendAttributeValue4() {
    return this.getProperty("item.item_blend_apply_value4")
  }

  get blendAttributeDuration4() {
    return this.getProperty("item.item_blend_apply_duration4")
  }

  get createdDate() {
    return this.getProperty("item.item_created_date")
  }

  get modifiedDate() {
    return this.getProperty("item.item_modified_date")
  }

}