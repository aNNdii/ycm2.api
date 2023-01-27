import DataLoader, { IDataLoader } from "../infrastructures/DataLoader";
import Container from "../infrastructures/Container";

import { unique } from "../helpers/Array";

import { EntityFilterMethod } from "../interfaces/Entity";

import { MobGroupGroupMobGroupOptions, MobGroupMobOptions, MobGroupOptions, MobItemOptions, MobOptions, MobRankItemOptions, MobServiceToken } from "./MobService";
import { GuildGradeOptions, GuildMessageOptions, GuildOptions, GuildServiceToken } from "./GuildService";
import { LocaleItemOptions, LocaleMobOptions, LocaleOptions, LocaleServiceToken } from "./LocaleService";
import { CharacterServiceToken, CharacterOptions, CharacterItemOptions } from "./CharacterService";
import { ItemAttributeOptions, ItemOptions, ItemServiceToken } from "./ItemService";
import { AccountServiceToken, AccountsOptions } from "./AccountService";
import { MapOptions, MapServiceToken } from "./MapService";
import Service, { IService, ServiceOptions } from "./Service";

import { IMobGroupGroupMobGroup } from "../entities/MobGroupGroupMobGroup";
import { ICharacterItem } from "../entities/CharacterItem";
import { IItemAttribute } from "../entities/ItemAttribute";
import { IMobGroupGroup } from "../entities/MobGroupGroup";
import { IGuildMessage } from "../entities/GuildMessage";
import { IMobGroupMob } from "../entities/MobGroupMob";
import { IMobRankItem } from "../entities/MobRankItem";
import { IGuildGrade } from "../entities/GuildGrade";
import { ILocaleItem } from "../entities/LocaleItem";
import { ICharacter } from "../entities/Character";
import { ILocaleMob } from "../entities/LocaleMob";
import { IMobGroup } from "../entities/MobGroup";
import { IMobItem } from "../entities/MobItem";
import { IAccount } from "../entities/Account";
import { ILocale } from "../entities/Locale";
import { IGuild } from "../entities/Guild";
import { IItem } from "../entities/Item";
import { IMap } from "../entities/Map";
import { IMob } from "../entities/Mob";

export type DataLoaderServiceOptions = ServiceOptions & {}

