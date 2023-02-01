import Container from "typedi";
import { AccountGroupTable } from "../interfaces/Account";
import { EntityTableFilter } from "../interfaces/Entity";
import { AccountServiceToken } from "../services/AccountService";
import Entity, { IEntity } from "./Entity";


export type AccountGroupProperties = EntityTableFilter<"account_group", AccountGroupTable>

export type IAccountGroup = IEntity & {
  id: number
  hashId: string
  name: string
  createdDate: string
  modifiedDate: string
}

export default class AccountGroup extends Entity<AccountGroupProperties> implements IAccountGroup {

  get id() {
    return this.getProperty("account_group.account_group_id")
  }

  get hashId() {
    const accountService = Container.get(AccountServiceToken)
    return accountService.obfuscateAccountGroupId(this.id)
  }

  get name() {
    return this.getProperty("account_group.account_group_name")
  }

  get createdDate() {
    return this.getProperty("account_group.account_group_created_date")
  }

  get modifiedDate() {
    return this.getProperty("account_group.account_group_modified_date")
  }

}