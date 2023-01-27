import Container from "../infrastructures/Container";

import { CharacterItemTable, CharacterItemWindow } from "../interfaces/CharacterItem";
import { EntityTableFilter } from "../interfaces/Entity";

import { CharacterServiceToken } from "../services/CharacterService";

import Entity, { IEntity } from "./Entity";

export type CharacterItemProperties = EntityTableFilter<"item", CharacterItemTable>

export type ICharacterItem = IEntity & {
  id: number
  hashId: string
  characterId: number
  characterHashId: string
  itemId: number
  window: CharacterItemWindow
  count: number
  position: number
  socket0: number
  socket1: number
  socket2: number
  socket3: number
  socket4: number
  socket5: number
  attributeId0: number
  attributeValue0: number
  attributeId1: number
  attributeValue1: number
  attributeId2: number
  attributeValue2: number
  attributeId3: number
  attributeValue3: number
  attributeId4: number
  attributeValue4: number
  attributeId5: number
  attributeValue5: number
  attributeId6: number
  attributeValue6: number
}

export default class CharacterItem extends Entity<CharacterItemProperties> implements ICharacterItem {

  get id() {
    return this.getProperty("item.id")
  }

  get hashId() {
    const characterService = Container.get(CharacterServiceToken)
    return characterService.obfuscateCharacterItemId(this.id)
  }

  get characterId() {
    return this.getProperty("item.owner_id")
  }

  get characterHashId() {
    const characterService = Container.get(CharacterServiceToken)
    return characterService.obfuscateCharacterId(this.characterId)
  }

  get itemId() {
    return this.getProperty("item.vnum")
  }

  get window() {
    return this.getProperty("item.window")
  }

  get count() {
    return this.getProperty("item.count")
  }

  get position() {
    return this.getProperty("item.pos")
  }

  get socket0() {
    return this.getProperty("item.socket0")
  }

  get socket1() {
    return this.getProperty("item.socket1")
  }

  get socket2() {
    return this.getProperty("item.socket2")
  }

  get socket3() {
    return this.getProperty("item.socket3")
  }

  get socket4() {
    return this.getProperty("item.socket4")
  }

  get socket5() {
    return this.getProperty("item.socket5")
  }

  get attributeId0() {
    return this.getProperty("item.attrtype0")
  }

  get attributeValue0() {
    return this.getProperty("item.attrvalue0")
  }

  get attributeId1() {
    return this.getProperty("item.attrtype1")
  }

  get attributeValue1() {
    return this.getProperty("item.attrvalue1")
  }

  get attributeId2() {
    return this.getProperty("item.attrtype2")
  }

  get attributeValue2() {
    return this.getProperty("item.attrvalue2")
  }

  get attributeId3() {
    return this.getProperty("item.attrtype3")
  }

  get attributeValue3() {
    return this.getProperty("item.attrvalue3")
  }

  get attributeId4() {
    return this.getProperty("item.attrtype4")
  }

  get attributeValue4() {
    return this.getProperty("item.attrvalue4")
  }

  get attributeId5() {
    return this.getProperty("item.attrtype5")
  }

  get attributeValue5() {
    return this.getProperty("item.attrvalue5")
  }

  get attributeId6() {
    return this.getProperty("item.attrtype6")
  }

  get attributeValue6() {
    return this.getProperty("item.attrvalue6")
  }

}