export type IDataLoaderService = IService & {
  getLocales(options?: LocaleOptions): Promise<ILocale[]>
  getLocalesById(id: number | number[]): Promise<ILocale[]>
  getLocalesByCode(codes: string | string[]): Promise<ILocale[]>

  getLocaleItems(options: LocaleItemOptions): Promise<ILocaleItem[]>
  getLocaleItemsById(id: number | number[]): Promise<ILocaleItem[]>
  getLocaleItemsByItemId(id: number | number[]): Promise<ILocaleItem[]>
  getLocaleItemsByLocaleId(id: number | number[]): Promise<ILocaleItem[]>

  getLocaleMobs(options: LocaleMobOptions): Promise<ILocaleMob[]>
  getLocaleMobsById(id: number | number[]): Promise<ILocaleMob[]>
  getLocaleMobsByMobId(id: number | number[]): Promise<ILocaleMob[]>
  getLocaleMobsByLocaleId(id: number | number[]): Promise<ILocaleMob[]>

  getAccounts(options?: AccountsOptions): Promise<IAccount[]>
  getAccountsById(id: number | number[]): Promise<IAccount[]>

  getCharacters(options?: CharacterOptions): Promise<ICharacter[]>
  getCharactersById(id: number | number[]): Promise<ICharacter[]>
  getCharactersByAccountId(id: number | number[]): Promise<ICharacter[]>
  getCharactersByGuildId(id: number | number[]): Promise<ICharacter[]>

  getCharacterItems(options?: CharacterItemOptions): Promise<ICharacterItem[]>

  getItems(options?: ItemOptions): Promise<IItem[]>
  getItemsById(id: number | number[]): Promise<IItem[]>
  getItemsByName(name: string | string[]): Promise<IItem[]>

  getItemAttributes(options?: ItemAttributeOptions): Promise<IItemAttribute[]>
  getItemAttributesById(id: number | number[]): Promise<IItemAttribute[]>
  getItemRareAttributesById(id: number | number[]): Promise<IItemAttribute[]>

  getMobs(options?: MobOptions): Promise<IMob[]>
  getMobsById(id: number | number[]): Promise<IMob[]>

  getMobItems(options?: MobItemOptions): Promise<IMobItem[]>
  getMobItemsById(id: number | number[]): Promise<IMobItem[]>
  getMobItemsByMobId(id: number | number[]): Promise<IMobItem[]>
  getMobItemsByItemId(id: number | number[]): Promise<IMobItem[]>

  getMobRankItems(options?: MobRankItemOptions): Promise<IMobRankItem[]>
  getMobRankItemsById(id: number | number[]): Promise<IMobRankItem[]>
  getMobRankItemsByItemId(id: number | number[]): Promise<IMobRankItem[]>
  getMobRankItemsByMobRankId(id: number | number[]): Promise<IMobRankItem[]>

  getMobGroups(options?: MobGroupOptions): Promise<IMobGroup[]>
  getMobGroupsById(id: number | number[]): Promise<IMobGroup[]>

  getMobGroupMobs(options?: MobGroupMobOptions): Promise<IMobGroupMob[]>
  getMobGroupMobsById(id: number | number[]): Promise<IMobGroupMob[]>
  getMobGroupMobsByMobId(id: number | number[]): Promise<IMobGroupMob[]>
  getMobGroupMobsByMobGroupId(id: number | number[]): Promise<IMobGroupMob[]>

  getMobGroupGroups(options?: MobGroupOptions): Promise<IMobGroupGroup[]>
  getMobGroupGroupsById(id: number | number[]): Promise<IMobGroupGroup[]>

  getMobGroupGroupMobGroups(options?: MobGroupGroupMobGroupOptions): Promise<IMobGroupGroupMobGroup[]>
  getMobGroupGroupMobGroupsById(id: number | number[]): Promise<IMobGroupGroupMobGroup[]>
  getMobGroupGroupMobGroupsByMobGroupId(id: number | number[]): Promise<IMobGroupGroupMobGroup[]>
  getMobGroupGroupMobGroupsByMobGroupGroupId(id: number | number[]): Promise<IMobGroupGroupMobGroup[]>

  getMaps(options?: MapOptions): Promise<IMap[]>
  getMapsById(id: number | number[]): Promise<IMap[]>

  getGuilds(options?: GuildOptions): Promise<IGuild[]>
  getGuildsById(id: number | number[]): Promise<IGuild[]>

  getGuildGrades(options?: GuildGradeOptions): Promise<IGuildGrade[]>
  getGuildGradesByGuildId(id: number | number[]): Promise<IGuildGrade[]>
  getGuildGradesByIdAndGuildId(id: number | number[], guildId: number | number[]): Promise<IGuildGrade[]>

  getGuildMessages(options?: GuildMessageOptions): Promise<IGuildMessage[]>
}

export default class DataLoaderService extends Service<DataLoaderServiceOptions> implements IDataLoaderService {

  private loaders: { [key: string]: IDataLoader } = {}


  getLocales(options?: LocaleOptions) {
    return this.get('locales', () => new DataLoader(options => Container.get(LocaleServiceToken).getLocales(options))).load(options)
  }

  getLocalesById(id: number | number[]) {
    return this.get('localesById', () => new DataLoader(ids => this.loadLocalesByIds(ids), { batch: true })).load(id)
  }

  getLocalesByCode(codes: string | string[]) {
    return this.get('localesByCode', () => new DataLoader(codes => this.loadLocalesByCodes(codes), { batch: true })).load(codes)
  }


  getLocaleItems(options: LocaleItemOptions) {
    return this.get('localeItems', () => new DataLoader(options => Container.get(LocaleServiceToken).getLocaleItems(options))).load(options)
  }

  getLocaleItemsById(id: number | number[]) {
    return this.get('localeItemsById', () => new DataLoader(ids => this.loadLocaleItemsByIds(ids), { batch: true })).load(id)
  }

  getLocaleItemsByItemId(id: number | number[]) {
    return this.get('localeItemsByItemId', () => new DataLoader(ids => this.loadLocaleItemsByItemIds(ids), { batch: true })).load(id)
  }

  getLocaleItemsByLocaleId(id: number | number[]) {
    return this.get('localeItemsByLocaleId', () => new DataLoader(ids => this.loadLocaleItemsByLocaleIds(ids), { batch: true })).load(id)
  }


  getLocaleMobs(options: LocaleMobOptions) {
    return this.get('localeMobs', () => new DataLoader(options => Container.get(LocaleServiceToken).getLocaleMobs(options))).load(options)
  }

