import { Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import CharacterItem, { CharacterItemProperties, ICharacterItem } from "../entities/CharacterItem";
import Character, { ICharacter, CharacterProperties } from "../entities/Character";

import GameRepository, { GameDatabase, IGameRepository } from "./GameRepository";
import { MariaRepositorySelectOptions } from "./MariaRepository";

export const CharacterRepositoryToken = new Token<ICharacterRepository>("CharacterRepository")

export type ICharacterRepository = IGameRepository & {
  getCharacters<Entity = ICharacter, Filter = CharacterProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getCharacterItems<Entity = ICharacterItem, Filter = CharacterItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
}

export default class CharacterRepository extends GameRepository implements ICharacterRepository {

  getCharacters<Entity = ICharacter, Filter = CharacterProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getCharacters", options)

    const accountDatabase = this.getDatabaseName(GameDatabase.ACCOUNT)
    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)
    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Character(row),
      table: `${playerDatabase}.player`,
      joins: [
        `INNER JOIN ${accountDatabase}.account ON account.id = player.account_id`,
        `LEFT JOIN ${playerDatabase}.player_index ON player_index.id = player.account_id`,
        `LEFT JOIN ${cmsDatabase}.map ON map.map_id = player.map_index`,
        `LEFT JOIN ${playerDatabase}.guild_member ON player.id = guild_member.pid`,
        `LEFT JOIN ${playerDatabase}.guild_grade ON guild_grade.guild_id = guild_member.guild_id AND guild_grade.grade = guild_member.grade`
      ]
    }, options))
  }

  getCharacterItems<Entity = ICharacterItem, Filter = CharacterItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]> {
    this.log("getCharacterItems", options)

    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new CharacterItem(row),
      table: `${playerDatabase}.item`,
      joins: [

      ]
    }, options))

  }

}