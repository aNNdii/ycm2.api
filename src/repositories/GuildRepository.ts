import Container, { Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import GuildMessage, { GuildMessageProperties, IGuildMessage } from "../entities/GuildMessage";
import GuildGrade, { GuildGradeProperties, IGuildGrade } from "../entities/GuildGrade";
import Guild, { GuildProperties, IGuild } from "../entities/Guild";

import { MariaRepositorySelectOptions, MariaRepositoryToken } from "./MariaRepository";
import Repository, { IRepository } from "./Repository";
import { GameRepositoryToken } from "./GameRepository";

export const GuildRepositoryToken = new Token<IGuildRepository>("GuildRepository")

export type IGuildRepository = IRepository & {
  getGuilds<Entity = IGuild, Filter = GuildProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getGuildGrades<Entity = IGuildGrade, Filter = GuildGradeProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getGuildMessages<Entity = IGuildMessage, Filter = GuildMessageProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
} 

export default class GuildRepository extends Repository implements IGuildRepository {
  
  getGuilds<Entity = IGuild, Filter = GuildProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getGuilds", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Guild(row),
      table: `${playerDatabase}.guild`
    }, options))
  }

  getGuildGrades<Entity = IGuildGrade, Filter = GuildGradeProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getGuildGrades", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new GuildGrade(row),
      table: `${playerDatabase}.guild_grade`
    }, options))
  }

  getGuildMessages<Entity = IGuildMessage, Filter = GuildMessageProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getGuildMessages", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new GuildMessage(row),
      table: `${playerDatabase}.guild_comment`,
      joins: [
        `LEFT JOIN ${playerDatabase}.player ON guild_comment.name = player.name`
      ]
    }))
  }

}