  getLocaleMobsById(id: number | number[]) {
    return this.get('localeMobsById', () => new DataLoader(ids => this.loadLocaleMobsByIds(ids), { batch: true })).load(id)
  }

  getLocaleMobsByMobId(id: number | number[]) {
    return this.get('localeMobsByMobId', () => new DataLoader(ids => this.loadLocaleMobsByMobIds(ids), { batch: true })).load(id)
  }

  getLocaleMobsByLocaleId(id: number | number[]) {
    return this.get('localeMobsByLocaleId', () => new DataLoader(ids => this.loadLocaleMobsByLocaleIds(ids), { batch: true })).load(id)
  }


  getAccounts(options?: AccountsOptions) {
    return this.get('accounts', () => new DataLoader(options => Container.get(AccountServiceToken).getAccounts(options))).load(options)
  }

  getAccountsById(id: number | number[]) {
    return this.get('accountsById', () => new DataLoader(ids => this.loadAccountsByIds(ids), { batch: true })).load(id)
  }


  getCharacters(options?: CharacterOptions) {
    return this.get('characters', () => new DataLoader(options => Container.get(CharacterServiceToken).getCharacters(options))).load(options)
  }

  getCharactersById(id: number | number[]) {
    return this.get('charactersById', () => new DataLoader(ids => this.loadCharactersById(ids), { batch: true })).load(id)
  }

  getCharactersByAccountId(id: number | number[]) {
    return this.get('charactersByAccountId', () => new DataLoader(ids => this.loadCharactersByAccountId(ids), { batch: true })).load(id)
  }

  getCharactersByGuildId(id: number | number[]) {
    return this.get('charactersByGuildId', () => new DataLoader(ids => this.loadCharactersByGuildId(ids), { batch: true })).load(id)
  }


  getCharacterItems(options?: CharacterItemOptions) {
    return this.get('characterItems', () => new DataLoader(options => Container.get(CharacterServiceToken).getCharacterItems(options))).load(options)
  }


  getItems(options?: ItemOptions) {
    return this.get('items', () => new DataLoader(options => Container.get(ItemServiceToken).getItems(options))).load(options)
  }

  getItemsById(id: number | number[]) {
    return this.get('itemsById', () => new DataLoader(ids => this.loadItemsById(ids), { batch: true })).load(id)
  }

  getItemsByName(name: string | string[]) {
    return this.get('itemsByName', () => new DataLoader(names => this.loadItemsByName(names), { batch: true })).load(name)
  }


  getItemAttributes(options?: ItemAttributeOptions) {
    return this.get('itemAttributes', () => new DataLoader(options => Container.get(ItemServiceToken).getItemAttributes(options))).load(options)
  }

  getItemAttributesById(id: number | number[]) {
    return this.get('itemAttributesById', () => new DataLoader(ids => this.loadItemAttributesById(ids), { batch: true })).load(id)
  }

  getItemRareAttributesById(id: number | number[]) {
    return this.get('itemRareAttributesById', () => new DataLoader(ids => this.loadItemRareAttributesById(ids), { batch: true })).load(id)
  }


  getMobs(options?: ItemOptions) {
    return this.get('mobs', () => new DataLoader(options => Container.get(MobServiceToken).getMobs(options))).load(options)
  }

  getMobsById(id: number | number[]) {
    return this.get('mobsById', () => new DataLoader(ids => this.loadMobsById(ids), { batch: true })).load(id)
  }


  getMobItems(options?: MobItemOptions) {
    return this.get('mobItems', () => new DataLoader(options => Container.get(MobServiceToken).getMobItems(options))).load(options)
  }

  getMobItemsById(id: number | number[]) {
    return this.get('mobItemsById', () => new DataLoader(ids => this.loadMobItemsById(ids), { batch: true })).load(id)
  }

  getMobItemsByMobId(id: number | number[]) {
    return this.get('mobItemsByMobId', () => new DataLoader(ids => this.loadMobItemsByMobId(ids), { batch: true })).load(id)
  }

  getMobItemsByItemId(id: number | number[]) {
    return this.get('mobItemsByItemId', () => new DataLoader(ids => this.loadMobItemsByItemId(ids), { batch: true })).load(id)
  }


  getMobRankItems(options?: MobRankItemOptions) {
    return this.get('mobRankItems', () => new DataLoader(options => Container.get(MobServiceToken).getMobRankItems(options))).load(options)
  }

  getMobRankItemsById(id: number | number[]) {
    return this.get('mobRankItemsById', () => new DataLoader(ids => this.loadMobRankItemsById(ids), { batch: true })).load(id)
  }

