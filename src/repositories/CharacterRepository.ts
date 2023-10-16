import { Container, Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import { CharacterItem, CharacterItemProperties, ICharacterItem } from "../entities/CharacterItem";
import { Character, ICharacter, CharacterProperties } from "../entities/Character";

import { MariaRepositorySelectOptions, MariaRepositoryToken } from "./MariaRepository";
import { Repository, IRepository } from "./Repository";
import { GameRepositoryToken } from "./GameRepository";

export const CharacterRepositoryToken = new Token<ICharacterRepository>("CharacterRepository")

export type ICharacterRepository = IRepository & {
  getCharacters<Entity = ICharacter, Filter = CharacterProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getCharacterItems<Entity = ICharacterItem, Filter = CharacterItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
}

export class CharacterRepository extends Repository implements ICharacterRepository {

  getCharacters<Entity = ICharacter, Filter = CharacterProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getCharacters", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const accountDatabase = gameRepository.getAccountDatabaseName()
    const playerDatabase = gameRepository.getPlayerDatabaseName()
    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
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

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new CharacterItem(row),
      table: `${playerDatabase}.item`
    }, options))
  }

}