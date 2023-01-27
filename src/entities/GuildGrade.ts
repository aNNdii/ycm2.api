import { EntityTableFilter } from "../interfaces/Entity";
import { GuildGradeTable } from "../interfaces/Guild";

import Entity, { IEntity } from "./Entity";

export type GuildGradeProperties = EntityTableFilter<"guild_grade", GuildGradeTable>

export type IGuildGrade = IEntity & {
  id: number
  guildId: number,
  name: string
  authorizations: any
}

export default class GuildGrade extends Entity<GuildGradeProperties> implements IGuildGrade {

  get id() {
    return this.getProperty("guild_grade.grade")
  }

  get guildId() {
    return this.getProperty("guild_grade.guild_id")
  }

  get name() {
    return this.getProperty("guild_grade.name")
  }

  get authorizations() {
    return this.getProperty("guild_grade.auth")
  }

}