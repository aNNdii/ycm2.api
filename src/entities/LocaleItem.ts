import Container from "../infrastructures/Container";

import { LocaleItemTable } from "../interfaces/Locale";
import { EntityTableFilter } from "../interfaces/Entity";

import { LocaleServiceToken } from "../services/LocaleService";

import Entity, { IEntity } from "./Entity";

export type LocaleItemProperties = EntityTableFilter<"locale_item", LocaleItemTable>

export type ILocaleItem = IEntity & {
  id: number
  hashId: string
  localeId: number
  itemId: number
  name: string
  description: string
  category: string
  createdDate: string
  modifiedDate: string
}

export default class LocaleItem extends Entity<LocaleItemProperties> implements ILocaleItem {

  get id() {
    return this.getProperty("locale_item.locale_item_id")
  }

  get hashId() {
    const localeService = Container.get(LocaleServiceToken)
    return localeService.obfuscateLocaleItemId(this.id)
  }

  get localeId() {
    return this.getProperty("locale_item.locale_item_locale_id")
  }

  get itemId() {
    return this.getProperty("locale_item.locale_item_item_id")
  }

  get name() {
    return this.getProperty("locale_item.locale_item_name") || ""
  }

  get description() {
    return this.getProperty("locale_item.locale_item_description") || ""
  }

  get category() {
    return this.getProperty("locale_item.locale_item_category") || ""
  }

  get createdDate() {
    return this.getProperty("locale_item.locale_item_created_date")
  }

  get modifiedDate() {
    return this.getProperty("locale_item.locale_item_modified_date")
  }

}