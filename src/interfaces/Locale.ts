import { EntityTable } from "./Entity";

export type LocaleTable = EntityTable & {
  locale_id: number
  locale_code: string
  locale_name: string
  locale_created_date: string
  locale_modified_date: string
}

export type LocaleItemTable = EntityTable & {
  locale_item_id: number
  locale_item_locale_id: number
  locale_item_item_id: number
  locale_item_name: string
  locale_item_description: string
  locale_item_category: string
  locale_item_created_date: string
  locale_item_modified_date: string
}

export type LocaleMobTable = EntityTable & {
  locale_mob_id: number
  locale_mob_locale_id: number
  locale_mob_mob_id: number
  locale_mob_name: string
  locale_mob_created_date: string
  locale_mob_modified_date: string
}