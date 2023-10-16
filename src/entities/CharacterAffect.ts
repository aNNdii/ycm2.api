import { CharacterAffectTable } from "../interfaces/CharacterAffect";
import { EntityTableFilter } from "../interfaces/Entity";

import { Entity, IEntity  } from "./Entity";

export type CharacterAffectProperties = EntityTableFilter<"affect", CharacterAffectTable>

export type ICharacterAffect = IEntity & {
  characterId: number
  typeId: number
  applyId: number
  applyValue: number
  flag: number
  duration: number
  cost: number
}

export class CharacterAffect extends Entity<CharacterAffectProperties> implements ICharacterAffect {


  get typeId() {
    return this.getProperty("affect.bType")
  }

  get characterId() {
    return this.getProperty("affect.dwPID")
  }

  get applyId() {
    return this.getProperty("affect.bApplyOn")
  }

  get applyValue() {
    return this.getProperty("affect.lApplyValue")
  }

  get flag() {
    return this.getProperty("affect.dwFlag")
  }

  get duration() {
    return this.getProperty("affect.lDuration")
  }

  get cost() {
    return this.getProperty("affect.lSPCost")
  }
  
}