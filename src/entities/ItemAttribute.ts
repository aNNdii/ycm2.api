import { ItemAttributeTable } from "../interfaces/ItemAttribute";
import { EntityTableFilter } from "../interfaces/Entity";

import Entity, { IEntity } from "./Entity";


export type ItemAttributeProperties = EntityTableFilter<"item_attr", ItemAttributeTable>

export type IItemAttribute = IEntity & {
  id: number
  probability: number
  level1: number
  level2: number
  level3: number
  level4: number
  level5: number
  maxLevelWeapon: number
  maxLevelBody: number
  maxLevelWrist: number
  maxLevelFoot: number
  maxLevelNeck: number
  maxLevelHead: number
  maxLevelShield: number
  maxLevelEar: number
}

export default class ItemAttribute extends Entity<ItemAttributeProperties> implements IItemAttribute {

  get id() {
    return this.getCustomProperty('.id')
  }

  get probability() {
    return this.getProperty("item_attr.prob")
  }

  get level1() {
    return this.getProperty("item_attr.lv1")
  }

  get level2() {
    return this.getProperty("item_attr.lv2")
  }

  get level3() {
    return this.getProperty("item_attr.lv3")
  }

  get level4() {
    return this.getProperty("item_attr.lv4")
  }

  get level5() {
    return this.getProperty("item_attr.lv5")
  }

  get maxLevelWeapon() {
    return this.getProperty("item_attr.weapon")
  }

  get maxLevelBody() {
    return this.getProperty("item_attr.body")
  }

  get maxLevelWrist() {
    return this.getProperty("item_attr.wrist")
  }

  get maxLevelFoot() {
    return this.getProperty("item_attr.foots")
  }

  get maxLevelNeck() {
    return this.getProperty("item_attr.neck")
  }

  get maxLevelHead() {
    return this.getProperty("item_attr.head")
  }

  get maxLevelShield() {
    return this.getProperty("item_attr.shield")
  }

  get maxLevelEar() {
    return this.getProperty("item_attr.ear")
  }

}