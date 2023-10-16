import { Container } from "../infrastructures/Container";

import { CharacterTable } from "../interfaces/Character";
import { EntityTableFilter } from "../interfaces/Entity";
import { GuildCommentTable } from "../interfaces/Guild";

import { CharacterServiceToken } from "../services/CharacterService";
import { GuildServiceToken } from "../services/GuildService";

import { Entity, IEntity  } from "./Entity";


export type GuildMessageProperties = EntityTableFilter<"guild_comment", GuildCommentTable>
                                   & EntityTableFilter<"player", CharacterTable>


export type IGuildMessage = IEntity & {
  id: number
  hashId: string
  guildId: number
  guildHashId: string
  characterId: number
  characterHashId: string
  content: string
  createdDate: string
}

export class GuildMessage extends Entity<GuildMessageProperties> implements IGuildMessage {

  get id() {
    return this.getProperty("guild_comment.id")
  }

  get hashId() {
    const guildService = Container.get(GuildServiceToken)
    return guildService.obfuscateGuildMessageId(this.id)
  }

  get guildId() {
    return this.getProperty("guild_comment.guild_id")
  }

  get guildHashId() {
    const guildService = Container.get(GuildServiceToken)
    return guildService.obfuscateGuildId(this.guildId)
  }

  get characterId() {
    return this.getProperty("player.id")
  }

  get characterHashId() {
    const characterService = Container.get(CharacterServiceToken)
    return characterService.obfuscateCharacterId(this.characterId)
  }

  get content() {
    return this.getProperty("guild_comment.content")
  }

  get createdDate() {
    return this.getProperty("guild_comment.time")
  }

}