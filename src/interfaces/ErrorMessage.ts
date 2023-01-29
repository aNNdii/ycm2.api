
export enum ErrorMessage {

  INTERNAL_GRAPHQL_ERROR = "internal_graphql_error",
  INVALID_REQUEST_PARAMETERS = "invalid_request_parameters",

  GAME_DATABASE_INVALID = "invalid_game_database",

  PAGINATION_OFFSET_INVALID = "invalid_pagination_offset",
  PAGINATION_LIMIT_INVALID = "invalid_pagination_limit",
  PAGINATION_ORDER_INVALID = "invalid_pagination_order",

  AUTH_INSUFFICIENT_PERMISSION = "auth_insufficient_permission",
  AUTH_TOKEN_NOT_FOUND = "auth_token_not_found",
  AUTH_INVALID_TOKEN = "invalid_auth_token",

  ACCOUNT_INVALID_ID = "invalid_account_id",
  ACCOUNT_NOT_FOUND = "account_not_found",
  ACCOUNT_BLOCKED = "account_blocked",

  CHARACTER_INVALID_ID = "invalid_character_id",

  CHARACTER_ITEM_INVALID_ID = "invalid_character_item_id",

  ITEM_INVALID_ID = "invalid_item_id",
  ITEM_NOT_FOUND = "item_not_found",

  ITEM_ATTRIBUTE_NOT_FOUND = "item_attribute_not_found",

  ITEM_PROTO_INVALID_TYPE = "invalid_item_proto_type",
  ITEM_PROTO_INVALID = "invalid_item_proto",

  LOCALE_INVALID_ID = "invalid_locale_id",
  LOCALE_NOT_FOUND = "locale_not_found",

  LOCALE_ITEM_INVALID_ID = "invalid_locale_item_id",
  LOCALE_ITEM_NOT_FOUND = "locale_item_not_found",

  LOCALE_MOB_INVALID_ID = "invalid_locale_mob_id",
  LOCALE_MOB_NOT_FOUND = "locale_mob_not_found",

  MOB_NOT_FOUND = "mob_not_found",

  MOP_GROUP_INVALID_ID = "invalid_mob_group_id",
  MOB_GROUP_NOT_FOUND = "mob_group_not_found",

  MOB_GROUP_MOB_INVALID_ID = "invalid_mob_group_mob_id",
  MOB_GROUP_MOB_NOT_FOUND = "mob_group_mob_not_found",
  
  MOB_GROUP_GROUP_INVALID_ID = "invalid_mob_group_group_id",
  MOB_GROUP_GROUP_NOT_FOUND = "mob_group_group_not_found",
  
  MOB_GROUP_GROUP_MOB_GROUP_INVALID_ID = "invalid_mob_group_group_mob_group_id",
  MOB_GROUP_GROUP_MOB_GROUP_NOT_FOUND = "mob_group_group_mob_group_not_found",

  MOB_ITEM_INVALID_ID = "invalid_mob_item_id",
  MOB_ITEM_NOT_FOUND = "mob_item_not_found",

  MOB_RANK_ITEM_INVALID_ID = "invalid_mob_rank_item_id",
  MOB_RANK_ITEM_NOT_FOUND = "mob_rank_item_not_found",

  MAP_INVALID_ID = "invalid_map_id",
  MAP_NOT_FOUND = "map_not_found",

  MAP_ENTITY_INVALID_ID = "invalid_map_entity_id",
  MAP_ENTITY_NOT_FOUND = "map_entity_not_found",

  GUILD_INVALID_ID = "invalid_guild_id",
  GUILD_NOT_FOUND = "guild_not_found",
  GUILD_MESSAGE_INVALID_ID = "invalid_guild_message_id",

  CAPTCHA_TOKEN_INVALID = "invalid_captcha_token",
  CAPTCHA_TOKEN_EXPIRED = "captcha_token_expired",
  CAPTCHA_VALUE_INVALID = "invalid_captcha_value"

}