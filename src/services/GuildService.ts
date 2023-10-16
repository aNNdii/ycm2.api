import { Container, Token } from "../infrastructures/Container"

import { ErrorMessage } from "../interfaces/ErrorMessage"
import { EntityFilter } from "../interfaces/Entity"

import { GuildRepositoryToken } from "../repositories/GuildRepository"

import { GuildMessageProperties, IGuildMessage } from "../entities/GuildMessage"
import { GuildGradeProperties, IGuildGrade } from "../entities/GuildGrade"
import { GuildProperties, IGuild } from "../entities/Guild"

import { PaginationOptions } from "./PaginationService"
import { EntityService, IEntityService } from "./EntityService"

export const GuildServiceToken = new Token<IGuildService>("GuildService")

export type GuildOptions = PaginationOptions & {
  id?: EntityFilter<number>
}

export type GuildGradeOptions = {
  id?: EntityFilter<number>
  guildId?: EntityFilter<number>
}

export type GuildMessageOptions = PaginationOptions & {
  id?: EntityFilter<number>
  guildId?: EntityFilter<number>
}

export type GuildServiceOptions = {
  guildObfuscationSalt: string
  guildMessageObfuscationSalt: string
}

export type IGuildService = IEntityService & {
  obfuscateGuildId(id: any): string
  deobfuscateGuildId(value: string | string[]): number[]

  obfuscateGuildMessageId(id: any): string
  deobfuscateGuildMessageId(value: string | string[]): number[]

  getGuildPaginationOptions(args: any): PaginationOptions
  getGuildMessagePaginationOptions(args: any): PaginationOptions

  getGuilds(options?: GuildOptions): Promise<IGuild[]>
  getGuildGrades(options?: GuildGradeOptions): Promise<IGuildGrade[]>
  getGuildMessages(options?: GuildMessageOptions): Promise<IGuildMessage[]>
}

export class GuildService extends EntityService<GuildServiceOptions> implements IGuildService {

  obfuscateGuildId(id: any) {
    return this.obfuscateId(id, { salt: this.options.guildObfuscationSalt })
  }

  deobfuscateGuildId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.GUILD_INVALID_ID,
      salt: this.options.guildObfuscationSalt,
    })
  }

  obfuscateGuildMessageId(id: any) {
    return this.obfuscateId(id, { salt: this.options.guildMessageObfuscationSalt })
  }

  deobfuscateGuildMessageId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.GUILD_MESSAGE_INVALID_ID,
      salt: this.options.guildMessageObfuscationSalt,
    })
  }

  getGuildPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateGuildId(offset) })
  }

  getGuildMessagePaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateGuildMessageId(offset) })
  }

  getGuilds(options?: GuildOptions) {
    const {
      id,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getGuilds", options)

    const guildRepository = Container.get(GuildRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'guild.id' })

    const filter: GuildProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["guild.id"] = id

    return guildRepository.getGuilds({ filter, where, order, limit })
  }

  getGuildGrades(options?: GuildGradeOptions) {
    const {
      id,
      guildId
    } = options || {}

    this.log("getGuildGrades", options)

    const guildRepository = Container.get(GuildRepositoryToken)

    const filter: GuildGradeProperties = {}

    if (id) filter["guild_grade.grade"] = id
    if (guildId) filter["guild_grade.guild_id"] = guildId

    return guildRepository.getGuildGrades({ filter })
  }

  getGuildMessages(options?: GuildMessageOptions) {
    const {
      id,
      guildId,
      orderId,
      offset,
      limit
    } = options || {}

    const guildRepository = Container.get(GuildRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'guild_comment.id' })

    const filter: GuildMessageProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["guild_comment.id"] = id
    if (guildId) filter["guild_comment.guild_id"] = guildId

    return guildRepository.getGuildMessages({ filter, where, order, limit })
  }

}