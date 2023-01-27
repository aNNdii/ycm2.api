import { Token } from "../infrastructures/Container"

import { LocaleItemTable, LocaleMobTable, LocaleTable } from "../interfaces/Locale"

import { merge } from "../helpers/Object"

import LocaleItem, { ILocaleItem, LocaleItemProperties } from "../entities/LocaleItem"
import Locale, { ILocale, LocaleProperties } from "../entities/Locale"

import GameRepository, { GameDatabase, IGameRepository } from "./GameRepository"
import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions } from "./MariaRepository"
import LocaleMob, { ILocaleMob, LocaleMobProperties } from "../entities/LocaleMob"

export const LocaleRepositoryToken = new Token<ILocaleRepository>("LocaleRepository")

export type ILocaleRepository = IGameRepository & {
  getLocales<Entity = ILocale, Filter = LocaleProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createLocales<Entity = LocaleTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>

  getLocaleItems<Entity = ILocaleItem, Filter = LocaleItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createLocaleItems<Entity = LocaleItemTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>

  getLocaleMobs<Entity = ILocaleMob, Filter = LocaleMobProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createLocaleMobs<Entity = LocaleMobTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>
}

export default class LocaleRepository extends GameRepository implements ILocaleRepository {

  getLocales<Entity = ILocale, Filter = LocaleProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLocales", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Locale(row),
      table: `${cmsDatabase}.locale`
    }, options))
  }

  createLocales<Entity = LocaleTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLocales", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.locale`
    }, options))
  }

  getLocaleItems<Entity = ILocaleItem, Filter = LocaleItemProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLocaleItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new LocaleItem(row),
      table: `${cmsDatabase}.locale_item`
    }, options))
  }

  getLocaleMobs<Entity = ILocaleMob, Filter = LocaleMobProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLocaleMobs", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new LocaleMob(row),
      table: `${cmsDatabase}.locale_mob`
    }, options))

  }

  createLocaleItems<Entity = LocaleItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLocaleItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.locale_item`
    }, options))
  }

  createLocaleMobs<Entity = LocaleMobTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLocaleMobs", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.locale_mob`
    }, options))

  }

}