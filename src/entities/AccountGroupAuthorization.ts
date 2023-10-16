import { AccountGroupAuthorizationTable } from "../interfaces/Account";
import { EntityTableFilter } from "../interfaces/Entity";

import { Entity, IEntity  } from "./Entity";

export type AccountGroupAuthorizationProperties = EntityTableFilter<"account_group_authorization", AccountGroupAuthorizationTable>

export type IAccountGroupAuthorization = IEntity & {
  accountGroupId: number
  authorizationId: number
  createdDate: string
}

export class AccountGroupAuthorization extends Entity<AccountGroupAuthorizationProperties> implements IAccountGroupAuthorization {

  get authorizationId() {
    return this.getProperty("account_group_authorization.account_group_authorization_id")
  }

  get accountGroupId() {
    return this.getProperty("account_group_authorization.account_group_authorization_account_group_id")
  }

  get createdDate() {
    return this.getProperty("account_group_authorization.account_group_authorization_created_date")
  }

}