import Container, { Token } from "../infrastructures/Container"

import { LocaleItemTable, LocaleMobTable, LocaleTable } from "../interfaces/Locale"

import { merge } from "../helpers/Object"

import LocaleItem, { ILocaleItem, LocaleItemProperties } from "../entities/LocaleItem"
import LocaleMob, { ILocaleMob, LocaleMobProperties } from "../entities/LocaleMob"
import Locale, { ILocale, LocaleProperties } from "../entities/Locale"

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryToken } from "./MariaRepository"
import Repository, { IRepository } from "./Repository"
import { GameRepositoryToken } from "./GameRepository"

export const LocaleRepositoryToken = new Token<ILocaleRepository>("LocaleRepository")

export type ILocaleRepository = IRepository & {
  getLocales<Entity = ILocale, Filter = LocaleProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createLocales<Entity = LocaleTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>

  getLocaleItems<Entity = ILocaleItem, Filter = LocaleItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createLocaleItems<Entity = LocaleItemTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>

  getLocaleMobs<Entity = ILocaleMob, Filter = LocaleMobProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createLocaleMobs<Entity = LocaleMobTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>
}

export default class LocaleRepository extends Repository implements ILocaleRepository {

  getLocales<Entity = ILocale, Filter = LocaleProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLocales", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Locale(row),
      table: `${cmsDatabase}.locale`
    }, options))
  }

  createLocales<Entity = LocaleTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLocales", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.locale`
    }, options))
  }

  getLocaleItems<Entity = ILocaleItem, Filter = LocaleItemProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLocaleItems", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new LocaleItem(row),
      table: `${cmsDatabase}.locale_item`
    }, options))
  }

  getLocaleMobs<Entity = ILocaleMob, Filter = LocaleMobProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLocaleMobs", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new LocaleMob(row),
      table: `${cmsDatabase}.locale_mob`
    }, options))

  }

  createLocaleItems<Entity = LocaleItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLocaleItems", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.locale_item`
    }, options))
  }

  createLocaleMobs<Entity = LocaleMobTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLocaleMobs", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.locale_mob`
    }, options))

  }

}