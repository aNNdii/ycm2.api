import { Container } from "../infrastructures/Container";

import { CharacterEmpireTable, CharacterTable } from "../interfaces/Character";
import { GuildGradeTable, GuildMemberTable } from "../interfaces/Guild";
import { EntityTableFilter } from "../interfaces/Entity";
import { AccountTable } from "../interfaces/Account";
import { MapTable } from "../interfaces/Map";

import { CharacterServiceToken } from "../services/CharacterService";

import { Entity, IEntity  } from "./Entity";

export type CharacterProperties = EntityTableFilter<"player", CharacterTable>
                                & EntityTableFilter<"player_index", CharacterEmpireTable>
                                & EntityTableFilter<"account", AccountTable>
                                & EntityTableFilter<"guild_member", GuildMemberTable>
                                & EntityTableFilter<"guild_grade", GuildGradeTable>
                                & EntityTableFilter<"map", MapTable>
                                

export type ICharacter = IEntity & {
  id: number
  hashId: string
  accountId: number
  name: string
  empireId: number
  jobId: number
  level: number
  hp: number
  mp: number
  stamina: number
  health: number
  strength: number
  dexterity: number
  intelligent: number
  experience: number
  money: number
  x: number
  y: number
  mapId: number
  skillGroup: number
  skillPointCount: number
  statPointCount: number
  alignment: number
  quickSlots: any
  skills: any
  horseHealth: number
  horseStamina: number
  horseLevel: number
  horseDeathDate: number
  horseRiding: number
  horseSkillPointCount: number
  guildId: number
  guildGradeId: number
  lastPlayDate: string
  playTime: number
  ip: string
}

export class Character extends Entity<CharacterProperties> implements ICharacter {

  get id() {
    return this.getProperty("player.id")
  }

  get hashId() {
    const characterService = Container.get(CharacterServiceToken)
    return characterService.obfuscateCharacterId(this.id)
  }

  get accountId() {
    return this.getProperty("player.account_id")
  }

  get name() {
    return this.getProperty("player.name")
  }

  get empireId() {
    return this.getProperty("player_index.empire")
  }

  get jobId() {
    return this.getProperty("player.job")
  }

  get level() {
    return this.getProperty("player.level")
  }

  get hp() {
    return this.getProperty("player.hp")
  }

  get mp() {
    return this.getProperty("player.mp")
  }

  get stamina() {
    return this.getProperty("player.stamina")
  }

  get strength() {
    return this.getProperty("player.st")
  }

  get health() {
    return this.getProperty("player.ht")
  }

  get dexterity() {
    return this.getProperty("player.dx")
  }

  get intelligent() {
    return this.getProperty("player.iq")
  }

  get experience() {
    return this.getProperty("player.exp")
  }

  get money() {
    return this.getProperty("player.gold")
  }

  get x() {
    const characterX = this.getProperty("player.x") || 0
    const mapBaseX = this.getProperty("map.map_base_x") || 0
    
    return Math.floor((characterX - mapBaseX) / 100)
  }

  get y() {
    const characterY = this.getProperty("player.y") || 0
    const mapBaseY = this.getProperty("map.map_base_y") || 0
    
    return Math.floor((characterY - mapBaseY) / 100)
  }

  get mapId() {
    return this.getProperty("map.map_id")
  }

  get skillGroup() {
    return this.getProperty("player.skill_group")
  }

  get skillPointCount() {
    return this.getProperty("player.skill_point")
  }

  get statPointCount() {
    return this.getProperty("player.stat_point")
  }

  get quickSlots() {
    return this.getProperty("player.quickslot")
  }

  get skills() {
    return this.getProperty("player.skill_level")
  }

  get alignment() {
    return this.getProperty("player.alignment")
  }

  get horseHealth() {
    return this.getProperty("player.horse_hp")
  }

  get horseStamina() {
    return this.getProperty("player.horse_stamina")
  }

  get horseLevel() {
    return this.getProperty("player.horse_level")
  }

  get horseDeathDate() {
    return this.getProperty("player.horse_hp_droptime")
  }

  get horseRiding() {
    return this.getProperty("player.horse_riding")
  }

  get horseSkillPointCount() {
    return this.getProperty("player.horse_skill_point")
  }

  get guildId() {
    return this.getProperty("guild_member.guild_id")
  }

  get guildGradeId() {
    return this.getProperty("guild_member.grade")
  }

  get lastPlayDate() {
    return this.getProperty("player.last_play")
  }

  get playTime() {
    return this.getProperty("player.playtime")
  }

  get ip() {
    return this.getProperty("player.ip")
  }

}