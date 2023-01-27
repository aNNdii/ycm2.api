import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { GuildTable } from "../interfaces/Guild";

import { GuildServiceToken } from "../services/GuildService";

import Entity, { IEntity } from "./Entity";

export type GuildProperties = EntityTableFilter<"guild", GuildTable>

export type IGuild = IEntity & {
  id: number
  hashId: string
  name: string
  masterId: number
  level: number
  sp: number
  experience: number
  skills: any
  skillPointCount: number
  winCount: number
  drawCount: number
  lossCount: number
  pointCount: number
  money: number
}

export default class Guild extends Entity<GuildProperties> implements IGuild {

  get id() {
    return this.getProperty("guild.id")
  }

  get hashId() {
    const guildService = Container.get(GuildServiceToken)
    return guildService.obfuscateGuildId(this.id)
  }

  get name() {
    return this.getProperty("guild.name")
  }

  get masterId() {
    return this.getProperty("guild.master")
  }

  get level() {
    return this.getProperty("guild.level")
  }

  get sp() {
    return this.getProperty("guild.sp")
  }

  get experience() {
    return this.getProperty("guild.exp")
  }

  get skillPointCount() {
    return this.getProperty("guild.skill_point")
  }

  get skills() {
    return this.getProperty("guild.skill")
  }

  get winCount() {
    return this.getProperty("guild.win")
  }

  get drawCount() {
    return this.getProperty("guild.draw")
  }

  get lossCount() {
    return this.getProperty("guild.loss")
  }

  get pointCount() {
    return this.getProperty("guild.ladder_point")
  }

  get money() {
    return this.getProperty("guild.gold")
  }

}