  getMobRankItemsByItemId(id: number | number[]) {
    return this.get('mobRankItemsByItemId', () => new DataLoader(ids => this.loadMobRankItemsByItemId(ids), { batch: true })).load(id)
  }

  getMobRankItemsByMobRankId(id: number | number[]) {
    return this.get('mobRankItemsByMobRankId', () => new DataLoader(ids => this.loadMobRankItemsByMobRankId(ids), { batch: true })).load(id)
  }


  getMobGroups(options?: MobGroupOptions) {
    return this.get('mobGroups', () => new DataLoader(options => Container.get(MobServiceToken).getMobGroups(options))).load(options)
  }

  getMobGroupsById(id: number | number[]) {
    return this.get('mobGroupsById', () => new DataLoader(ids => this.loadMobGroupsById(ids), { batch: true })).load(id)
  }


  getMobGroupMobs(options?: MobGroupMobOptions) {
    return this.get('mobGroupMobs', () => new DataLoader(options => Container.get(MobServiceToken).getMobGroupMobs(options))).load(options)
  }

  getMobGroupMobsById(id: number | number[]) {
    return this.get('mobGroupMobsById', () => new DataLoader(ids => this.loadMobGroupMobsById(ids), { batch: true })).load(id)
  }

  getMobGroupMobsByMobId(id: number | number[]) {
    return this.get('mobGroupMobsByMobId', () => new DataLoader(ids => this.loadMobGroupMobsByMobId(ids), { batch: true })).load(id)
  }

  getMobGroupMobsByMobGroupId(id: number | number[]) {
    return this.get('mobGroupMobsByMobGroupId', () => new DataLoader(ids => this.loadMobGroupMobsByMobGroupId(ids), { batch: true })).load(id)
  }


  getMobGroupGroups(options?: MobGroupOptions) {
    return this.get('mobGroupGroups', () => new DataLoader(options => Container.get(MobServiceToken).getMobGroupGroups(options))).load(options)
  }

  getMobGroupGroupsById(id: number | number[]) {
    return this.get('mobGroupGroupsById', () => new DataLoader(ids => this.loadMobGroupGroupsById(ids), { batch: true })).load(id)
  }


  getMobGroupGroupMobGroups(options?: MobGroupGroupMobGroupOptions) {
    return this.get('mobGroupGroupMobGroups', () => new DataLoader(options => Container.get(MobServiceToken).getMobGroupGroupMobGroups(options))).load(options)
  }

  getMobGroupGroupMobGroupsById(id: number | number[]) {
    return this.get('mobGroupGroupMobGroupsById', () => new DataLoader(ids => this.loadMobGroupGroupMobGroupsById(ids), { batch: true })).load(id)
  }

  getMobGroupGroupMobGroupsByMobGroupId(id: number | number[]) {
    return this.get('mobGroupGroupMobGroupsByMobGroupId', () => new DataLoader(ids => this.loadMobGroupGroupMobGroupsByMobGroupId(ids), { batch: true })).load(id)
  }

  getMobGroupGroupMobGroupsByMobGroupGroupId(id: number | number[]) {
    return this.get('mobGroupGroupMobGroupsByMobGroupGroupId', () => new DataLoader(ids => this.loadMobGroupGroupMobGroupsByMobGroupGroupId(ids), { batch: true })).load(id)
  }


  getMaps(options?: MapOptions) {
    return this.get('maps', () => new DataLoader(options => Container.get(MapServiceToken).getMaps(options))).load(options)
  }

  getMapsById(id: number | number[]) {
    return this.get('mapsById', () => new DataLoader(ids => this.loadMapsById(ids), { batch: true })).load(id)
  }


  getGuilds(options?: GuildOptions) {
    return this.get('guilds', () => new DataLoader(options => Container.get(GuildServiceToken).getGuilds(options))).load(options)
  }

  getGuildsById(id: number | number[]) {
    return this.get('guildsById', () => new DataLoader(ids => this.loadGuildsById(ids), { batch: true })).load(id)
  }


  getGuildMessages(options?: GuildGradeOptions) {
    return this.get('guildMessages', () => new DataLoader(options => Container.get(GuildServiceToken).getGuildMessages(options))).load(options)
  }


  getGuildGrades(options?: GuildGradeOptions) {
    return this.get('guildGrades', () => new DataLoader(options => Container.get(GuildServiceToken).getGuildGrades(options))).load(options)
  }

