import { Container } from "../infrastructures/Container";

import { LocaleMobTable } from "../interfaces/Locale";
import { EntityTableFilter } from "../interfaces/Entity";

import { LocaleServiceToken } from "../services/LocaleService";

import { Entity, IEntity  } from "./Entity";


export type LocaleMobProperties = EntityTableFilter<"locale_mob", LocaleMobTable>

export type ILocaleMob = IEntity & {
  id: number
  hashId: string
  localeId: number
  mobId: number
  name: string
  createdDate: string
  modifiedDate: string
}

export class LocaleMob extends Entity<LocaleMobProperties> implements ILocaleMob {

  get id() {
    return this.getProperty("locale_mob.locale_mob_id")
  }

  get hashId() {
    const localeService = Container.get(LocaleServiceToken)
    return localeService.obfuscateLocaleMobId(this.id)
  }

  get localeId() {
    return this.getProperty("locale_mob.locale_mob_locale_id")
  }

  get mobId() {
    return this.getProperty("locale_mob.locale_mob_mob_id")
  }

  get name() {
    return this.getProperty("locale_mob.locale_mob_name") || ""
  }

  get createdDate() {
    return this.getProperty("locale_mob.locale_mob_created_date")
  }

  get modifiedDate() {
    return this.getProperty("locale_mob.locale_mob_modified_date")
  }

}