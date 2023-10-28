import { Container } from "../infrastructures/Container";

import { AccountTable } from "../interfaces/Account";
import { EntityTableFilter } from "../interfaces/Entity";
import { LocaleTable } from "../interfaces/Locale";
import { SafeBoxTable } from "../interfaces/SafeBox";

import { AccountServiceToken } from "../services/AccountService";

import { Entity, IEntity  } from "./Entity";

export type AccountProperties = EntityTableFilter<"account", AccountTable>
                              & EntityTableFilter<"safebox", SafeBoxTable>
                              & EntityTableFilter<"locale", LocaleTable>

export type IAccount = IEntity & {
  id: number
  hashId: string
  username: string
  password: string
  mail: string
  status: string
  deleteCode: string
  safeBoxCode: string
  blockExpirationDate: string
  moneyBonusExpirationDate: string
  itemBonusExpirationDate: string
  experienceBonusExpirationDate: string
  safeBoxExtensionExpirationDate: string
  autoLootExpirationDate: string
  fishingBonusExpirationDate: string
  marriageBonusExpirationDate: string
  localeId: number
  localeCode: string
  lastPlayDate: string
  createDate: string
  modifiedDate: string
}

export class Account extends Entity<AccountProperties> implements IAccount {

  get id() {
    return this.getProperty("account.id")
  }

  get hashId() {
    const accountService = Container.get(AccountServiceToken)
    return accountService.obfuscateAccountId(this.id)
  }

  get mail() {
    return this.getProperty("account.ycm2_account_mail")
  }

  get username() {
    return this.getProperty("account.login")
  }

  get password() {
    return this.getProperty("account.password")
  }

  get status() {
    return this.getProperty("account.status")
  }

  get blockExpirationDate() {
    return this.getProperty("account.availDt")
  }

  get deleteCode() {
    return this.getProperty("account.social_id")
  }

  get safeBoxCode() {
    return this.getProperty("safebox.password")
  }

  get itemBonusExpirationDate() {
    return this.getProperty("account.gold_expire")
  }

  get experienceBonusExpirationDate() {
    return this.getProperty("account.silver_expire")
  }

  get safeBoxExtensionExpirationDate() {
    return this.getProperty("account.safebox_expire")
  }

  get autoLootExpirationDate() {
    return this.getProperty("account.autoloot_expire")
  }

  get fishingBonusExpirationDate() {
    return this.getProperty("account.fish_mind_expire")
  }

  get marriageBonusExpirationDate() {
    return this.getProperty("account.marriage_fast_expire")
  }

  get moneyBonusExpirationDate() {
    return this.getProperty("account.money_drop_rate_expire")
  }

  get localeId() {
    return this.getProperty("account.ycm2_account_locale_id")
  }

  get localeCode() {
    return this.getProperty("locale.locale_code")
  }

  get lastPlayDate() {
    return this.getProperty("account.last_play")
  }

  get createDate() {
    return this.getProperty("account.create_time")
  }

  get modifiedDate() {
    return this.getProperty("account.ycm2_account_modified_date")
  }

}