import { AccountGroupAccountTable } from "../interfaces/Account";
import { EntityTableFilter } from "../interfaces/Entity";

import Entity, { IEntity } from "./Entity";

export type AccountGroupAccountProperties = EntityTableFilter<"account_group_account", AccountGroupAccountTable>

export type IAccountGroupAccount = IEntity & {
  accountId: number
  accountGroupId: number
  createdDate: string
}

export default class AccountGroupAccount extends Entity<AccountGroupAccountProperties> implements IAccountGroupAccount {

  get accountId() {
    return this.getProperty("account_group_account.account_group_account_account_id")
  }  

  get accountGroupId() {
    return this.getProperty("account_group_account.account_group_account_account_group_id")
  }

  get createdDate() {
    return this.getProperty("account_group_account.account_group_account_created_date")
  }

}