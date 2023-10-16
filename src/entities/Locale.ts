import { Container } from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { LocaleTable } from "../interfaces/Locale";

import { LocaleServiceToken } from "../services/LocaleService";

import { Entity, IEntity  } from "./Entity";

export type LocaleProperties = EntityTableFilter<"locale", LocaleTable>

export type ILocale = IEntity & {
  id: number
  hashId: string
  code: string
  name: string
  createdDate: string
  modifiedDate: string
}

export class Locale extends Entity<LocaleProperties> implements ILocale {

  get id() {
    return this.getProperty("locale.locale_id")
  }

  get hashId() {
    const localeService = Container.get(LocaleServiceToken)
    return localeService.obfuscateLocaleId(this.id)
  }

  get code() {
    return this.getProperty("locale.locale_code")
  }

  get name() {
    return this.getProperty("locale.locale_name")
  }

  get createdDate() {
    return this.getProperty("locale.locale_created_date")
  }

  get modifiedDate() {
    return this.getProperty("locale.locale_modified_date")
  }


}