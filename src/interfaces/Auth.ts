
export const AuthorizationAdminId = -1

export enum AuthenticationMethod { 
  PASSWORD,
  REFRESH_TOKEN
}

export enum AuthenticationTokenType {
  ACCESS = "access",
  REFRESH = "refresh"
}

export enum Authorization { 
  LOCALES = 0,
  ACCOUNTS = 1,
  CHARACTERS = 2,
  ITEMS = 3,
  MOBS = 4,
  MAPS = 5,
}

export enum AuthorizationAction {
  READ = 1 << 0,
  WRITE = 1 << 1,
  EXPORT = 1 << 2
}