  getGuildGradesByGuildId(id: number | number[]) {
    return this.get('guildGradesByGuildId', () => new DataLoader(ids => this.loadGuildGradesByGuildId(ids), { batch: true })).load(id)
  }

  getGuildGradesByIdAndGuildId(id: number | number[], guildId: number | number[]) {
    return this.get('guildGradesByIdAndGuildId', () => new DataLoader(ids => this.loadGuildGradesByIdAndGuildId(ids), { batch: true })).load([id, guildId])
  }


  private get<Key = any, Value = any>(key: string, factory: () => IDataLoader<any, any>): IDataLoader<Key, Value> {
    this.loaders[key] = this.loaders[key] || factory()
    return this.loaders[key]
  }

  private async loadAccountsByIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getAccounts({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocalesByIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocales({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocalesByCodes(codes: (string | string[])[]) {
    const uCodes = unique(codes.flat())
    const entities = await this.getLocales({ code: [EntityFilterMethod.IN, uCodes] })

    return codes.map(code => {
      const items: any[] = []
      entities.map((entity: any) => [code].flat().includes(entity.code) ? items.push(entity) : null)
      return items
    })
  }

  private async loadCharactersById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getCharacters({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadCharactersByAccountId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getCharacters({ accountId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.accountId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadCharactersByGuildId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getCharacters({ guildId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.guildId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadItemsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getItems({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadItemsByName(names: (string | string[])[]) {
    const entities = await this.getItems({ name: [EntityFilterMethod.IN, names.flat()] })

    return names.map(name => {
      const items: any[] = []
      entities.map((entity: any) => [name].flat().includes(entity.name) ? items.push(entity) : null)
      return items
    })
  }

  private async loadItemAttributesById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getItemAttributes({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadItemRareAttributesById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getItemAttributes({ id: [EntityFilterMethod.IN, uIds], rare: true })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMapsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMaps({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobs({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadGuildsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getGuilds({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadGuildGradesByGuildId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getGuildGrades({ guildId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.guildId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadGuildGradesByIdAndGuildId(ids: (number | number[])[]) {
    let gradeIds: number[] = []
    let guildIds: number[] = []

    ids.map(([gradeId, guildId]: any) => {
      gradeIds = [...gradeIds, ...[gradeId].flat()]
      guildIds = [...guildIds, ...[guildId].flat()]
    })

    const uGradeIds = unique(gradeIds.flat())
    const uGuildIds = unique(guildIds.flat())

    const entities = await this.getGuildGrades({
      id: [EntityFilterMethod.IN, uGradeIds],
      guildId: [EntityFilterMethod.IN, uGuildIds]
    })

    return ids.map(([id, guildId]: any) => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) && [guildId].flat().includes(entity.guildId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocaleItemsByIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocaleItems({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocaleItemsByItemIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocaleItems({ itemId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.itemId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocaleItemsByLocaleIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocaleItems({ localeId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.localeId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocaleMobsByIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocaleMobs({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocaleMobsByMobIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocaleMobs({ mobId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.mobId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadLocaleMobsByLocaleIds(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getLocaleMobs({ localeId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.localeId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobItemsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobItems({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobItemsByMobId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobItems({ mobId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.mobId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobItemsByItemId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobItems({ itemId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.itemId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobRankItemsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobRankItems({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobRankItemsByItemId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobRankItems({ itemId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.itemId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobRankItemsByMobRankId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobRankItems({ mobRankId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.rankId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroups({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupGroupsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupGroups({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupMobsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupMobs({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupMobsByMobId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupMobs({ mobId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.mobId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupMobsByMobGroupId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupMobs({ mobGroupId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.mobGroupId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupGroupMobGroupsById(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupGroupMobGroups({ id: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.id) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupGroupMobGroupsByMobGroupId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupGroupMobGroups({ mobGroupId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.mobGroupId) ? items.push(entity) : null)
      return items
    })
  }

  private async loadMobGroupGroupMobGroupsByMobGroupGroupId(ids: (number | number[])[]) {
    const uIds = unique(ids.flat())
    const entities = await this.getMobGroupGroupMobGroups({ mobGroupGroupId: [EntityFilterMethod.IN, uIds] })

    return ids.map(id => {
      const items: any[] = []
      entities.map((entity: any) => [id].flat().includes(entity.mobGroupGroupId) ? items.push(entity) : null)
      return items
    })
  }

}